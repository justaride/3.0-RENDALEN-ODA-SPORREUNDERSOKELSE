# Fritekst-analyse - Komplett Plan
**Dato:** 18. november 2025
**Prosjekt:** Rendalen Boligbehovsundersøkelse

---

## 📊 DATAGRUNNLAG - ANALYSE

### Fritekst-felt Identifisert

**1. Innspill til kommunens boligpolitikk**
```
Felt: "Har du andre innspill til kommunens arbeid med boligpolitikk,
       boligtilbud eller tomteutvikling?"
Lokasjon: metadata.har_du_andre_innspill_til_kommunens_arbeid_med_boligpolitikk_boligtilbud_eller_tomteutvikling
```

**Statistikk:**
- ✅ **161 svar** av 1015 respondenter (16%)
- ✅ **Gjennomsnittlig lengde:** 163 tegn per svar
- ✅ **Total tekstmengde:** 26,227 tegn
- ✅ **Kvalitetssvar (>15 tegn):** 143 svar

**2. Årsak til ikke utskilt tomt**
```
Felt: "Hvis du har vurdert å skille ut tomt, hva er den viktigste årsaken
       til at det ikke har blitt gjort?"
Lokasjon: tomt_og_eiendom.hvis_du_har_vurdert_å_skille_ut_tomt_hva_er_den_viktigste_årsaken_til_at_det_ikke_har_blitt_gjort
```

**Statistikk:**
- ✅ **97 svar** av 1015 respondenter (10%)
- ✅ **Gjennomsnittlig lengde:** 60 tegn per svar
- ✅ **Total tekstmengde:** 5,805 tegn

**TOTALT:**
- ✅ **258 unike fritekst-svar**
- ✅ **32,032 tegn totalt**
- ✅ **God representasjon** (16% + 10% av alle respondenter)

---

## 🎯 IDENTIFISERTE TEMAER (Fra Sample-analyse)

Basert på de 15 første svarene identifiserer jeg følgende hovedtemaer:

### 1. **Boligtyper & Utvikling** (Høy frekvens)
- "Bygg leiligheter, 3 el 4 roms"
- "Lavblokker med balkong / terrasse"
- "Bygge leiligheter som er lettstelte for eldre"
- "Boliger til de som ønsker å flytte til Rendalen"

### 2. **Tomteutvikling & Regulering** (Høy frekvens)
- "Utvikle tomter der folk ønsker å bo"
- "Det jobbes med regulering av flere tomter"
- "Fine og naturnære tomter"
- "Utsikt til vatn, gode lys/solforhold"

### 3. **Kommunale Avgifter & Økonomi** (Middels frekvens)
- "Meget høye kommunale avgifter, spes vann- og avløp"
- "Kommunen hadde tilskudd til de som bygget ny bolig"
- "Ordningen bør komme tilbake"

### 4. **Omsorg & Tilgjengelighet** (Middels frekvens)
- "Boligtilbud med tanke på rasjonell bruk i omsorgstjenestene"
- "Bedre tilbud på omsorgsboliger / utleieboliger"
- "Lettstelte boliger for eldre"

### 5. **Infrastruktur & Service** (Middels frekvens)
- "Skolesituasjonen må være god"
- "Møteplass for voksne, arbeidsføre"
- "Ikke sitte å drikke kaffe midt på dagen"

### 6. **Positivitet & Optimisme** (Lav frekvens)
- "Jeg heier på tiltaket"
- "Tegn som peker på optimisme og vilje i bygda"
- "Interessant undersøkelse"

---

## 💡 ANBEFALT LØSNING - 3 NIVÅER

### **NIVÅ 1: GRUNNLEGGENDE (MINIMUM VIABLE)**
*Estimert tid: 2-3 timer*

**Komponenter:**
1. ✅ **TextList** - Enkel liste med alle fritekst-svar
2. ✅ **Basic filtering** - Filter basert på demografi
3. ✅ **Word frequency** - Enkel ordfrekvens-tabell

**Implementasjon:**
```typescript
// src/app/innspill/page.tsx
- Vis alle 258 fritekst-svar i en paginert liste
- Gruppér etter spørsmålstype (Felt 1 vs Felt 2)
- Filter med eksisterende FilterBar
- Søkefunksjon (finn tekst i svar)
```

