'use client';

import { getSurveyData } from '@/lib/data/loader';
import { countSingleChoice, countMultipleChoices, countsToChartData } from '@/lib/utils/dataProcessing';
import { PieChart } from '@/components/charts/PieChart';
import { HorizontalBarChart } from '@/components/charts/HorizontalBarChart';
import { FilterBar } from '@/components/filters/FilterBar';
import { useFilterStore } from '@/lib/store/filterStore';
import { PageExport } from '@/components/export/PageExport';

export default function FlyttingPage() {
  const surveyData = getSurveyData();
  const allResponses = surveyData.sheets[0].responses;
  const getFilteredResponses = useFilterStore((state) => state.getFilteredResponses);
  const hasActiveFilters = useFilterStore((state) => state.hasActiveFilters);

  const responses = getFilteredResponses(allResponses);
  const totalResponses = responses.length;

  // Flytteplaner
  const movingPlansCounts = countSingleChoice(
    responses.map(r => r.data.flytteplaner.har_du_planer_om_å_flytte_på_deg)
  );
  const movingPlansData = countsToChartData(movingPlansCounts, totalResponses)
    .sort((a, b) => b.count! - a.count!);

  // Hvor ville du bo (multi-select)
  const destinationCounts = countMultipleChoices(
    responses.map(r => r.data.flytteplaner.hvor_kunne_du_tenke_deg_å_bo_hvis_du_skulle_flytte_til_eller_innad_i_rendalen_kommune_flere_svar_mul)
  );
  const destinationData = countsToChartData(destinationCounts, totalResponses)
    .sort((a, b) => b.count! - a.count!);

  // Boligtype preferanser (multi-select)
  const houseTypePreferenceCounts = countMultipleChoices(
    responses.map(r => r.data.boligpreferanser.hvilken_boligtype_er_mest_aktuell_for_deg_ved_en_flytting_flere_svar_mulig)
  );
  const houseTypePreferenceData = countsToChartData(houseTypePreferenceCounts, totalResponses)
    .sort((a, b) => b.count! - a.count!);

  // Nærmiljøkvaliteter (multi-select)
  const neighborhoodQualitiesCounts = countMultipleChoices(
    responses.map(r => r.data.boligpreferanser.hvilke_nærmiljøkvaliteter_er_viktigst_for_deg_ved_valg_av_sted_å_bo_flere_valg_mulig)
  );
  const neighborhoodQualitiesData = countsToChartData(neighborhoodQualitiesCounts, totalResponses)
    .sort((a, b) => b.count! - a.count!);

  // Bokvaliteter (multi-select)
  const housingQualitiesCounts = countMultipleChoices(
    responses.map(r => r.data.boligpreferanser.hvilke_bokvaliteter_er_viktigst_for_deg_ved_valg_av_ny_bolig_flere_valg_mulig)
  );
  const housingQualitiesData = countsToChartData(housingQualitiesCounts, totalResponses)
    .sort((a, b) => b.count! - a.count!);

  // Hindringer for å realisere boligønsker (multi-select)
  const barriersCounts = countMultipleChoices(
    responses.map(r => r.data.hindringer_og_innspill.for_å_realisere_dine_boligønsker_hva_blir_dine_største_hindringer_flere_svar_mulig)
  );
  const barriersData = countsToChartData(barriersCounts, totalResponses)
    .sort((a, b) => b.count! - a.count!);

  // Tilgjengelighet og helse - tilpasninger (multi-select)
  const accessibilityCounts = countMultipleChoices(
    responses.map(r => r.data.tilgjengelighet_helse.hva_må_tilpasses_eller_oppgraderes_dersom_dudere_skal_bo_lengst_mulig_i_egen_bolig_eller_fikk_reduse)
  );
  const accessibilityData = countsToChartData(accessibilityCounts, totalResponses)
    .sort((a, b) => b.count! - a.count!);

  // Bofellesskap - relevant tilbud (multi-select)
  const communityHousingCounts = countMultipleChoices(
    responses.map(r => r.data.bofellesskap.dersom_det_tilbys_boliger_med_mulighet_for_fellesløsninger_hvilke_tilbud_kunne_vært_relevant_for_deg)
  );
  const communityHousingData = countsToChartData(communityHousingCounts, totalResponses)
    .sort((a, b) => b.count! - a.count!);

  // Tilleggstjenester (multi-select)
  const additionalServicesCounts = countMultipleChoices(
    responses.map(r => r.data.tilleggstjenester.hvilke_tjenester_kunne_du_tenke_deg_å_betale_ekstra_for_enten_direkte_eller_som_del_av_en_felleskost)
  );
  const additionalServicesData = countsToChartData(additionalServicesCounts, totalResponses)
    .sort((a, b) => b.count! - a.count!);

  // Antall soverom
  const bedroomCounts = countSingleChoice(
    responses.map(r => r.data.boligpreferanser.hvor_mange_soverom_har_du_behov_for)
  );
  const bedroomData = countsToChartData(bedroomCounts, totalResponses)
    .sort((a, b) => {
      // Sorter numerisk
      const numA = parseInt(a.name.split(' ')[0]) || 99;
      const numB = parseInt(b.name.split(' ')[0]) || 99;
      return numA - numB;
    });

  // Beregn andel som planlegger å flytte
  const planningToMove = movingPlansData
    .filter(d => d.name.toLowerCase().includes('ja'))
    .reduce((sum, d) => sum + (d.count || 0), 0);

  // Prepare data for export
  const chartData = [
    { name: 'Flytteplaner', data: movingPlansData },
    { name: 'Destinasjoner', data: destinationData },
    { name: 'Ønsket boligtype', data: houseTypePreferenceData },
    { name: 'Behov for soverom', data: bedroomData },
    { name: 'Viktige nærmiljøkvaliteter', data: neighborhoodQualitiesData },
    { name: 'Viktige bokvaliteter', data: housingQualitiesData },
    { name: 'Hindringer', data: barriersData },
    { name: 'Tilgjengelighet', data: accessibilityData },
    { name: 'Bofellesskap', data: communityHousingData },
    { name: 'Tilleggstjenester', data: additionalServicesData },
  ];

  const chartIds = [
    'chart-movingplans',
    'chart-destinations',
    'chart-housetypepreference',
    'chart-bedrooms',
    'chart-neighborhoodqualities',
    'chart-housingqualities',
    'chart-barriers',
    'chart-accessibility',
    'chart-communityhousing',
    'chart-additionalservices',
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Flytteplaner og Preferanser
          </h1>
          <p className="text-gray-600">
            Flytteintensjon og ønsker for fremtidig bolig
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
          pageName="Flytting"
          chartIds={chartIds}
          chartData={chartData}
        />
      </div>

      {/* Filter Bar */}
      <FilterBar />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Planlegger å flytte</div>
          <div className="text-3xl font-bold text-primary">{planningToMove}</div>
          <div className="text-xs text-gray-500 mt-1">
            ({Math.round((planningToMove / totalResponses) * 100)}% av respondenter)
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Destinasjoner vurdert</div>
          <div className="text-3xl font-bold text-primary">{destinationData.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Boligtyper av interesse</div>
          <div className="text-3xl font-bold text-primary">{houseTypePreferenceData.length}</div>
        </div>
      </div>

      {/* Flytteplaner */}
      <div id="chart-movingplans" className="mb-6">
        <PieChart
          data={movingPlansData}
          title="Flytteplaner"
          description="Har respondentene planer om å flytte?"
          totalResponses={totalResponses}
        />
      </div>

      {/* Destinasjoner */}
      <div id="chart-destinations" className="mb-6">
        <HorizontalBarChart
          data={destinationData}
          title="Hvor kunne du tenke deg å bo?"
          description="Prefererte destinasjoner ved flytting (flervalg mulig)"
          totalResponses={totalResponses}
        />
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">
        Boligpreferanser
      </h2>

      {/* Boligtype preferanser */}
      <div id="chart-housetypepreference" className="mb-6">
        <HorizontalBarChart
          data={houseTypePreferenceData}
          title="Ønsket boligtype"
          description="Hvilken boligtype er mest aktuell ved flytting? (flervalg mulig)"
          totalResponses={totalResponses}
        />
      </div>

      {/* Grid for mindre charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div id="chart-bedrooms">
          <PieChart
            data={bedroomData}
            title="Behov for soverom"
            description="Hvor mange soverom har folk behov for?"
            totalResponses={totalResponses}
          />
        </div>
      </div>

      {/* Nærmiljøkvaliteter */}
      <div id="chart-neighborhoodqualities" className="mb-6">
        <HorizontalBarChart
          data={neighborhoodQualitiesData}
          title="Viktige nærmiljøkvaliteter"
          description="Hva er viktigst ved valg av sted å bo? (flervalg mulig)"
          totalResponses={totalResponses}
        />
      </div>

      {/* Bokvaliteter */}
      <div id="chart-housingqualities" className="mb-6">
        <HorizontalBarChart
          data={housingQualitiesData}
          title="Viktige bokvaliteter"
          description="Hva er viktigst ved valg av ny bolig? (flervalg mulig)"
          totalResponses={totalResponses}
        />
      </div>

      {/* Hindringer */}
      <div className="mt-12 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Hindringer for boligrealisering
        </h2>
        <div id="chart-barriers">
          <HorizontalBarChart
            data={barriersData}
            title="Største hindringer"
            description="Hva blir dine største hindringer for å realisere dine boligønsker? (flervalg mulig)"
            totalResponses={totalResponses}
          />
        </div>
      </div>

      {/* Tilgjengelighet og helse */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Tilgjengelighet og helse
        </h2>
        <div id="chart-accessibility">
          <HorizontalBarChart
            data={accessibilityData}
            title="Nødvendige tilpasninger"
            description="Hva må tilpasses for at du skal bo lengst mulig i egen bolig? (flervalg mulig)"
            totalResponses={totalResponses}
          />
        </div>
      </div>

      {/* Bofellesskap */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Bofellesskap og fellesløsninger
        </h2>
        <div id="chart-communityhousing">
          <HorizontalBarChart
            data={communityHousingData}
            title="Relevante fellesløsninger"
            description="Hvilke tilbud kunne vært relevant i et bofellesskap? (flervalg mulig)"
            totalResponses={totalResponses}
          />
        </div>
      </div>

      {/* Tilleggstjenester */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Tilleggstjenester
        </h2>
        <div id="chart-additionalservices">
          <HorizontalBarChart
            data={additionalServicesData}
            title="Tjenester du ville betalt for"
            description="Hvilke tjenester kunne du tenke deg å betale ekstra for? (flervalg mulig)"
            totalResponses={totalResponses}
          />
        </div>
      </div>
    </div>
  );
}
