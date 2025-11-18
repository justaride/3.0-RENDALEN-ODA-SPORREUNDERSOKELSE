'use client';

import { ReactNode, useState } from 'react';
import type { DisplayMode } from '@/lib/types/survey';

interface ChartCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  showToggle?: boolean;
  displayMode?: DisplayMode;
  onDisplayModeChange?: (mode: DisplayMode) => void;
  showExpandToggle?: boolean;
  isExpanded?: boolean;
  onExpandToggle?: () => void;
  totalItems?: number;
  visibleItems?: number;
}

export function ChartCard({
  title,
  description,
  children,
  showToggle = false,
  displayMode = 'percent',
  onDisplayModeChange,
  showExpandToggle = false,
  isExpanded = false,
  onExpandToggle,
  totalItems,
  visibleItems,
}: ChartCardProps) {
  const [internalDisplayMode, setInternalDisplayMode] = useState<DisplayMode>(displayMode);

  const handleToggle = () => {
    const newMode = internalDisplayMode === 'percent' ? 'count' : 'percent';
    setInternalDisplayMode(newMode);
    onDisplayModeChange?.(newMode);
  };

  const currentDisplayMode = onDisplayModeChange ? displayMode : internalDisplayMode;

  return (
    <div className="chart-container">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="chart-title">{title}</h3>
          {description && (
            <p className="chart-description">{description}</p>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2">
          {showToggle && (
            <button
              onClick={handleToggle}
              className="btn-outline text-xs"
              aria-label={`Vis som ${currentDisplayMode === 'percent' ? 'antall' : 'prosent'}`}
            >
              {currentDisplayMode === 'percent' ? 'Vis antall' : 'Vis %'}
            </button>
          )}
        </div>
      </div>

      {/* Chart Content */}
      <div className="relative">
        {children}
      </div>

      {/* Expand Toggle */}
      {showExpandToggle && totalItems && visibleItems && totalItems > visibleItems && (
        <div className="mt-4 border-t pt-4 text-center">
          <button
            onClick={onExpandToggle}
            className="btn-outline w-full text-sm"
          >
            {isExpanded ? (
              <>
                <svg className="inline-block mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                Vis mindre
              </>
            ) : (
              <>
                <svg className="inline-block mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                Vis alle ({totalItems} totalt)
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