**Leveranse:**
- 📄 `/innspill` side med sortert liste
- 🔍 Søkefunksjonalitet
- 📊 Enkel statistikk (antall svar, gjennomsnittlig lengde)

---

### **NIVÅ 2: STANDARD (ANBEFALT)**
*Estimert tid: 4-6 timer*

**Komponenter (i tillegg til Nivå 1):**
1. ✅ **WordCloud** - Visuell ordsky
2. ✅ **ThemeCards** - Automatisk tematisk kategorisering
3. ✅ **SentimentIndicator** - Enkel positiv/negativ/nøytral
4. ✅ **KeyInsights** - Utvalgte sitater (mest relevante)

**Implementasjon:**

**A. WordCloud med react-wordcloud**
```typescript
// src/components/charts/WordCloud.tsx
import ReactWordcloud from 'react-wordcloud';

interface WordCloudProps {
  texts: string[];
  title: string;
  minFrequency?: number;
}

// Ekskluder norske stoppord:
const NORWEGIAN_STOPWORDS = [
  'og', 'i', 'å', 'er', 'for', 'det', 'på', 'med', 'til', 'av',
  'som', 'en', 'at', 'den', 'var', 'har', 'ikke', 'eller', 'mer',
  'når', 'blir', 'kan', 'ville', 'skulle', 'hadde', 'fra', 'også'
];

export function extractKeywords(texts: string[]): Array<{text: string, value: number}> {
  const wordCounts: Record<string, number> = {};

  texts.forEach(text => {
    if (!text || typeof text !== 'string') return;

    // Normalisering:
    const words = text
      .toLowerCase()
      .replace(/[.,!?;:]/g, '')  // Fjern tegnsetting
      .split(/\s+/);

    words.forEach(word => {
      // Filtrer:
      if (word.length > 3 && !NORWEGIAN_STOPWORDS.includes(word)) {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      }
    });
  });

  // Konvertér til wordcloud format:
  return Object.entries(wordCounts)
    .map(([text, value]) => ({ text, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 100);  // Topp 100 ord
}
```

**B. Tematisk Kategorisering**
```typescript
// src/lib/utils/textAnalysis.ts

interface Theme {
  name: string;
  keywords: string[];
  color: string;
  icon: string;
}

export const THEMES: Theme[] = [
  {
    name: 'Boligtyper',
    keywords: ['leilighet', 'enebolig', 'blokk', 'rekkehus', 'bolig', 'bygg'],
    color: 'bg-blue-100 text-blue-800',
    icon: '🏘️'
  },
  {
    name: 'Tomter & Regulering',
    keywords: ['tomt', 'regulere', 'utvikling', 'eiendom', 'grunn', 'skille'],
    color: 'bg-green-100 text-green-800',
    icon: '📐'
  },
  {
    name: 'Økonomi',
    keywords: ['pris', 'avgift', 'kostnad', 'tilskudd', 'støtte', 'lån'],
    color: 'bg-yellow-100 text-yellow-800',
    icon: '💰'
  },
  {
    name: 'Omsorg & Tilgjengelighet',
    keywords: ['omsorg', 'eldre', 'tilgjengelighet', 'helse', 'redusert'],
    color: 'bg-purple-100 text-purple-800',
    icon: '🏥'
  },
  {
    name: 'Infrastruktur',
    keywords: ['skole', 'butikk', 'tjeneste', 'møteplass', 'kafé', 'transport'],
    color: 'bg-orange-100 text-orange-800',
    icon: '🏫'
  },
  {
    name: 'Natur & Beliggenhet',
    keywords: ['natur', 'utsikt', 'vatn', 'sol', 'rolig', 'landlig'],
    color: 'bg-teal-100 text-teal-800',
    icon: '🌲'
  }
];

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

export function groupByTheme(responses: TextResponse[]): Record<string, TextResponse[]> {
  const grouped: Record<string, TextResponse[]> = {};

  THEMES.forEach(theme => {
    grouped[theme.name] = [];
  });
  grouped['Annet'] = [];

  responses.forEach(response => {
    const themes = categorizeByTheme(response.text);

    if (themes.length === 0) {
      grouped['Annet'].push(response);
    } else {
      // Add to primary theme (first match)
      grouped[themes[0].name].push(response);
    }
  });

  return grouped;
}
```

