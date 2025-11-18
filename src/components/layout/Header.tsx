'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navigation = [
  { name: 'Oversikt', href: '/', icon: '📊' },
  { name: 'Demografi', href: '/demografi', icon: '👥' },
  { name: 'Bolig', href: '/bolig', icon: '🏠' },
  { name: 'Økonomi', href: '/okonomi', icon: '💰' },
  { name: 'Flytting', href: '/flytting', icon: '🚚' },
  { name: 'Innspill', href: '/innspill', icon: '💬' },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-natural-state-warm shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Title */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="text-2xl">🏔️</div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Rendalen
                </h1>
                <p className="text-xs text-gray-500">Boligundersøkelse 2025</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    flex items-center space-x-2
                    ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Natural State Badge - Only on larger screens */}
          <div className="hidden xl:flex items-center gap-2 text-xs text-gray-600">
            <span className="font-medium">Powered by</span>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-gray-200">
              <div className="w-5 h-5 rounded-full" style={{ backgroundColor: '#4E54C7' }}></div>
              <span className="font-semibold" style={{ color: '#4E54C7' }}>Natural State</span>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Åpne hovedmeny</span>
            {mobileMenuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-natural-state-warm">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    block px-3 py-2 rounded-md text-base font-medium
                    flex items-center space-x-2
                    ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
