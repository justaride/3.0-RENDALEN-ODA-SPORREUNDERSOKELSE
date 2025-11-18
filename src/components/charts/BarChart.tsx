'use client';

import { useState, useMemo } from 'react';
import { BarChart as RechartsBar, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChartCard } from './ChartCard';
import type { ChartData, DisplayMode, SortMode } from '@/lib/types/survey';
import { formatNumber, formatPercentage, sortByPopularity, sortAlphabetically } from '@/lib/utils/dataProcessing';

interface BarChartProps {
  data: ChartData[];
  title: string;
  description?: string;
  totalResponses: number;
  orientation?: 'vertical' | 'horizontal';
  showAll?: boolean;
  topN?: number;
  allowSorting?: boolean;
  customOrder?: readonly string[];
  color?: string;
}

export function BarChart({
  data,
  title,
  description,
  totalResponses,
  orientation = 'vertical',
  showAll = false,
  topN = 10,
  allowSorting = true,
  customOrder,
  color = '#2563eb',
}: BarChartProps) {
  const [displayMode, setDisplayMode] = useState<DisplayMode>('percent');
  const [sortMode, setSortMode] = useState<SortMode>('natural');
  const [isExpanded, setIsExpanded] = useState(showAll);

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

  // Sort data based on sort mode
  const sortedData = useMemo(() => {
    if (customOrder) {
      // Custom order (e.g., age groups, locations)
      return [...data].sort((a, b) => {
        const indexA = customOrder.indexOf(a.name as any);
        const indexB = customOrder.indexOf(b.name as any);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA === -1 && indexB !== -1) return 1;
        if (indexA !== -1 && indexB === -1) return -1;
        return a.name.localeCompare(b.name, 'no');
      });
    }

    switch (sortMode) {
      case 'popularity':
        return sortByPopularity(data);
      case 'alphabetical':
        return sortAlphabetically(data);
      case 'natural':
      default:
        return data;
    }
  }, [data, sortMode, customOrder]);

  // Limit data if not expanded
  const displayData = isExpanded ? sortedData : sortedData.slice(0, topN);

  // Transform data based on display mode
  const chartData = displayData.map(item => ({
    name: item.name,
    value: displayMode === 'percent'
      ? (item.percent ?? 0)
      : (item.count ?? 0),
    count: item.count ?? 0,
    percent: item.percent ?? 0,
  }));

  // Calculate dynamic height based on number of items
  const chartHeight = orientation === 'horizontal'
    ? Math.max(400, (chartData?.length || 0) * 40)
    : 400;

  // DEBUG: Log chart data and validate
  console.log(`BarChart [${title}]:`, {
    displayMode,
    orientation,
    dataLength: displayData.length,
    chartDataLength: chartData.length,
    chartHeight,
    sample: chartData.slice(0, 3).map(item => ({
      name: item.name,
      value: item.value,
      count: item.count,
      percent: item.percent
    }))
  });

  // Validate data
  const invalidData = chartData.filter(d =>
    isNaN(d.value) || d.value === null || d.value === undefined
  );
  if (invalidData.length > 0) {
    console.error(`BarChart [${title}]: Invalid data detected:`, invalidData);
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border bg-white p-3 shadow-lg max-w-xs">
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

  // Custom Y-axis tick for horizontal charts (truncate long text)
  const CustomYAxisTick = ({ x, y, payload }: any) => {
    const maxLength = 40;
    let text = payload.value;
    if (text.length > maxLength) {
      text = text.substring(0, maxLength) + '...';
    }

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={4}
          textAnchor="end"
          fill="#666"
          fontSize={11}
        >
          {text}
        </text>
      </g>
    );
  };

  return (
    <ChartCard
      title={title}
      description={description}
      showToggle
      displayMode={displayMode}
      onDisplayModeChange={setDisplayMode}
      showExpandToggle={sortedData.length > topN}
      isExpanded={isExpanded}
      onExpandToggle={() => setIsExpanded(!isExpanded)}
      totalItems={sortedData.length}
      visibleItems={topN}
    >
      {/* Sorting controls */}
      {allowSorting && !customOrder && (
        <div className="mb-4 flex items-center space-x-2">
          <span className="text-sm text-neutral-600">Sorter:</span>
          <div className="flex space-x-1">
            <button
              onClick={() => setSortMode('popularity')}
              className={sortMode === 'popularity' ? 'filter-button-active' : 'filter-button'}
            >
              Mest populære
            </button>
            <button
              onClick={() => setSortMode('alphabetical')}
              className={sortMode === 'alphabetical' ? 'filter-button-active' : 'filter-button'}
            >
              Alfabetisk
            </button>
            <button
              onClick={() => setSortMode('natural')}
              className={sortMode === 'natural' ? 'filter-button-active' : 'filter-button'}
            >
              Standard
            </button>
          </div>
        </div>
      )}

      <ResponsiveContainer width="100%" height={chartHeight}>
        {orientation === 'vertical' ? (
          <RechartsBar data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              label={{
                value: displayMode === 'percent' ? 'Prosent (%)' : 'Antall',
                angle: -90,
                position: 'insideLeft'
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill={color} />
          </RechartsBar>
        ) : (
          <RechartsBar data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              type="number"
              tick={{ fontSize: 12 }}
              domain={[0, 'auto']}
              label={{
                value: displayMode === 'percent' ? 'Prosent (%)' : 'Antall',
                position: 'insideBottom',
                offset: -5
              }}
            />
            <YAxis
              dataKey="name"
              type="category"
              width={300}
              tick={<CustomYAxisTick />}
              interval={0}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill={color} />
          </RechartsBar>
        )}
      </ResponsiveContainer>

      {/* Summary stats */}
      <div className="mt-4 border-t pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-600">Totalt antall svar:</span>
          <span className="font-semibold text-neutral-900">{formatNumber(totalResponses)}</span>
        </div>
        <div className="mt-1 flex justify-between text-sm">
          <span className="text-neutral-600">Viser:</span>
          <span className="font-semibold text-neutral-900">
            {displayData.length} av {sortedData.length} kategorier
          </span>
        </div>
      </div>
    </ChartCard>
  );
}