**C. Sentiment Analyse (Enkel)**
```typescript
export function analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
  const lowerText = text.toLowerCase();

  const positiveWords = [
    'bra', 'flott', 'fint', 'positivt', 'optimisme', 'viktig',
    'heier', 'godt', 'bedre', 'fornøyd'
  ];

  const negativeWords = [
    'problem', 'utfordring', 'høy', 'mangel', 'ikke', 'dårlig',
    'vanskelig', 'hindring', 'mangler'
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
```

**Leveranse:**
- 📊 WordCloud med topp 100 ord
- 🏷️ 6 tematiske kategorier med ikoner
- 😊 Sentiment-indikator (positiv/negativ/nøytral)
- 💡 "Viktigste Innsikter" - kurerte sitater

---

### **NIVÅ 3: AVANSERT (PREMIUM)**
*Estimert tid: 8-12 timer*

**Komponenter (i tillegg til Nivå 2):**
1. ✅ **AI-drevet tematisering** (OpenAI API / Claude API)
2. ✅ **Interaktiv tema-explorer**
3. ✅ **Demografisk kryssanalyse** (Hvem sier hva?)
4. ✅ **Export til strukturert rapport**
5. ✅ **Admin-verktøy for manuell kategorisering**

**Implementasjon:**

**A. AI-Tematisering (Optional)**
```typescript
// src/lib/ai/themeExtraction.ts
import Anthropic from '@anthropic-ai/sdk';

export async function extractThemesWithAI(
  texts: string[]
): Promise<Array<{theme: string, examples: string[], count: number}>> {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });

  const prompt = `
Analyser følgende ${texts.length} fritekst-svar fra en boligbehovsundersøkelse
i Rendalen kommune. Identifiser 5-8 hovedtemaer og gruppér svarene.

SVAR:
${texts.map((t, i) => `[${i+1}] ${t}`).join('\n\n')}

Returner JSON:
{
  "themes": [
    {
      "theme": "Tema-navn",
      "description": "Kort beskrivelse",
      "count": 25,
      "examples": ["Eksempel 1", "Eksempel 2", "Eksempel 3"]
    }
  ]
}
`;

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4000,
    messages: [{
      role: 'user',
      content: prompt
    }]
  });

  // Parse og returner
  const content = message.content[0].text;
  const result = JSON.parse(content);
  return result.themes;
}
```

**B. Demografisk Kryssanalyse**
```typescript
// Eksempel: Hvem nevner "tomter" mest?
export function analyzeDemographicPatterns(
  responses: TextResponse[],
  keyword: string
): Record<string, number> {
  const ageGroups: Record<string, number> = {};

  responses.forEach(response => {
    if (response.text.toLowerCase().includes(keyword)) {
      const age = response.demografi.alder;
      ageGroups[age] = (ageGroups[age] || 0) + 1;
    }
  });

  return ageGroups;
}
```

**Leveranse:**
- 🤖 AI-genererte tema-insights
- 📊 Demografisk kryssanalyse ("Hvem sier hva?")
- 📈 Interaktiv tema-explorer med drill-down
- 📄 Eksport til strukturert PDF-rapport

---

## 🎨 UI/UX DESIGN - FORSLAG

### Layout for `/innspill` side

