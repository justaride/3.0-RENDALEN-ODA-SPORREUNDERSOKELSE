'use client';

import React from 'react';
import type { WordFrequency } from '@/lib/types/textAnalysis';
import { extractKeywords } from '@/lib/utils/textAnalysis';

interface WordCloudProps {
  texts: string[];
  title: string;
  description?: string;
}

export function WordCloud({ texts, title, description }: WordCloudProps) {
  const words = extractKeywords(texts, 2);

  if (words.length === 0) {
    return (
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        {description && <p className="text-sm text-neutral-600 mb-4">{description}</p>}
        <div className="flex items-center justify-center h-96 text-neutral-500">
          Ingen data tilgjengelig for ordsky
        </div>
      </div>
    );
  }

  // Sort by frequency for display
  const sortedWords = [...words].sort((a, b) => b.value - a.value);
  const maxValue = sortedWords[0]?.value || 1;
  const minValue = sortedWords[sortedWords.length - 1]?.value || 1;

  // Calculate font size based on frequency
  const getFontSize = (value: number) => {
    const minSize = 14;
    const maxSize = 48;
    const normalized = (value - minValue) / (maxValue - minValue);
    return Math.round(minSize + normalized * (maxSize - minSize));
  };

  // Get color based on index
  const colors = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6'];
  const getColor = (index: number) => colors[index % colors.length];

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && <p className="text-sm text-neutral-600 mt-1">{description}</p>}
        <p className="text-xs text-neutral-500 mt-2">
          Viser topp {words.length} ord (størrelse indikerer hyppighet)
        </p>
      </div>

      {/* CSS-based word cloud */}
      <div className="relative bg-neutral-50 rounded-lg p-8" style={{ minHeight: 500 }}>
        <div className="flex flex-wrap gap-3 items-center justify-center">
          {sortedWords.map((word, index) => (
            <span
              key={word.text}
              className="inline-block px-2 py-1 rounded cursor-pointer transition-all hover:scale-110"
              style={{
                fontSize: `${getFontSize(word.value)}px`,
                color: getColor(index),
                fontWeight: word.value > maxValue * 0.7 ? 700 : word.value > maxValue * 0.4 ? 600 : 500
              }}
              title={`"${word.text}" nevnt ${word.value} ${word.value === 1 ? 'gang' : 'ganger'}`}
            >
              {word.text}
            </span>
          ))}
        </div>
      </div>

      {/* Top 10 words list */}
      <div className="mt-6 pt-6 border-t">
        <h4 className="text-sm font-semibold text-neutral-700 mb-3">Topp 10 mest brukte ord:</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {sortedWords.slice(0, 10).map((word, index) => (
            <div key={word.text} className="text-xs">
              <span className="font-semibold text-neutral-900">#{index + 1}</span>{' '}
              <span className="text-neutral-700">{word.text}</span>{' '}
              <span className="text-neutral-500">({word.value})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
