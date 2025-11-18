// Text Analysis Utilities

import type { TextResponse, Theme, WordFrequency } from '@/lib/types/textAnalysis';
import type { SurveyData } from '@/lib/types/survey';

// Norwegian stopwords - common words to exclude from analysis
const NORWEGIAN_STOPWORDS = [
  'og', 'i', 'å', 'er', 'for', 'det', 'på', 'med', 'til', 'av',
  'som', 'en', 'at', 'den', 'var', 'har', 'ikke', 'eller', 'mer',
  'når', 'blir', 'kan', 'ville', 'skulle', 'hadde', 'fra', 'også',
  'være', 'denne', 'men', 'om', 'enn', 'da', 'ved', 'så', 'jeg',
  'de', 'meg', 'sin', 'sitt', 'alle', 'hvis', 'noe', 'bare', 'dere',
  'sin', 'deres', 'kunne', 'han', 'hun', 'seg', 'oss', 'opp', 'ned',
  'ut', 'inn', 'over', 'under', 'etter', 'før', 'siden', 'skal',
  'vil', 'må', 'får', 'tar', 'gir', 'går', 'kom', 'ble', 'bli'
];

// Theme definitions
export const THEMES: Theme[] = [
  {
    name: 'Boligtyper',
    keywords: ['leilighet', 'enebolig', 'blokk', 'rekkehus', 'bolig', 'bygg', 'boliger', 'lavblokk', 'leiligheter'],
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: '🏘️'
  },
  {
    name: 'Tomter & Regulering',
    keywords: ['tomt', 'regulere', 'utvikling', 'eiendom', 'grunn', 'skille', 'tomter', 'regulering', 'utvikle'],
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: '📐'
  },
  {
    name: 'Økonomi',
    keywords: ['pris', 'avgift', 'kostnad', 'tilskudd', 'støtte', 'lån', 'betale', 'avgifter', 'økonomi', 'høy', 'høye'],
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: '💰'
  },
  {
    name: 'Omsorg & Tilgjengelighet',
    keywords: ['omsorg', 'eldre', 'tilgjengelighet', 'helse', 'redusert', 'omsorgsbolig', 'omsorgstjenester', 'tilpasset'],
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: '🏥'
  },
  {
    name: 'Infrastruktur',
    keywords: ['skole', 'butikk', 'tjeneste', 'møteplass', 'kafé', 'transport', 'barnehage', 'samfunnshus'],
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    icon: '🏫'
  },
  {
    name: 'Natur & Beliggenhet',
    keywords: ['natur', 'utsikt', 'vatn', 'sol', 'rolig', 'landlig', 'friluftsliv', 'naturlig', 'solforhold'],
    color: 'bg-teal-100 text-teal-800 border-teal-200',
    icon: '🌲'
  }
];

/**
 * Extract all free-text responses from survey data
 */
export function extractTextResponses(data: SurveyData): TextResponse[] {
  const responses: TextResponse[] = [];

  data.sheets[0].responses.forEach(response => {
    // Field 1: Boligpolitikk innspill
    const text1 = response.data.metadata?.har_du_andre_innspill_til_kommunens_arbeid_med_boligpolitikk_boligtilbud_eller_tomteutvikling;
    if (typeof text1 === 'string' && text1 !== 'Unset' && text1 !== '.' && text1.trim().length > 15) {
      responses.push({
        id: response.response_id,
        text: text1.trim(),
        field: 'boligpolitikk',
        demografi: {
          alder: response.data.demografi?.hva_er_din_alder || 'Ikke oppgitt',
          kjønn: response.data.demografi?.kjønn || 'Ikke oppgitt',
          lokasjon: response.data.diverse?.hvor_i_rendalen_kommune_bor_du || 'Ikke oppgitt'
        },
        timestamp: response.data.metadata?.fullføringstidspunkt || '',
        themes: [],
        sentiment: 'neutral'
      });
    }

    // Field 2: Tomt-årsak
    const text2 = response.data.tomt_og_eiendom?.hvis_du_har_vurdert_å_skille_ut_tomt_hva_er_den_viktigste_årsaken_til_at_det_ikke_har_blitt_gjort;
    if (typeof text2 === 'string' && text2 !== 'Unset' && text2 !== '.' && text2.trim().length > 15) {
      responses.push({
        id: response.response_id,
        text: text2.trim(),
        field: 'tomt_årsak',
        demografi: {
          alder: response.data.demografi?.hva_er_din_alder || 'Ikke oppgitt',
          kjønn: response.data.demografi?.kjønn || 'Ikke oppgitt',
          lokasjon: response.data.diverse?.hvor_i_rendalen_kommune_bor_du || 'Ikke oppgitt'
        },
        timestamp: response.data.metadata?.fullføringstidspunkt || '',
        themes: [],
        sentiment: 'neutral'
      });
    }
  });

  return responses;
}