```
┌─────────────────────────────────────────────────────┐
│  HEADER: Innspill fra Innbyggerne                  │
│  "161 innspill mottatt (16% av respondentene)"     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  FILTER BAR (samme som andre sider)                │
│  [Alder] [Kjønn] [Lokasjon] [Husstand]            │
└─────────────────────────────────────────────────────┘

┌──────────────────────┬──────────────────────────────┐
│  📊 OVERSIKT         │  🔍 SØKEFILTER               │
│                      │                              │
│  Total innspill: 161 │  [Søk i tekst...]           │
│  Gjennomsnitt: 163   │                              │
│  Lengste: 487 tegn   │  [Tema-filter dropdown]     │
│                      │  [ ] Boligtyper              │
│                      │  [ ] Tomter                  │
│                      │  [ ] Økonomi                 │
└──────────────────────┴──────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  💬 ORDSKY (WordCloud)                             │
│                                                     │
│       bolig    tomt    leilighet                   │
│   kommunen        regulering    utvikling          │
│       område    boliger    folk                    │
│           tilbud      tomter    bygge              │
│                                                     │
└─────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  🏷️ TEMAER (6 cards, 2x3 grid)              │
│                                              │
│  ┌───────────┐  ┌───────────┐  ┌──────────┐│
│  │🏘️ Bolig   │  │📐 Tomter  │  │💰 Økonomi││
│  │45 innspill│  │38 innspill│  │22 innsp. ││
│  └───────────┘  └───────────┘  └──────────┘│
│                                              │
│  ┌───────────┐  ┌───────────┐  ┌──────────┐│
│  │🏥 Omsorg  │  │🏫 Infra   │  │🌲 Natur  ││
│  │18 innspill│  │15 innspill│  │12 innsp. ││
│  └───────────┘  └───────────┘  └──────────┘│
└──────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  💡 VIKTIGSTE INNSIKTER (Kurerte sitater)          │
│                                                     │
│  ⭐ "Utvikle tomter der folk ønsker å bo..."       │
│     - Mann, 40-49 år, Øvre Rendal                  │
│                                                     │
│  ⭐ "Bygg leiligheter, 3 el 4 roms..."             │
│     - Kvinne, 60-69 år, Bergset                    │
│                                                     │
│  [Vis flere innsikter]                             │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  📝 ALLE INNSPILL (Paginert liste)                 │
│                                                     │
│  [Filter: Alle tema ▼] [Sorter: Nyeste først ▼]   │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │ #1 - Boligpolitikk                            │ │
│  │ 🏷️ Boligtyper, Omsorg                         │ │
│  │                                               │ │
│  │ "Utvikle boligtilbud med tanke på rasjonell  │ │
│  │  bruk av tid og ressurser i omsorgs..."      │ │
│  │                                               │ │
│  │ 👤 Mann, 40-49 år, Bergset                    │ │
│  │ 📅 2025-09-25                                 │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  [... flere innspill ...]                          │
│                                                     │
│  [Paginering: 1 2 3 4 5 ... 11]                   │
└─────────────────────────────────────────────────────┘
```

---

## 🛠️ TEKNISK IMPLEMENTERING

### Package Dependencies

```json
{
  "dependencies": {
    "react-wordcloud": "^1.2.7",        // WordCloud
    "@anthropic-ai/sdk": "^0.30.1",     // AI (Optional - Nivå 3)
    "natural": "^6.12.0"                // NLP (Optional)
  }
}
```

### File Structure

```
src/
├── app/
│   └── innspill/
│       └── page.tsx                    # Main page
│
├── components/
│   ├── charts/
│   │   └── WordCloud.tsx               # Word cloud component
│   │
│   └── text-analysis/                  # NEW folder
│       ├── TextList.tsx                # Fritekst liste
│       ├── ThemeCard.tsx               # Tema kort
│       ├── SentimentBadge.tsx          # Sentiment indicator
│       ├── KeyInsights.tsx             # Highlighted quotes
│       ├── TextSearchBar.tsx           # Søkefelt
│       └── DemographicBreakdown.tsx    # Demografisk analyse
│
└── lib/
    └── utils/
        └── textAnalysis.ts             # Text processing utilities
```

### Type Definitions

```typescript
// src/lib/types/textAnalysis.ts

export interface TextResponse {
  id: number;
  text: string;
  field: 'boligpolitikk' | 'tomt_årsak';
  demografi: {
    alder: string;
    kjønn: string;
    lokasjon: string;
  };
  timestamp: string;
  themes: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface Theme {
  name: string;
  keywords: string[];
  color: string;
  icon: string;
  count: number;
}

export interface WordFrequency {
  text: string;
  value: number;
}
```

---

## 📈 IMPLEMENTERINGSPLAN - STEG-FOR-STEG

### ✅ FASE 1: Data Preparation (30 min)

**1.1 Create text processing utility**
```bash
touch src/lib/utils/textAnalysis.ts
```

