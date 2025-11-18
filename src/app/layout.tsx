import type { Metadata } from 'next';
import '../styles/globals.css';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Rendalen Boligbehovsundersøkelse 2025',
  description: 'Interaktivt dashboard for visualisering og analyse av Rendalen kommunes boligbehovsundersøkelse med 1015 respondenter',
  keywords: ['Rendalen', 'boligbehov', 'boligundersøkelse', 'kommune', 'analyse'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="no">
      <body>
        <div className="min-h-screen bg-neutral-50 flex flex-col">
          {/* Header Navigation */}
          <Header />

          {/* Main Layout with Sidebar */}
          <div className="flex flex-1">
            {/* Sidebar (hidden on mobile/tablet) */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto w-full">
              {children}
            </main>
          </div>

          {/* Footer */}
          <Footer />
        </div>
      </body>
    </html>
  );
}
