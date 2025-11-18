'use client';

import { getSurveyData } from '@/lib/data/loader';
import { countSingleChoice, sortByCustomOrder, countsToChartData } from '@/lib/utils/dataProcessing';
import { PieChart } from '@/components/charts/PieChart';
import { FilterBar } from '@/components/filters/FilterBar';
import { useFilterStore } from '@/lib/store/filterStore';
import { AGE_ORDER } from '@/lib/types/survey';
import { PageExport } from '@/components/export/PageExport';

export default function DemografiPage() {
  const surveyData = getSurveyData();
  const allResponses = surveyData.sheets[0].responses;
  const getFilteredResponses = useFilterStore((state) => state.getFilteredResponses);
  const hasActiveFilters = useFilterStore((state) => state.hasActiveFilters);

  const responses = getFilteredResponses(allResponses);
  const totalResponses = responses.length;

  // Aldersfordeling
  const ageCounts = countSingleChoice(
    responses.map(r => r.data.demografi.hva_er_din_alder)
  );
  const ageData = sortByCustomOrder(
    countsToChartData(ageCounts, totalResponses),
    AGE_ORDER
  );

  // Kjønnsfordeling
  const genderCounts = countSingleChoice(
    responses.map(r => r.data.demografi.kjønn)
  );
  const genderData = countsToChartData(genderCounts, totalResponses);

  // Husstandstype
  const householdCounts = countSingleChoice(
    responses.map(r => r.data.demografi.hvordan_ser_din_husstand_ut)
  );
  const householdData = countsToChartData(householdCounts, totalResponses)
    .sort((a, b) => b.count! - a.count!);

  // Livssituasjon
  const lifeSituationCounts = countSingleChoice(
    responses.map(r => r.data.demografi.hva_er_din_livssituasjon)
  );
  const lifeSituationData = countsToChartData(lifeSituationCounts, totalResponses)
    .sort((a, b) => b.count! - a.count!);

  // Antall barn
  const childrenCounts = countSingleChoice(
    responses.map(r => r.data.demografi.hvor_mange_barn_bor_i_din_husstand)
  );
  const childrenData = countsToChartData(childrenCounts, totalResponses)
    .sort((a, b) => {
      // Sorter numerisk
      const numA = parseInt(a.name.split(' ')[0]) || (a.name === 'Ingen' ? 0 : 999);
      const numB = parseInt(b.name.split(' ')[0]) || (b.name === 'Ingen' ? 0 : 999);
      return numA - numB;
    });

  // Sektor (arbeid)
  const sectorCounts = countSingleChoice(
    responses.map(r => r.data.arbeid.hvilken_sektor_jobber_du_i)
  );
  const sectorData = countsToChartData(sectorCounts, totalResponses)
    .sort((a, b) => b.count! - a.count!);

  // Boligutfordring for rekruttering
  const recruitmentChallengeCounts = countSingleChoice(
    responses.map(r => r.data.arbeid.i_hvilken_grad_mener_du_at_mangel_på_passende_boliger_er_en_utfordring_for_å_rekruttere_eller_behold)
  );
  const recruitmentChallengeData = countsToChartData(recruitmentChallengeCounts, totalResponses)
    .sort((a, b) => b.count! - a.count!);

  // Vurdere å flytte til Rendalen
  const moveToRendalenCounts = countSingleChoice(
    responses.map(r => r.data.arbeid.kunne_du_vurdert_å_flytte_til_rendalen_dersom_en_passende_bolig_og_relevant_jobb_var_tilgjengelig)
  );
  const moveToRendalenData = countsToChartData(moveToRendalenCounts, totalResponses)
    .sort((a, b) => b.count! - a.count!);

  // Prepare data for export
  const chartData = [
    { name: 'Aldersfordeling', data: ageData },
    { name: 'Kjønnsfordeling', data: genderData },
    { name: 'Husstandstype', data: householdData },
    { name: 'Livssituasjon', data: lifeSituationData },
    { name: 'Antall barn', data: childrenData },
    { name: 'Sektor', data: sectorData },
    { name: 'Bolig som rekrutteringsutfordring', data: recruitmentChallengeData },
    { name: 'Ville flyttet til Rendalen', data: moveToRendalenData },
  ];

  const chartIds = [
    'chart-age',
    'chart-gender',
    'chart-household',
    'chart-lifesituation',
    'chart-children',
    'chart-sector',
    'chart-recruitment',
    'chart-movetorendalen',
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Demografi
          </h1>
          <p className="text-gray-600">
            Demografisk profil av respondentene i Rendalen kommune
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
          pageName="Demografi"
          chartIds={chartIds}
          chartData={chartData}
        />
      </div>

      {/* Filter Bar */}
      <FilterBar />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Totalt respondenter</div>
          <div className="text-3xl font-bold text-primary">{totalResponses}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Aldersgrupper</div>
          <div className="text-3xl font-bold text-primary">{ageData.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Husstandstyper</div>
          <div className="text-3xl font-bold text-primary">{householdData.length}</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        <div id="chart-age">
          <PieChart
            data={ageData}
            title="Aldersfordeling"
            description="Fordeling av respondenter etter aldersgruppe"
            totalResponses={totalResponses}
          />
        </div>

        <div id="chart-gender">
          <PieChart
            data={genderData}
            title="Kjønnsfordeling"
            description="Fordeling av respondenter etter kjønn"
            totalResponses={totalResponses}
          />
        </div>

        <div id="chart-household">
          <PieChart
            data={householdData}
            title="Husstandstype"
            description="Hvordan ser husstandene ut?"
            totalResponses={totalResponses}
          />
        </div>

        <div id="chart-lifesituation">
          <PieChart
            data={lifeSituationData}
            title="Livssituasjon"
            description="Hva er respondentenes livssituasjon?"
            totalResponses={totalResponses}
          />
        </div>

        <div id="chart-children">
          <PieChart
            data={childrenData}
            title="Antall barn i husstanden"
            description="Hvor mange barn bor i husstandene?"
            totalResponses={totalResponses}
          />
        </div>
      </div>

      {/* Arbeid og rekruttering */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Arbeid og rekruttering
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div id="chart-sector">
            <PieChart
              data={sectorData}
              title="Hvilken sektor jobber du i?"
              description="Fordeling av respondenter etter arbeidssektor"
              totalResponses={totalResponses}
            />
          </div>

          <div id="chart-recruitment">
            <PieChart
              data={recruitmentChallengeData}
              title="Bolig som rekrutteringsutfordring"
              description="I hvilken grad er mangel på boliger en utfordring for rekruttering?"
              totalResponses={totalResponses}
            />
          </div>

          <div id="chart-movetorendalen">
            <PieChart
              data={moveToRendalenData}
              title="Ville du flyttet til Rendalen?"
              description="Med passende bolig og relevant jobb?"
              totalResponses={totalResponses}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