**1.2 Implement text extraction**
```typescript
// Extract all free-text responses with metadata
export function extractTextResponses(data: SurveyData): TextResponse[] {
  const responses: TextResponse[] = [];

  data.sheets[0].responses.forEach(response => {
    // Felt 1: Boligpolitikk
    const text1 = response.data.metadata?.har_du_andre_innspill_til_kommunens_arbeid_med_boligpolitikk_boligtilbud_eller_tomteutvikling;
    if (typeof text1 === 'string' && text1.length > 15) {
      responses.push({
        id: response.response_id,
        text: text1,
        field: 'boligpolitikk',
        demografi: {
          alder: response.data.demografi.hva_er_din_alder,
          kjønn: response.data.demografi.kjønn,
          lokasjon: response.data.diverse.hvor_i_rendalen_kommune_bor_du
        },
        timestamp: response.data.metadata.fullføringstidspunkt,
        themes: [],
        sentiment: 'neutral'
      });
    }

    // Felt 2: Tomt årsak
    const text2 = response.data.tomt_og_eiendom?.hvis_du_har_vurdert_å_skille_ut_tomt_hva_er_den_viktigste_årsaken_til_at_det_ikke_har_blitt_gjort;
    if (typeof text2 === 'string' && text2.length > 15) {
      responses.push({
        id: response.response_id,
        text: text2,
        field: 'tomt_årsak',
        demografi: {
          alder: response.data.demografi.hva_er_din_alder,
          kjønn: response.data.demografi.kjønn,
          lokasjon: response.data.diverse.hvor_i_rendalen_kommune_bor_du
        },
        timestamp: response.data.metadata.fullføringstidspunkt,
        themes: [],
        sentiment: 'neutral'
      });
    }
  });

  return responses;
}
```

---

### ✅ FASE 2: Basic Components (1 time)

**2.1 Create TextList component**
```typescript
// src/components/text-analysis/TextList.tsx
export function TextList({ responses }: { responses: TextResponse[] }) {
  return (
    <div className="space-y-4">
      {responses.map((response, idx) => (
        <div key={idx} className="border rounded-lg p-4 bg-white shadow-sm">
          <div className="flex items-start justify-between mb-2">
            <span className="text-sm font-semibold text-neutral-700">
              #{response.id} - {response.field === 'boligpolitikk' ? 'Boligpolitikk' : 'Tomt-årsak'}
            </span>
            <span className="text-xs text-neutral-500">
              {new Date(response.timestamp).toLocaleDateString('nb-NO')}
            </span>
          </div>

          <p className="text-neutral-900 mb-3">{response.text}</p>

          <div className="flex items-center gap-3 text-xs text-neutral-600">
            <span>👤 {response.demografi.kjønn}, {response.demografi.alder}</span>
            <span>📍 {response.demografi.lokasjon}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
```

**2.2 Create basic /innspill page**
```typescript
// src/app/innspill/page.tsx
export default function InnspillPage() {
  const surveyData = getSurveyData();
  const textResponses = extractTextResponses(surveyData);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Innspill fra Innbyggerne</h1>
      <p className="text-neutral-600 mb-8">
        {textResponses.length} innspill mottatt ({Math.round(textResponses.length / 1015 * 100)}% av respondentene)
      </p>

      <TextList responses={textResponses} />
    </div>
  );
}
```

---

### ✅ FASE 3: WordCloud (1 time)

**3.1 Install dependency**
```bash
npm install react-wordcloud
```

**3.2 Create WordCloud component**
```typescript
// src/components/charts/WordCloud.tsx
'use client';

import ReactWordcloud from 'react-wordcloud';
import { extractKeywords } from '@/lib/utils/textAnalysis';

interface WordCloudProps {
  texts: string[];
  title: string;
}

export function WordCloud({ texts, title }: WordCloudProps) {
  const words = extractKeywords(texts);

  const options = {
    rotations: 2,
    rotationAngles: [0, 90],
    fontSizes: [12, 60] as [number, number],
    colors: ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'],
    enableTooltip: true,
    deterministic: true,
    fontFamily: 'Inter, sans-serif',
    padding: 2
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div style={{ height: 400 }}>
        <ReactWordcloud words={words} options={options} />
      </div>
    </div>
  );
}
```

