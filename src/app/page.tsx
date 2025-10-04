interface ExchangeRate {
  usd: number;
  eur: number;
  mlc: number;
}

interface TRMIResponse {
  tasas: {
    USD: number;
    ECU: number;
    MLC: number;
    [key: string]: number;
  };
  date: string;
  hour: number;
  minutes: number;
  seconds: number;
}

async function getExchangeRates(): Promise<ExchangeRate> {
  const token = process.env.EL_TOQUE_API_TOKEN;

  if (!token) {
    throw new Error('EL_TOQUE_API_TOKEN is not configured');
  }

  const response = await fetch('https://tasas.eltoque.com/v1/trmi', {
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const data: TRMIResponse = await response.json();

  return {
    usd: data.tasas.USD,
    eur: data.tasas.ECU,
    mlc: data.tasas.MLC,
  };
}

export default async function Home() {
  const rates = await getExchangeRates();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Tasa de Cambio Cuba',
    description:
      'Consulta las tasas de cambio del mercado informal cubano (TRMI)',
    url: 'https://tasa-cambio-cuba.vercel.app',
    applicationCategory: 'FinanceApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    inLanguage: 'es',
    provider: {
      '@type': 'Organization',
      name: 'El Toque',
      url: 'https://eltoque.com',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 flex flex-col">
        <div className="max-w-6xl mx-auto flex-1 flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 text-center">
            Tasas de Cambio - Cuba
          </h1>
          <p className="text-gray-600 text-center mb-2">
            Tasas actualizadas del mercado informal
          </p>
          <p className="text-gray-500 text-sm text-center mb-8 italic">
            Valores referenciales - Pueden variar en transacciones reales
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* USD Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-700">USD</h2>
                <span className="text-4xl">🇺🇸</span>
              </div>
              <div className="text-center">
                <p className="text-gray-500 text-sm mb-1">
                  Dólar Estadounidense
                </p>
                <p className="text-5xl font-bold text-green-600">{rates.usd}</p>
                <p className="text-gray-400 text-sm mt-2">CUP</p>
              </div>
            </div>

            {/* EUR Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-700">EUR</h2>
                <span className="text-4xl">🇪🇺</span>
              </div>
              <div className="text-center">
                <p className="text-gray-500 text-sm mb-1">Euro</p>
                <p className="text-5xl font-bold text-blue-600">{rates.eur}</p>
                <p className="text-gray-400 text-sm mt-2">CUP</p>
              </div>
            </div>

            {/* MLC Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-700">MLC</h2>
                <span className="text-4xl">🇨🇺</span>
              </div>
              <div className="text-center">
                <p className="text-gray-500 text-sm mb-1">
                  Moneda Libremente Convertible
                </p>
                <p className="text-5xl font-bold text-purple-600">
                  {rates.mlc}
                </p>
                <p className="text-gray-400 text-sm mt-2">CUP</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>Datos proporcionados por El Toque</p>
            <p className="mt-1 text-xs">
              Las tasas mostradas son referenciales y pueden no reflejar el
              valor exacto en operaciones reales
            </p>
          </div>
        </div>

        <footer className="mt-auto pt-8 pb-4 text-center text-gray-600 text-sm">
          <p>
            Creado por{' '}
            <a
              href="https://reinierhernandez.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              Reinier Hernández
            </a>
          </p>
        </footer>
      </div>
    </>
  );
}
