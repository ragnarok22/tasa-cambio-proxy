import { PriceCard } from '@/components/price-card';
import ProvinceSVGMap from '@/components/Province-svg-map';
import { fetchProvinceRates } from '@/app/actions';
import { Github } from '@/components/Github';

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
  const provinceData = await fetchProvinceRates(rates.usd);

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
      <Github />
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-8 flex flex-col">
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
            <PriceCard
              rate={rates.usd}
              currency="USD"
              name="Dólar Estadounidense"
            />
            <PriceCard rate={rates.eur} currency="EUR" name="Euro" />
            <PriceCard
              rate={rates.mlc}
              currency="MLC"
              name="Moneda Libremente Convertible"
            />
          </div>

          {/* Provincial Map Section */}
          <div className="mt-12">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 text-center">
                  Tasas de Cambio por Provincia
                </h2>
                <p className="text-gray-600 text-sm md:text-base text-center">
                  Tasa nacional:{' '}
                  <span className="font-semibold text-green-600">
                    {rates.usd} CUP/USD
                  </span>
                </p>
                <p className="text-gray-500 text-xs md:text-sm italic mt-1 text-center">
                  Valores referenciales - Las tasas provinciales son
                  estimaciones
                </p>
              </div>

              {/* SVG Map */}
              <div className="mb-6 bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
                <ProvinceSVGMap provinces={provinceData.provinces} />
              </div>

              {/* Legend */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">
                  Leyenda de colores
                </h3>
                <div className="flex flex-wrap gap-4 justify-center text-xs md:text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded" />
                    <span className="text-gray-700">
                      Menor que nacional ({'<'} -2%)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded" />
                    <span className="text-gray-700">
                      Similar a nacional (-2% a +2%)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-indigo-500 rounded" />
                    <span className="text-gray-700">
                      Mayor que nacional ({'>'} +2%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  💡 Pasa el cursor sobre cada provincia para ver su tasa de
                  cambio
                </p>
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