/**
 * Extract keywords and word frequencies from texts
 */
export function extractKeywords(texts: string[], minFrequency: number = 2): WordFrequency[] {
  const wordCounts: Record<string, number> = {};

  texts.forEach(text => {
    if (!text || typeof text !== 'string') return;

    // Normalize and clean text
    const words = text
      .toLowerCase()
      .replace(/[.,!?;:()[\]{}]/g, ' ')  // Remove punctuation
      .replace(/\s+/g, ' ')              // Normalize whitespace
      .trim()
      .split(' ');

    words.forEach(word => {
      // Filter out:
      // - Short words (< 4 chars)
      // - Stopwords
      // - Numbers
      if (
        word.length >= 4 &&
        !NORWEGIAN_STOPWORDS.includes(word) &&
        !/^\d+$/.test(word)
      ) {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      }
    });
  });

  // Convert to array and filter by minimum frequency
  return Object.entries(wordCounts)
    .filter(([_, count]) => count >= minFrequency)
    .map(([text, value]) => ({ text, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 100);  // Top 100 words
}

/**
 * Categorize a text by theme
 */
export function categorizeByTheme(text: string): Theme[] {
  const matchedThemes: Theme[] = [];
  const lowerText = text.toLowerCase();

  THEMES.forEach(theme => {
    const matches = theme.keywords.filter(keyword =>
      lowerText.includes(keyword)
    );

    if (matches.length > 0) {
      matchedThemes.push(theme);
    }
  });

  return matchedThemes;
}

/**
 * Analyze sentiment of text (simple keyword-based)
 */
export function analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
  const lowerText = text.toLowerCase();

  const positiveWords = [
    'bra', 'flott', 'fint', 'positivt', 'optimisme', 'viktig',
    'heier', 'godt', 'bedre', 'fornøyd', 'bør', 'fantastisk',
    'gleder', 'fantastisk', 'supert', 'interessant'
  ];

  const negativeWords = [
    'problem', 'utfordring', 'høy', 'mangel', 'dårlig', 'mangler',
    'vanskelig', 'hindring', 'umulig', 'dyrt', 'komplisert',
    'savner', 'krevende', 'kostbart'
  ];

  let positiveCount = 0;
  let negativeCount = 0;

  positiveWords.forEach(word => {
    if (lowerText.includes(word)) positiveCount++;
  });

  negativeWords.forEach(word => {
    if (lowerText.includes(word)) negativeCount++;
  });

  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

/**
 * Categorize all responses with themes and sentiment
 */
export function categorizeResponses(responses: TextResponse[]): TextResponse[] {
  return responses.map(response => ({
    ...response,
    themes: categorizeByTheme(response.text).map(t => t.name),
    sentiment: analyzeSentiment(response.text)
  }));
}

/**
 * Group responses by theme
 */
export function groupByTheme(responses: TextResponse[]): Record<string, TextResponse[]> {
  const grouped: Record<string, TextResponse[]> = {};

  // Initialize all themes
  THEMES.forEach(theme => {
    grouped[theme.name] = [];
  });
  grouped['Annet'] = [];

  responses.forEach(response => {
    if (response.themes.length === 0) {
      grouped['Annet'].push(response);
    } else {
      // Add to primary theme (first match)
      grouped[response.themes[0]].push(response);
    }
  });

  return grouped;
}

/**
 * Get statistics about text responses
 */
export function getTextStatistics(responses: TextResponse[]) {
  const lengths = responses.map(r => r.text.length);
  const avgLength = Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length);
  const maxLength = Math.max(...lengths);
  const minLength = Math.min(...lengths);

  const sentimentCounts = {
    positive: responses.filter(r => r.sentiment === 'positive').length,
    negative: responses.filter(r => r.sentiment === 'negative').length,
    neutral: responses.filter(r => r.sentiment === 'neutral').length
  };

  const fieldCounts = {
    boligpolitikk: responses.filter(r => r.field === 'boligpolitikk').length,
    tomt_årsak: responses.filter(r => r.field === 'tomt_årsak').length
  };

  return {
    total: responses.length,
    avgLength,
    maxLength,
    minLength,
    sentimentCounts,
    fieldCounts
  };
}