---

### ✅ FASE 4: Theme Analysis (2 timer)

**4.1 Implement theme categorization**
```typescript
// Add to textAnalysis.ts
export function categorizeResponses(responses: TextResponse[]): TextResponse[] {
  return responses.map(response => ({
    ...response,
    themes: categorizeByTheme(response.text).map(t => t.name),
    sentiment: analyzeSentiment(response.text)
  }));
}
```

**4.2 Create ThemeCard component**
```typescript
// src/components/text-analysis/ThemeCard.tsx
export function ThemeCard({ theme, responses }: {
  theme: Theme,
  responses: TextResponse[]
}) {
  return (
    <div className={`rounded-lg border p-6 ${theme.color}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-3xl">{theme.icon}</span>
        <h3 className="text-lg font-semibold">{theme.name}</h3>
      </div>
      <p className="text-2xl font-bold mb-2">{responses.length}</p>
      <p className="text-sm">innspill</p>

      {responses.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm italic line-clamp-2">
            "{responses[0].text}"
          </p>
        </div>
      )}
    </div>
  );
}
```

---

### ✅ FASE 5: Enhanced Features (2 timer)

**5.1 Add search functionality**
**5.2 Add pagination**
**5.3 Add sorting options**
**5.4 Add demographic filtering**

---

## 📊 SUKSESSKRITERIER

### Funksjonelt:
- [ ] Alle 258 fritekst-svar er synlige
- [ ] WordCloud viser topp 100 ord korrekt
- [ ] 6 tematiske kategorier fungerer
- [ ] Søkefunksjon fungerer
- [ ] Demografisk filtrering fungerer
- [ ] Export til PDF inkluderer fritekst

### Teknisk:
- [ ] Norske tegn (æ, ø, å) bevares
- [ ] Stoppord filtreres ut korrekt
- [ ] Performance: <500ms for initial load
- [ ] TypeScript: Zero errors

### UX:
- [ ] Intuitiv navigasjon
- [ ] Responsive design
- [ ] Lesbar typography
- [ ] Tydelig feedback

---

## 🎯 ANBEFALING

**For Rendalen kommune anbefaler jeg:**

### **Start med NIVÅ 2 (Standard)**

**Hvorfor?**
1. ✅ **Best ROI** - 4-6 timers arbeid gir profesjonelt resultat
2. ✅ **Alle essensielle features** - WordCloud, temaer, sitater
3. ✅ **Ingen eksterne API-kostnader** - Alt kjører lokalt
4. ✅ **Lett å vedlikeholde** - Ingen komplekse AI-integrasjoner

**Unngå Nivå 3 (Premium) med mindre:**
- Dere har budsjett for AI API-kostnader (~$50-200/mnd)
- Dere trenger kontinuerlig oppdatering av temaer
- Dere har dedikert ressurs for vedlikehold

---

## ⏱️ ESTIMERT TIDSBRUK

| Fase | Nivå 1 | Nivå 2 | Nivå 3 |
|------|--------|--------|--------|
| Data prep | 30 min | 30 min | 30 min |
| Components | 1 time | 2 timer | 4 timer |
| Analysis logic | 30 min | 2 timer | 4 timer |
| UI/UX polish | 30 min | 1 time | 2 timer |
| Testing | 30 min | 1 time | 2 timer |
| **TOTALT** | **2-3 timer** | **4-6 timer** | **8-12 timer** |

---

## 📦 NESTE STEG

**Hvis du godkjenner Nivå 2:**

1. ✅ Installer `react-wordcloud`
2. ✅ Opprett `textAnalysis.ts` utility
3. ✅ Implementer WordCloud component
4. ✅ Implementer ThemeCard component
5. ✅ Opprett `/innspill` page
6. ✅ Test med alle 258 svar
7. ✅ Polish UI/UX
8. ✅ Integrer med eksisterende FilterBar

**Estimert leveringstid: 1 arbeidsdag** (4-6 timer)

---

**Rapport generert:** 18. november 2025
**Analysert av:** Claude Code (Sonnet 4.5)
**Prosjekt:** KOPI-3.0-RENDALEN-UNDERSOKELSE
