export function Footer() {
  return (
    <footer className="bg-natural-state-warm border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Natural State Info */}
          <div>
            <img
              src="/images/natural-state/logo-stacked.png"
              alt="Natural State"
              className="h-16 mb-4"
            />
            <p className="text-sm text-gray-600 mb-4">
              Natural State is a strategy agency specialising in place development and sustainable economics.
            </p>
            <div className="flex gap-4 text-sm">
              <a
                href="https://naturalstate.no"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
                style={{ color: '#4E54C7' }}
              >
                www.naturalstate.no →
              </a>
            </div>
          </div>

          {/* Project Info */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Rendalen Boligundersøkelse</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-center gap-2">
                <span style={{ color: '#4E54C7' }}>→</span>
                <span>1015 respondenter</span>
              </li>
              <li className="flex items-center gap-2">
                <span style={{ color: '#4E54C7' }}>→</span>
                <span>54 spørsmål</span>
              </li>
              <li className="flex items-center gap-2">
                <span style={{ color: '#4E54C7' }}>→</span>
                <span>258 fritekst-svar</span>
              </li>
              <li className="flex items-center gap-2">
                <span style={{ color: '#4E54C7' }}>→</span>
                <span>Gjennomført 2025</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Kontakt</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium text-gray-900">Oda Ellensdatter Solberg</p>
              <p>Prosjektleder</p>
              <a
                href="mailto:oda@naturalstate.no"
                className="hover:underline block"
                style={{ color: '#4E54C7' }}
              >
                oda@naturalstate.no
              </a>
              <a
                href="tel:+4793210639"
                className="hover:underline block"
                style={{ color: '#4E54C7' }}
              >
                +47 93210639
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-sm text-gray-500">
          <p>
            © 2025 Natural State · Place development · Sustainable economics
          </p>
        </div>
      </div>
    </footer>
  );
}
