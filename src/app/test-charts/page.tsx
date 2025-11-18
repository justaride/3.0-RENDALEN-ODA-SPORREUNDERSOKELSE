'use client';

import { PieChart } from '@/components/charts/PieChart';
import { HorizontalBarChart } from '@/components/charts/HorizontalBarChart';
import { BarChart } from '@/components/charts/BarChart';
import type { ChartData } from '@/lib/types/survey';

export default function TestChartsPage() {
  // Simple test data
  const testData: ChartData[] = [
    { name: 'Kategori A', value: 25, count: 25, percent: 25 },
    { name: 'Kategori B', value: 35, count: 35, percent: 35 },
    { name: 'Kategori C', value: 20, count: 20, percent: 20 },
    { name: 'Kategori D', value: 15, count: 15, percent: 15 },
    { name: 'Kategori E', value: 5, count: 5, percent: 5 },
  ];

  const totalResponses = 100;

  console.log('TestChartsPage: Rendering with data:', testData);

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Chart Testing Page</h1>

      <div className="bg-yellow-100 border border-yellow-400 p-4 rounded">
        <p className="font-bold">Debug Info:</p>
        <p>Data length: {testData.length}</p>
        <p>Total responses: {totalResponses}</p>
      </div>

      <section className="border border-gray-300 p-6 rounded">
        <h2 className="text-2xl font-bold mb-4">1. PieChart (Should Work)</h2>
        <PieChart
          data={testData}
          title="Test Pie Chart"
          description="This should render correctly"
          totalResponses={totalResponses}
        />
      </section>

      <section className="border border-gray-300 p-6 rounded">
        <h2 className="text-2xl font-bold mb-4">2. Vertical BarChart</h2>
        <BarChart
          data={testData}
          title="Test Vertical Bar Chart"
          description="Testing vertical orientation"
          totalResponses={totalResponses}
          orientation="vertical"
        />
      </section>

      <section className="border border-gray-300 p-6 rounded">
        <h2 className="text-2xl font-bold mb-4">3. Horizontal BarChart</h2>
        <BarChart
          data={testData}
          title="Test Horizontal Bar Chart"
          description="Testing horizontal orientation"
          totalResponses={totalResponses}
          orientation="horizontal"
        />
      </section>

      <section className="border border-gray-300 p-6 rounded">
        <h2 className="text-2xl font-bold mb-4">4. HorizontalBarChart Component</h2>
        <HorizontalBarChart
          data={testData}
          title="Test HorizontalBarChart"
          description="Using the HorizontalBarChart wrapper"
          totalResponses={totalResponses}
        />
      </section>
    </div>
  );
}
