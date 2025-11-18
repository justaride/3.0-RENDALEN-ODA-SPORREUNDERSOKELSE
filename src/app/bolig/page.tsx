'use client';

import { getSurveyData } from '@/lib/data/loader';
import { countSingleChoice, countMultipleChoices, sortByCustomOrder, countsToChartData } from '@/lib/utils/dataProcessing';
import { PieChart } from '@/components/charts/PieChart';
import { HorizontalBarChart } from '@/components/charts/HorizontalBarChart';
import { BarChart } from '@/components/charts/BarChart';
import { FilterBar } from '@/components/filters/FilterBar';
import { useFilterStore } from '@/lib/store/filterStore';
import { LOCATION_ORDER } from '@/lib/types/survey';
import { PageExport } from '@/components/export/PageExport';

export default function BoligPage() {
  const surveyData = getSurveyData();
  const allResponses = surveyData.sheets[0].responses;
  const getFilteredResponses = useFilterStore((state) => state.getFilteredResponses);
  const hasActiveFilters = useFilterStore((state) => state.hasActiveFilters);

  const responses = getFilteredResponses(allResponses);
  const totalResponses = responses.length;

  // Eier/leier
  const ownershipCounts = countSingleChoice(
    responses.map(r => r.data.navaerende_bolig.eier_eller_leier_du_boligen_du_bor_i)
  );
  const ownershipData = countsToChartData(ownershipCounts, totalResponses)
    .sort((a, b) => b.count! - a.count!);

  // Type bosted
  const houseTypeCounts = countSingleChoice(
    responses.map(r => r.data.diverse.hva_slags_type_bosted_har_du_nå)
  );
  const houseTypeData = countsToChartData(houseTypeCounts, totalResponses)
    .sort((a, b) => b.count! - a.count!);

  // Fornøydhet med bolig
  const satisfactionCounts = countSingleChoice(
    responses.map(r => r.data.navaerende_bolig.hvor_fornøyd_er_du_med_din_nåværende_bosituasjon)
  );
  const satisfactionData = countsToChartData(satisfactionCounts, totalResponses)
    .sort((a, b) => {
      // Sorter etter tilfredshet (mest fornøyd først)
      const order = ['Svært fornøyd', 'Fornøyd', 'Nøytral', 'Misfornøyd', 'Svært misfornøyd'];
      return order.indexOf(a.name) - order.indexOf(b.name);
    });

  // Bostedsadresse registrert
  const registeredCounts = countSingleChoice(
    responses.map(r => r.data.navaerende_bolig.har_du_registrert_bostedsadresse_i_rendalen_kommune_i_dag)
  );
  const registeredData = countsToChartData(registeredCounts, totalResponses);

  // Geografisk fordeling
  const locationCounts = countSingleChoice(
    responses.map(r => r.data.diverse.hvor_i_rendalen_kommune_bor_du)
  );
  const locationData = sortByCustomOrder(
    countsToChartData(locationCounts, totalResponses),
    LOCATION_ORDER
  );

  // Hva savnes i området (multi-select)
  const missingCounts = countMultipleChoices(
    responses.map(r => r.data.omrade_kvalitet.er_det_noe_du_savner_i_området_du_bor_flere_valg_mulig)
  );
  const missingData = countsToChartData(missingCounts, totalResponses)
    .sort((a, b) => b.count! - a.count!);

  // Tomt og eiendom - regulere tomter
  const regulatePropertyCounts = countSingleChoice(
    responses.map(r => r.data.tomt_og_eiendom.vurderer_eller_ønsker_dudere_å_regulere_tomter_for_å_bygge)
  );
  const regulatePropertyData = countsToChartData(regulatePropertyCounts, totalResponses)
    .sort((a, b) => b.count! - a.count!);

  // På utkikk etter tomt
  const lookingForPlotCounts = countSingleChoice(
    responses.map(r => r.data.tomt_og_eiendom.er_dudere_aktivt_på_utkikk_etter_boligtomt_i_kommunen)
  );
  const lookingForPlotData = countsToChartData(lookingForPlotCounts, totalResponses)
    .sort((a, b) => b.count! - a.count!);

  // Type tomt
  const plotTypeCounts = countSingleChoice(
    responses.map(r => r.data.tomt_og_eiendom.hva_slags_type_tomt_ser_dudere_primært_etter)
  );
  const plotTypeData = countsToChartData(plotTypeCounts, totalResponses)
    .sort((a, b) => b.count! - a.count!);

  // Prepare data for export
  const chartData = [
    { name: 'Eier eller leier', data: ownershipData },
    { name: 'Type bosted', data: houseTypeData },
    { name: 'Tilfredshet', data: satisfactionData },
    { name: 'Bostedsadresse registrert', data: registeredData },
    { name: 'Geografisk fordeling', data: locationData },
    { name: 'Hva savnes', data: missingData },
    { name: 'Regulere tomter', data: regulatePropertyData },
    { name: 'Ser etter tomt', data: lookingForPlotData },
    { name: 'Type tomt', data: plotTypeData },
  ];

  const chartIds = [
    'chart-ownership',
    'chart-housetype',
    'chart-satisfaction',
    'chart-registered',
    'chart-location',
    'chart-missing',
    'chart-regulate',
    'chart-lookingforplot',
    'chart-plottype',
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Boligsituasjon
          </h1>
          <p className="text-gray-600">
            Nåværende boligsituasjon og områdekvalitet i Rendalen kommune
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
          pageName="Bolig"
          chartIds={chartIds}
          chartData={chartData}
        />
      </div>

      {/* Filter Bar */}
      <FilterBar />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Eier bolig</div>
          <div className="text-3xl font-bold text-primary">
            {ownershipData.find(d => d.name.includes('Eier'))?.count || 0}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            ({Math.round((ownershipData.find(d => d.name.includes('Eier'))?.count || 0) / totalResponses * 100)}%)
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Fornøyd/Svært fornøyd</div>
          <div className="text-3xl font-bold text-primary">
            {satisfactionData
              .filter(d => d.name.includes('fornøyd') && !d.name.includes('Mis'))
              .reduce((sum, d) => sum + (d.count || 0), 0)}
          </div>
          <div className="text-xs text-gray-500 mt-1">med nåværende bosituasjon</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Områder i kommunen</div>
          <div className="text-3xl font-bold text-primary">{locationData.length}</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div id="chart-ownership">
          <PieChart
            data={ownershipData}
            title="Eier eller leier"
            description="Fordeling mellom eiere og leietakere"
            totalResponses={totalResponses}
          />
        </div>

        <div id="chart-housetype">
          <PieChart
            data={houseTypeData}
            title="Type bosted"
            description="Hvilken type bolig bor folk i?"
            totalResponses={totalResponses}
          />
        </div>

        <div id="chart-satisfaction">
          <PieChart
            data={satisfactionData}
            title="Tilfredshet med bosituasjon"
            description="Hvor fornøyd er folk med sin nåværende bosituasjon?"
            totalResponses={totalResponses}
          />
        </div>

        <div id="chart-registered">
          <PieChart
            data={registeredData}
            title="Bostedsadresse registrert"
            description="Har respondentene registrert bostedsadresse i Rendalen?"
            totalResponses={totalResponses}
          />
        </div>
      </div>

      <div className="mt-6 space-y-6 mb-12">
        <div id="chart-location">
          <BarChart
            data={locationData}
            title="Geografisk fordeling"
            description="Hvor i Rendalen kommune bor respondentene?"
            totalResponses={totalResponses}
          />
        </div>

        <div id="chart-missing">
          <HorizontalBarChart
            data={missingData}
            title="Hva savnes i området?"
            description="Hva savner folk i området de bor (flervalg mulig)"
            totalResponses={totalResponses}
          />
        </div>
      </div>

      {/* Tomt og eiendom */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Tomt og eiendom
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div id="chart-regulate">
            <PieChart
              data={regulatePropertyData}
              title="Ønske om å regulere tomter"
              description="Vurderer eller ønsker du å regulere tomter for å bygge?"
              totalResponses={totalResponses}
            />
          </div>

          <div id="chart-lookingforplot">
            <PieChart
              data={lookingForPlotData}
              title="Aktivt på utkikk etter tomt"
              description="Er du aktivt på utkikk etter boligtomt i kommunen?"
              totalResponses={totalResponses}
            />
          </div>

          <div id="chart-plottype">
            <PieChart
              data={plotTypeData}
              title="Type tomt du ser etter"
              description="Hva slags type tomt ser du primært etter?"
              totalResponses={totalResponses}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
