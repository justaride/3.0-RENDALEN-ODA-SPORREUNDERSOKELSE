'use client';

import { ExportButton, ExportOption } from './ExportButton';
import {
  exportToExcel,
  exportChartsToPDF,
  exportMultipleSheetsToExcel,
  flattenResponses,
  prepareChartDataForExport,
} from '@/lib/utils/exportUtils';
import { Response } from '@/lib/types/survey';

interface PageExportProps {
  responses: Response[];
  allResponses: Response[];
  pageName: string;
  chartIds: string[];
  chartData?: Array<{
    name: string;
    data: Array<{ name: string; value: number }>;
  }>;
}

export function PageExport({
  responses,
  allResponses,
  pageName,
  chartIds,
  chartData = [],
}: PageExportProps) {
  const handleExportFilteredData = () => {
    const flattened = flattenResponses(responses);
    exportToExcel(
      flattened,
      `Rendalen_${pageName}_Filtrert_${new Date().toISOString().split('T')[0]}`,
      'Filtrerte Data'
    );
  };

  const handleExportAllData = () => {
    const flattened = flattenResponses(allResponses);
    exportToExcel(
      flattened,
      `Rendalen_${pageName}_Alle_${new Date().toISOString().split('T')[0]}`,
      'Alle Data'
    );
  };

  const handleExportChartData = () => {
    if (chartData.length === 0) {
      alert('Ingen chart data tilgjengelig for eksport');
      return;
    }

    const sheets = chartData.map(chart => ({
      name: chart.name.substring(0, 31), // Excel sheet name limit
      data: prepareChartDataForExport(chart.data, responses.length),
    }));

    exportMultipleSheetsToExcel(
      sheets,
      `Rendalen_${pageName}_Charts_${new Date().toISOString().split('T')[0]}`
    );
  };

  const handleExportPDF = async () => {
    if (chartIds.length === 0) {
      alert('Ingen charts funnet for PDF-eksport');
      return;
    }

    await exportChartsToPDF(
      chartIds,
      `Rendalen_${pageName}_Rapport_${new Date().toISOString().split('T')[0]}`,
      `Rendalen Boligbehovsundersøkelse - ${pageName}`
    );
  };

  const exportOptions: ExportOption[] = [
    {
      label: 'Excel - Filtrerte data',
      icon: '📊',
      onClick: handleExportFilteredData,
    },
    {
      label: 'Excel - Alle data',
      icon: '📋',
      onClick: handleExportAllData,
    },
  ];

  // Only add chart data export if we have chart data
  if (chartData.length > 0) {
    exportOptions.push({
      label: 'Excel - Visualiseringsdata',
      icon: '📈',
      onClick: handleExportChartData,
    });
  }

  // Add PDF export
  if (chartIds.length > 0) {
    exportOptions.push({
      label: 'PDF - Rapport med charts',
      icon: '📄',
      onClick: handleExportPDF,
    });
  }

  return <ExportButton options={exportOptions} />;
}
