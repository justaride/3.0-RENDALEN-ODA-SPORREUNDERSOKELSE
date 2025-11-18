'use client';

import { useState } from 'react';
import { PieChart as RechartsPI, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ChartCard } from './ChartCard';
import type { ChartData, DisplayMode } from '@/lib/types/survey';
import { formatNumber, formatPercentage } from '@/lib/utils/dataProcessing';

interface PieChartProps {
  data: ChartData[];
  title: string;
  description?: string;
  totalResponses: number;
  colors?: string[];
}

const DEFAULT_COLORS = [
  '#2563eb', // primary-500
  '#10b981', // secondary-500
  '#f59e0b', // accent-500
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316', // orange
  '#06b6d4', // cyan
  '#84cc16', // lime
  '#6366f1', // indigo
];

export function PieChart({
  data,
  title,
  description,
  totalResponses,
  colors = DEFAULT_COLORS,
}: PieChartProps) {
  const [displayMode, setDisplayMode] = useState<DisplayMode>('percent');

  // Safety check - return early if no data
  if (!data || data.length === 0) {
    return (
      <ChartCard title={title} description={description}>
        <div className="flex items-center justify-center h-64 text-neutral-500">
          Ingen data tilgjengelig
        </div>
      </ChartCard>
    );
  }

  // Transform data based on display mode
  const chartData = data.map(item => ({
    name: item.name,
    value: displayMode === 'percent'
      ? (item.percent ?? 0)
      : (item.count ?? 0),
    count: item.count ?? 0,
    percent: item.percent ?? 0,
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border bg-white p-3 shadow-lg">
          <p className="font-semibold text-neutral-900">{data.name}</p>
          <p className="text-sm text-neutral-600">
            Antall: {formatNumber(data.count)}
          </p>
          <p className="text-sm text-neutral-600">
            Prosent: {formatPercentage(data.percent)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom label
  const renderLabel = (entry: any) => {
    if (displayMode === 'percent') {
      return `${entry.percent.toFixed(1)}%`;
    }
    return formatNumber(entry.count);
  };

  return (
    <ChartCard
      title={title}
      description={description}
      showToggle
      displayMode={displayMode}
      onDisplayModeChange={setDisplayMode}
    >
      <ResponsiveContainer width="100%" height={400}>
        <RechartsPI>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value: string) => <span className="text-sm">{value}</span>}
          />
        </RechartsPI>
      </ResponsiveContainer>

      {/* Summary stats */}
      <div className="mt-4 border-t pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-600">Totalt antall svar:</span>
          <span className="font-semibold text-neutral-900">{formatNumber(totalResponses)}</span>
        </div>
        <div className="mt-1 flex justify-between text-sm">
          <span className="text-neutral-600">Antall kategorier:</span>
          <span className="font-semibold text-neutral-900">{data.length}</span>
        </div>
      </div>
    </ChartCard>
  );
}
