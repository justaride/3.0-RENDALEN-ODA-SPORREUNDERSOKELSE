'use client';

import { BarChart } from './BarChart';
import type { ChartData } from '@/lib/types/survey';

interface HorizontalBarChartProps {
  data: ChartData[];
  title: string;
  description?: string;
  totalResponses: number;
  showAll?: boolean;
  topN?: number;
  color?: string;
}

/**
 * Horizontal Bar Chart - Optimized for multi-select questions
 * This is a specialized wrapper around BarChart with horizontal orientation
 */
export function HorizontalBarChart({
  data,
  title,
  description,
  totalResponses,
  showAll = false,
  topN = 10,
  color = '#10b981', // secondary color for multi-select
}: HorizontalBarChartProps) {
  return (
    <BarChart
      data={data}
      title={title}
      description={description || '(Flervalg - hver respondent kunne velge flere alternativer)'}
      totalResponses={totalResponses}
      orientation="horizontal"
      showAll={showAll}
      topN={topN}
      allowSorting
      color={color}
    />
  );
}
