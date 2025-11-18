'use client';

import type { TextResponse } from '@/lib/types/textAnalysis';

interface KeyInsightsProps {
  responses: TextResponse[];
  maxInsights?: number;
}

export function KeyInsights({ responses, maxInsights = 5 }: KeyInsightsProps) {
  // Select key insights based on:
  // 1. Sentiment (prioritize positive and negative over neutral)
  // 2. Length (prefer substantial responses)
  // 3. Theme diversity (try to cover different themes)

  const scoredResponses = responses.map(response => {
    let score = 0;

    // Sentiment score
    if (response.sentiment === 'positive') score += 3;
    if (response.sentiment === 'negative') score += 2;

    // Length score (prefer 50-300 chars)
    const length = response.text.length;
    if (length >= 50 && length <= 300) score += 2;
    else if (length > 300) score += 1;

    // Theme score (prefer responses with themes)
    score += response.themes.length;

    return { response, score };
  });

  // Sort by score and take top N
  const topInsights = scoredResponses
    .sort((a, b) => b.score - a.score)
    .slice(0, maxInsights)
    .map(item => item.response);

  if (topInsights.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">💡</span>
        <h3 className="text-lg font-semibold text-neutral-900">Viktigste Innsikter</h3>
      </div>

      <p className="text-sm text-neutral-600 mb-4">
        Utvalgte sitater som representerer sentrale tema og synspunkter
      </p>

      <div className="space-y-4">
        {topInsights.map((response, idx) => (
          <div
            key={`${response.id}-${idx}`}
            className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500"
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl flex-shrink-0">
                {idx === 0 ? '⭐' : idx === 1 ? '🌟' : '✨'}
              </span>
              <div className="flex-1">
                <p className="text-neutral-900 italic mb-3 leading-relaxed">
                  &ldquo;{response.text}&rdquo;
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-600">
                  <span>👤 {response.demografi.kjønn}, {response.demografi.alder}</span>
                  <span>📍 {response.demografi.lokasjon}</span>
                  {response.themes.length > 0 && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      {response.themes[0]}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
