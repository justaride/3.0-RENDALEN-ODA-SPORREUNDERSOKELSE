'use client';

import type { Theme } from '@/lib/types/textAnalysis';
import type { TextResponse } from '@/lib/types/textAnalysis';

interface ThemeCardProps {
  theme: Theme;
  responses: TextResponse[];
  onClick?: () => void;
}

export function ThemeCard({ theme, responses, onClick }: ThemeCardProps) {
  const hasResponses = responses.length > 0;

  return (
    <div
      className={`rounded-lg border-2 p-6 transition-all ${theme.color} ${
        hasResponses && onClick ? 'cursor-pointer hover:shadow-lg hover:scale-105' : 'opacity-75'
      }`}
      onClick={hasResponses && onClick ? onClick : undefined}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-4xl">{theme.icon}</span>
        <h3 className="text-lg font-semibold">{theme.name}</h3>
      </div>

      <div className="mb-3">
        <p className="text-3xl font-bold">{responses.length}</p>
        <p className="text-sm">{responses.length === 1 ? 'innspill' : 'innspill'}</p>
      </div>

      {hasResponses && (
        <div className="pt-3 border-t border-current/20">
          <p className="text-sm italic line-clamp-2">
            &ldquo;{responses[0].text}&rdquo;
          </p>
          {responses.length > 1 && (
            <p className="text-xs mt-2 opacity-75">
              +{responses.length - 1} flere innspill
            </p>
          )}
        </div>
      )}

      {!hasResponses && (
        <div className="pt-3 border-t border-current/20">
          <p className="text-xs opacity-75">Ingen innspill i denne kategorien</p>
        </div>
      )}
    </div>
  );
}
