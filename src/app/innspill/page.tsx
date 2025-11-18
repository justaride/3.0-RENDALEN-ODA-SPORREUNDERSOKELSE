'use client';

import { useState, useMemo } from 'react';
import { getSurveyData } from '@/lib/data/loader';
import { useFilterStore } from '@/lib/store/filterStore';
import {
  extractTextResponses,
  categorizeResponses,
  groupByTheme,
  getTextStatistics,
  THEMES
} from '@/lib/utils/textAnalysis';
import { WordCloud } from '@/components/charts/WordCloud';
import { ThemeCard } from '@/components/text-analysis/ThemeCard';
import { TextList } from '@/components/text-analysis/TextList';
import { KeyInsights } from '@/components/text-analysis/KeyInsights';
import { FilterBar } from '@/components/filters/FilterBar';

export default function InnspillPage() {
  const surveyData = getSurveyData();
  const allResponses = surveyData.sheets[0].responses;
  const filters = useFilterStore((state) => state.filters);
  const getFilteredResponses = useFilterStore((state) => state.getFilteredResponses);
  const hasActiveFilters = useFilterStore((state) => state.hasActiveFilters);
  const clearFilters = useFilterStore((state) => state.clearFilters);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [selectedField, setSelectedField] = useState<'all' | 'boligpolitikk' | 'tomt_årsak'>('all');

  // Filter responses based on demographic filters
  // IMPORTANT: Include filters in dependencies so it re-runs when filters change
  const filteredData = useMemo(
    () => getFilteredResponses(allResponses),
    [allResponses, getFilteredResponses, filters]
  );

  // Calculate how many responses were filtered
  const totalBeforeFilter = allResponses.length;
  const totalAfterFilter = filteredData.length;
  const isFiltered = hasActiveFilters();

  // Extract and categorize text responses
  const textResponses = useMemo(() => {
    const extracted = extractTextResponses({ ...surveyData, sheets: [{ ...surveyData.sheets[0], responses: filteredData }] });
    return categorizeResponses(extracted);
  }, [filteredData, surveyData]);

  // Filter by field type
  const fieldFilteredResponses = useMemo(() => {
    if (selectedField === 'all') return textResponses;
    return textResponses.filter(r => r.field === selectedField);
  }, [textResponses, selectedField]);

  // Log for debugging
  console.log('🔍 Filter Debug:', {
    totalResponses: allResponses.length,
    filteredResponses: filteredData.length,
    textResponses: textResponses.length,
    isFiltered,
    activeFilters: filters
  });

  // Filter by selected theme
  const displayedResponses = useMemo(() => {
    if (!selectedTheme || selectedTheme === 'Annet') {
      return selectedTheme === 'Annet'
        ? fieldFilteredResponses.filter(r => r.themes.length === 0)
        : fieldFilteredResponses;
    }
    return fieldFilteredResponses.filter(r => r.themes.includes(selectedTheme));
  }, [fieldFilteredResponses, selectedTheme]);

  // Group by theme
  const groupedByTheme = useMemo(() => groupByTheme(fieldFilteredResponses), [fieldFilteredResponses]);

  // Statistics
  const stats = useMemo(() => getTextStatistics(fieldFilteredResponses), [fieldFilteredResponses]);

  // Extract texts for WordCloud
  const allTexts = useMemo(() => fieldFilteredResponses.map(r => r.text), [fieldFilteredResponses]);

  return (
    <div className="min-h-screen bg-neutral-50">
      <FilterBar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Innspill fra Innbyggerne
          </h1>
          <div className="flex items-center gap-3">
            <p className="text-neutral-600">
              {textResponses.length} innspill mottatt fra {Math.round((textResponses.length / 1015) * 100)}% av respondentene
            </p>
            {isFiltered && (
              <div className="flex items-center gap-2">
                <span className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                  🔍 Filtrert: Viser {totalAfterFilter} av {totalBeforeFilter} respondenter
                </span>
                <button
                  onClick={clearFilters}
                  className="text-sm px-3 py-1 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors font-medium"
                >
                  ✕ Fjern filtre
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className={`bg-white rounded-lg border p-4 ${isFiltered ? 'ring-2 ring-blue-500' : ''}`}>
            <div className="text-sm text-neutral-600 mb-1 flex items-center justify-between">
              <span>Totalt innspill</span>
              {isFiltered && <span className="text-xs text-blue-600">filtrert</span>}
            </div>
            <div className="text-3xl font-bold text-primary-600">{stats.total}</div>
            {isFiltered && (
              <div className="text-xs text-neutral-500 mt-1">
                (av {allResponses.length} totalt)
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg border p-4">
            <div className="text-sm text-neutral-600 mb-1">Gjennomsnittlig lengde</div>
            <div className="text-3xl font-bold text-green-600">{stats.avgLength}</div>
            <div className="text-xs text-neutral-500">tegn</div>
          </div>

          <div className="bg-white rounded-lg border p-4">
            <div className="text-sm text-neutral-600 mb-1">Boligpolitikk</div>
            <div className="text-3xl font-bold text-blue-600">{stats.fieldCounts.boligpolitikk}</div>
            <div className="text-xs text-neutral-500">innspill</div>
          </div>

          <div className="bg-white rounded-lg border p-4">
            <div className="text-sm text-neutral-600 mb-1">Tomt-årsaker</div>
            <div className="text-3xl font-bold text-orange-600">{stats.fieldCounts.tomt_årsak}</div>
            <div className="text-xs text-neutral-500">innspill</div>
          </div>
        </div>

        {/* Field Filter */}
        <div className="mb-8">
          <div className="bg-white rounded-lg border p-4">
            <label className="text-sm font-semibold text-neutral-700 mb-2 block">
              Filtrer etter spørsmålstype:
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedField('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedField === 'all'
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                Alle innspill ({textResponses.length})
              </button>
              <button
                onClick={() => setSelectedField('boligpolitikk')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedField === 'boligpolitikk'
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                Boligpolitikk ({stats.fieldCounts.boligpolitikk})
              </button>
              <button
                onClick={() => setSelectedField('tomt_årsak')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedField === 'tomt_årsak'
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                Tomt-årsaker ({stats.fieldCounts.tomt_årsak})
              </button>
            </div>
          </div>
        </div>

        {/* WordCloud */}
        {allTexts.length > 0 && (
          <div className="mb-8">
            <WordCloud
              texts={allTexts}
              title="Ordsky - Mest brukte ord"
              description="Klikk på ord for å se hvor mange ganger det er nevnt"
            />
          </div>
        )}

        {/* Key Insights */}
        {fieldFilteredResponses.length > 0 && (
          <div className="mb-8">
            <KeyInsights responses={fieldFilteredResponses} maxInsights={5} />
          </div>
        )}

        {/* Sentiment Overview */}
        <div className="mb-8">
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Sentiment-oversikt</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl mb-2">😊</div>
                <div className="text-2xl font-bold text-green-600">{stats.sentimentCounts.positive}</div>
                <div className="text-sm text-neutral-600">Positive</div>
              </div>
              <div className="text-center p-4 bg-neutral-50 rounded-lg">
                <div className="text-3xl mb-2">😐</div>
                <div className="text-2xl font-bold text-neutral-600">{stats.sentimentCounts.neutral}</div>
                <div className="text-sm text-neutral-600">Nøytrale</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-3xl mb-2">😟</div>
                <div className="text-2xl font-bold text-red-600">{stats.sentimentCounts.negative}</div>
                <div className="text-sm text-neutral-600">Negative</div>
              </div>
            </div>
          </div>
        </div>

        {/* Theme Cards */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-neutral-900">Temaer</h2>
            {selectedTheme && (
              <button
                onClick={() => setSelectedTheme(null)}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                ← Tilbake til alle tema
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {THEMES.map(theme => (
              <ThemeCard
                key={theme.name}
                theme={theme}
                responses={groupedByTheme[theme.name] || []}
                onClick={() => setSelectedTheme(theme.name)}
              />
            ))}
            <ThemeCard
              theme={{
                name: 'Annet',
                keywords: [],
                color: 'bg-neutral-100 text-neutral-800 border-neutral-200',
                icon: '📋'
              }}
              responses={groupedByTheme['Annet'] || []}
              onClick={() => setSelectedTheme('Annet')}
            />
          </div>
        </div>

        {/* Text List */}
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">
            {selectedTheme ? `Innspill om: ${selectedTheme}` : 'Alle innspill'}
          </h2>
          <TextList
            responses={displayedResponses}
            showSearch={true}
            showPagination={true}
            itemsPerPage={15}
          />
        </div>
      </div>
    </div>
  );
}
