'use client';

import { useState } from 'react';
import type { TextResponse } from '@/lib/types/textAnalysis';

interface TextListProps {
  responses: TextResponse[];
  showSearch?: boolean;
  showPagination?: boolean;
  itemsPerPage?: number;
}

export function TextList({
  responses,
  showSearch = true,
  showPagination = true,
  itemsPerPage = 15
}: TextListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter responses based on search
  const filteredResponses = responses.filter(response =>
    response.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredResponses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedResponses = filteredResponses.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return '😊';
      case 'negative':
        return '😟';
      default:
        return '😐';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-neutral-600';
    }
  };

  return (
    <div>
      {/* Search Bar */}
      {showSearch && (
        <div className="mb-6">
          <input
            type="text"
            placeholder="Søk i innspill..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          {searchTerm && (
            <p className="text-sm text-neutral-600 mt-2">
              Viser {filteredResponses.length} av {responses.length} innspill
            </p>
          )}
        </div>
      )}

      {/* Response List */}
      {paginatedResponses.length === 0 ? (
        <div className="text-center py-12 text-neutral-500">
          {searchTerm ? 'Ingen innspill matcher søket' : 'Ingen innspill tilgjengelig'}
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedResponses.map((response, idx) => (
            <div
              key={`${response.id}-${idx}`}
              className="border rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-neutral-700">
                    #{response.id}
                  </span>
                  <span className="text-xs px-2 py-1 bg-neutral-100 text-neutral-600 rounded">
                    {response.field === 'boligpolitikk' ? 'Boligpolitikk' : 'Tomt-årsak'}
                  </span>
                  <span className={`text-lg ${getSentimentColor(response.sentiment)}`}>
                    {getSentimentEmoji(response.sentiment)}
                  </span>
                </div>
                <span className="text-xs text-neutral-500">
                  {new Date(response.timestamp).toLocaleDateString('nb-NO', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>

              {/* Text Content */}
              <p className="text-neutral-900 mb-4 leading-relaxed">{response.text}</p>

              {/* Themes */}
              {response.themes.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {response.themes.map((theme, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full"
                    >
                      🏷️ {theme}
                    </span>
                  ))}
                </div>
              )}

              {/* Demographics */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-600">
                <span>👤 {response.demografi.kjønn}</span>
                <span>📅 {response.demografi.alder}</span>
                <span>📍 {response.demografi.lokasjon}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50"
          >
            Forrige
          </button>

          <div className="flex gap-1">
            {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 7) {
                pageNum = i + 1;
              } else if (currentPage <= 4) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 3) {
                pageNum = totalPages - 6 + i;
              } else {
                pageNum = currentPage - 3 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-2 border rounded-lg ${
                    currentPage === pageNum
                      ? 'bg-primary-500 text-white border-primary-500'
                      : 'hover:bg-neutral-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50"
          >
            Neste
          </button>
        </div>
      )}

      {/* Pagination Info */}
      {showPagination && totalPages > 1 && (
        <p className="text-center text-sm text-neutral-600 mt-4">
          Side {currentPage} av {totalPages} ({filteredResponses.length} innspill totalt)
        </p>
      )}
    </div>
  );
}
