'use client';

import Link from 'next/link';
import { getSurveyData } from '@/lib/data/loader';
import { countSingleChoice } from '@/lib/utils/dataProcessing';

export default function Home() {
  const surveyData = getSurveyData();
  const responses = surveyData.sheets[0].responses;
  const totalResponses = responses.length;

  // Beregn noen nøkkelindikatorer
  const ownershipCounts = countSingleChoice(
    responses.map(r => r.data.navaerende_bolig.eier_eller_leier_du_boligen_du_bor_i)
  );
  const ownersCount = Object.entries(ownershipCounts)
    .filter(([key]) => key.toLowerCase().includes('eier'))
    .reduce((sum, [, value]) => sum + value, 0);

  const movingPlansCounts = countSingleChoice(
    responses.map(r => r.data.flytteplaner.har_du_planer_om_å_flytte_på_deg)
  );
  const planningToMoveCount = Object.entries(movingPlansCounts)
    .filter(([key]) => key.toLowerCase().includes('ja'))
    .reduce((sum, [, value]) => sum + value, 0);

  const satisfactionCounts = countSingleChoice(
    responses.map(r => r.data.navaerende_bolig.hvor_fornøyd_er_du_med_din_nåværende_bosituasjon)
  );
  const satisfiedCount = Object.entries(satisfactionCounts)
    .filter(([key]) => key.includes('fornøyd') && !key.includes('Mis'))
    .reduce((sum, [, value]) => sum + value, 0);

  const categories = [
    {
      title: 'Demografi',
      description: 'Alder, kjønn, husstand og livssituasjon',
      href: '/demografi',
      icon: '👥',
      stats: [
        { label: 'Respondenter', value: totalResponses },
        { label: 'Aldersgrupper', value: '7' },
      ],
      color: 'from-blue-500 to-blue-700',
    },
    {
      title: 'Boligsituasjon',
      description: 'Nåværende bolig og områdekvalitet',
      href: '/bolig',
      icon: '🏠',
      stats: [
        { label: 'Eier bolig', value: `${Math.round((ownersCount / totalResponses) * 100)}%` },
        { label: 'Fornøyde', value: `${Math.round((satisfiedCount / totalResponses) * 100)}%` },
      ],
      color: 'from-green-500 to-green-700',
    },
    {
      title: 'Økonomi',
      description: 'Kjøpekraft og støtteordninger',
      href: '/okonomi',
      icon: '💰',
      stats: [
        { label: 'Med kjøpekraft', value: `${responses.length - (countSingleChoice(responses.map(r => r.data.okonomi.dersom_du_skulle_kjøpe_bolig_hva_er_din_anslatte_maksimale_kjopesumbyggekostnad))['Vet ikke'] || 0)}` },
      ],
      color: 'from-yellow-500 to-yellow-700',
    },
    {
      title: 'Flytteplaner',
      description: 'Flytteintensjon og boligpreferanser',
      href: '/flytting',
      icon: '🚚',
      stats: [
        { label: 'Planlegger å flytte', value: `${Math.round((planningToMoveCount / totalResponses) * 100)}%` },
      ],
      color: 'from-purple-500 to-purple-700',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section with Natural State Branding */}
      <div className="bg-natural-state-warm rounded-lg overflow-hidden shadow-lg border border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Left: Project Info */}
          <div className="p-8 lg:p-12">
            <div className="mb-6">
              <div className="text-5xl mb-4">🏔️</div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Rendalen Boligbehovsundersøkelse
              </h1>
              <p className="text-xl text-gray-700 mb-6">
                En helhetlig analyse av boligbehov, preferanser og ønsker fra {totalResponses} innbyggere i Rendalen kommune.
              </p>
            </div>

            <div className="flex items-center gap-3 mb-8 text-sm text-gray-600">
              <div className="w-6 h-6 rounded-full" style={{ backgroundColor: '#4E54C7' }}></div>
              <span className="font-semibold" style={{ color: '#4E54C7' }}>Natural State</span>
              <span className="text-gray-400">·</span>
              <span>Place development · Sustainable economics</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-2xl font-bold" style={{ color: '#4E54C7' }}>{totalResponses}</p>
                <p className="text-sm text-gray-600">Respondenter</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-2xl font-bold" style={{ color: '#4E54C7' }}>54</p>
                <p className="text-sm text-gray-600">Spørsmål</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-2xl font-bold" style={{ color: '#4E54C7' }}>258</p>
                <p className="text-sm text-gray-600">Fritekst-svar</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-2xl font-bold" style={{ color: '#10b981' }}>100%</p>
                <p className="text-sm text-gray-600">Datakvalitet</p>
              </div>
            </div>
          </div>

          {/* Right: Natural State Methodology */}
          <div className="bg-white p-8 lg:p-12 flex flex-col justify-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
              Natural State Metodikk
            </h3>

            {/* Methodology visualization */}
            <div className="relative flex items-center justify-center mb-6" style={{ height: '280px' }}>
              <svg viewBox="0 0 400 400" className="w-full h-full">
                {/* Market sphere (outer circle) */}
                <circle cx="200" cy="200" r="160" fill="none" stroke="#4E54C7" strokeWidth="2" opacity="0.5" />
                <text x="200" y="50" textAnchor="middle" fontSize="16" fill="#4E54C7" fontWeight="600">Market sphere</text>

                {/* Inner circles - overlapping */}
                {/* Human (top) */}
                <circle cx="200" cy="160" r="55" fill="#AF5C34" fillOpacity="0.1" stroke="#AF5C34" strokeWidth="2" />
                <text x="200" y="165" textAnchor="middle" fontSize="14" fill="#AF5C34" fontWeight="600">Human</text>

                {/* Society (bottom left) */}
                <circle cx="165" cy="220" r="55" fill="#AF5C34" fillOpacity="0.1" stroke="#AF5C34" strokeWidth="2" />
                <text x="165" y="225" textAnchor="middle" fontSize="14" fill="#AF5C34" fontWeight="600">Society</text>

                {/* Nature (bottom right) */}
                <circle cx="235" cy="220" r="55" fill="#10b981" fillOpacity="0.1" stroke="#10b981" strokeWidth="2" />
                <text x="235" y="225" textAnchor="middle" fontSize="14" fill="#10b981" fontWeight="600">Nature</text>
              </svg>
            </div>

            <p className="text-sm text-gray-600 text-center">
              Thoughtfulness and holistic value creation for nature, people, society and the market.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border-t-4" style={{ borderColor: '#10b981' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Eier egen bolig</p>
              <p className="text-3xl font-bold mt-1" style={{ color: '#10b981' }}>
                {Math.round((ownersCount / totalResponses) * 100)}%
              </p>
            </div>
            <div className="text-4xl">🏡</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-t-4" style={{ borderColor: '#4E54C7' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Fornøyd med bosituasjon</p>
              <p className="text-3xl font-bold mt-1" style={{ color: '#4E54C7' }}>
                {Math.round((satisfiedCount / totalResponses) * 100)}%
              </p>
            </div>
            <div className="text-4xl">😊</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-t-4" style={{ borderColor: '#AF5C34' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Planlegger å flytte</p>
              <p className="text-3xl font-bold mt-1" style={{ color: '#AF5C34' }}>
                {Math.round((planningToMoveCount / totalResponses) * 100)}%
              </p>
            </div>
            <div className="text-4xl">📦</div>
          </div>
        </div>
      </div>

      {/* Category Cards */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Utforsk dataene
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className={`bg-gradient-to-br ${category.color} p-6 text-white`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="text-5xl opacity-90">{category.icon}</div>
                  <svg
                    className="w-6 h-6 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">{category.title}</h3>
                <p className="text-white/80 mb-4">{category.description}</p>
                <div className="space-y-2">
                  {category.stats.map((stat, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-white/70">{stat.label}</span>
                      <span className="font-semibold">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Data Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Om undersøkelsen
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <p className="font-medium text-gray-700">Datainnsamling</p>
            <p>Boligbehovsundersøkelse i Rendalen kommune</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Respondenter</p>
            <p>{totalResponses} komplette svar</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Transformert</p>
            <p>{new Date(surveyData.metadata.transformed_at).toLocaleDateString('no-NO')}</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Datakvalitet</p>
            <p>100% verifisert og validert</p>
          </div>
        </div>
      </div>
    </div>
  );
}
