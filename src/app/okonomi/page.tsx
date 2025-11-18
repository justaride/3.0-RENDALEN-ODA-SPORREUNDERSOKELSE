'use client';

import { getSurveyData } from '@/lib/data/loader';
import { countSingleChoice, countsToChartData } from '@/lib/utils/dataProcessing';
import { PieChart } from '@/components/charts/PieChart';
import { FilterBar } from '@/components/filters/FilterBar';
import { useFilterStore } from '@/lib/store/filterStore';
import { PageExport } from '@/components/export/PageExport';

export default function OkonomiPage() {
  const surveyData = getSurveyData();
  const allResponses = surveyData.sheets[0].responses;
  const getFilteredResponses = useFilterStore((state) => state.getFilteredResponses);
  const hasActiveFilters = useFilterStore((state) => state.hasActiveFilters);

  const responses = getFilteredResponses(allResponses);
  const totalResponses = responses.length;

  // Kjøpesum/byggekostnad
  const purchaseCounts = countSingleChoice(
    responses.map(r => r.data.okonomi.dersom_du_skulle_kjøpe_bolig_hva_er_din_anslåtte_maksimale_kjøpesumbyggekostnad)
  );
  const purchaseData = countsToChartData(purchaseCounts, totalResponses)
    .sort((a, b) => {
      // Sorter etter beløp (lavest til høyest)
      const orderMap: Record<string, number> = {
        'Under 2 mill': 1,
        '2-3 mill': 2,
        '3-4 mill': 3,
        '4-5 mill': 4,
        'Over 5 mill': 5,
        'Vet ikke': 6,
      };
      return (orderMap[a.name] || 99) - (orderMap[b.name] || 99);
    });

  // Månedlig leie
  const rentCounts = countSingleChoice(
    responses.map(r => r.data.navaerende_bolig.dersom_du_skulle_leie_bolig_hva_har_du_mulighet_til_å_betale_i_månedsleie)
  );
  const rentData = countsToChartData(rentCounts, totalResponses)
    .sort((a, b) => {
      // Sorter etter beløp
      const orderMap: Record<string, number> = {
        'Under 5000 kr': 1,
        '5000-7500 kr': 2,
        '7500-10000 kr': 3,
        '10000-12500 kr': 4,
        'Over 12500 kr': 5,
        'Vet ikke': 6,
      };
      return (orderMap[a.name] || 99) - (orderMap[b.name] || 99);
    });

  // Bostøtte kjennskap
  const bostotteCounts = countSingleChoice(
    responses.map(r => r.data.okonomi.bostøtte_er_en_statlig_støtteordning_for_de_med_lave_inntekter_og_høye_boutgifter_hvilken_av_disse_p)
  );
  const bostotteData = countsToChartData(bostotteCounts, totalResponses)
    .sort((a, b) => b.count! - a.count!);

  // Startlån kjennskap
  const startlanCounts = countSingleChoice(
    responses.map(r => r.data.okonomi.startlån_er_en_statlig_låneordning_for_alle_aldre_for_de_som_ikke_får_lån_i_ordinær_bank_hvilken_av_)
  );
  const startlanData = countsToChartData(startlanCounts, totalResponses)
    .sort((a, b) => b.count! - a.count!);

  // Beregn gjennomsnittlig kjøpekraft
  const purchaseSum = purchaseData.reduce((sum, item) => {
    if (item.name === 'Vet ikke') return sum;
    return sum + (item.count || 0);
  }, 0);

  // Prepare data for export
  const chartData = [
    { name: 'Kjøpekraft', data: purchaseData },
    { name: 'Leiekapasitet', data: rentData },
    { name: 'Kjennskap til bostøtte', data: bostotteData },
    { name: 'Kjennskap til startlån', data: startlanData },
  ];

  const chartIds = [
    'chart-purchase',
    'chart-rent',
    'chart-bostotte',
    'chart-startlan',
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Økonomi
          </h1>
          <p className="text-gray-600">
            Økonomisk kjøpekraft og kjennskap til støtteordninger
            {hasActiveFilters() && (
              <span className="ml-2 text-sm text-primary font-medium">
                (Viser {totalResponses} av {allResponses.length} respondenter)
              </span>
            )}
          </p>
        </div>
        <PageExport
          responses={responses}
          allResponses={allResponses}
          pageName="Økonomi"
          chartIds={chartIds}
          chartData={chartData}
        />
      </div>

      {/* Filter Bar */}
      <FilterBar />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Kjenner til bostøtte</div>
          <div className="text-3xl font-bold text-primary">
            {bostotteData
              .filter(d => !d.name.toLowerCase().includes('var ikke klar over'))
              .reduce((sum, d) => sum + (d.count || 0), 0)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            ({Math.round((bostotteData.filter(d => !d.name.toLowerCase().includes('var ikke klar over')).reduce((sum, d) => sum + (d.count || 0), 0) / totalResponses) * 100)}%)
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Kjenner til startlån</div>
          <div className="text-3xl font-bold text-primary">
            {startlanData
              .filter(d => !d.name.toLowerCase().includes('var ikke klar over'))
              .reduce((sum, d) => sum + (d.count || 0), 0)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            ({Math.round((startlanData.filter(d => !d.name.toLowerCase().includes('var ikke klar over')).reduce((sum, d) => sum + (d.count || 0), 0) / totalResponses) * 100)}%)
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Angitt kjøpekraft</div>
          <div className="text-3xl font-bold text-primary">
            {purchaseSum}
          </div>
          <div className="text-xs text-gray-500 mt-1">respondenter med svar</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div id="chart-purchase">
          <PieChart
            data={purchaseData}
            title="Maksimal kjøpesum/byggekostnad"
            description="Hva kan folk maksimalt bruke på boligkjøp?"
            totalResponses={totalResponses}
          />
        </div>

        <div id="chart-rent">
          <PieChart
            data={rentData}
            title="Månedlig leiekapasitet"
            description="Hva har folk mulighet til å betale i månedlig leie?"
            totalResponses={totalResponses}
          />
        </div>

        <div id="chart-bostotte">
          <PieChart
            data={bostotteData}
            title="Kjennskap til bostøtte"
            description="Kjenner folk til den statlige bostøtteordningen?"
            totalResponses={totalResponses}
          />
        </div>

        <div id="chart-startlan">
          <PieChart
            data={startlanData}
            title="Kjennskap til startlån"
            description="Kjenner folk til den statlige startlånsordningen?"
            totalResponses={totalResponses}
          />
        </div>
      </div>

      {/* Info box */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          Om støtteordningene
        </h3>
        <div className="space-y-3 text-sm text-blue-800">
          <div>
            <strong>Bostøtte:</strong> En statlig støtteordning som skal bidra til å sikre alle en egnet bolig.
            Ordningen gir økonomisk støtte til boutgifter for personer og familier med lav inntekt.
          </div>
          <div>
            <strong>Startlån:</strong> En statlig låneordning som hjelper deg til å etablere deg i egen bolig.
            Ordningen er ment for personer som ikke får vanlig boliglån i bank.
          </div>
        </div>
      </div>
    </div>
  );
}
