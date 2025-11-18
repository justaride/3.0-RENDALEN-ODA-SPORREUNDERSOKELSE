'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  {
    name: 'Oversikt',
    href: '/',
    icon: '📊',
    description: 'Hovedoversikt og nøkkeltall'
  },
  {
    name: 'Demografi',
    href: '/demografi',
    icon: '👥',
    description: 'Alder, kjønn, husstand'
  },
  {
    name: 'Bolig',
    href: '/bolig',
    icon: '🏠',
    description: 'Boligsituasjon og tilfredshet'
  },
  {
    name: 'Økonomi',
    href: '/okonomi',
    icon: '💰',
    description: 'Kjøpekraft og støtteordninger'
  },
  {
    name: 'Flytting',
    href: '/flytting',
    icon: '🚚',
    description: 'Flytteplaner og preferanser'
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="p-6">
        {/* Stats */}
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Undersøkelsen
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Respondenter</span>
              <span className="font-semibold text-gray-900">1015</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Spørsmål</span>
              <span className="font-semibold text-gray-900">54</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Kategorier</span>
              <span className="font-semibold text-gray-900">13</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Kategorier
          </h3>
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`
                      group flex items-start p-3 rounded-lg transition-colors
                      ${
                        isActive
                          ? 'bg-primary text-white'
                          : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    <span className="text-xl mr-3 flex-shrink-0">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">
                        {item.name}
                      </p>
                      <p className={`
                        text-xs mt-0.5
                        ${isActive ? 'text-white/80' : 'text-gray-500'}
                      `}>
                        {item.description}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
