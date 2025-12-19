import type { ProvinceRate, ProvinceData } from '@/types/province';

// Province names mapping
const PROVINCE_NAMES: Record<string, string> = {
  'pinar-del-rio': 'Pinar del Río',
  artemisa: 'Artemisa',
  'la-habana': 'La Habana',
  mayabeque: 'Mayabeque',
  matanzas: 'Matanzas',
  cienfuegos: 'Cienfuegos',
  'villa-clara': 'Villa Clara',
  'sancti-spiritus': 'Sancti Spíritus',
  'ciego-de-avila': 'Ciego de Ávila',
  camaguey: 'Camagüey',
  'las-tunas': 'Las Tunas',
  holguin: 'Holguín',
  granma: 'Granma',
  'santiago-de-cuba': 'Santiago de Cuba',
  guantanamo: 'Guantánamo',
  'isla-de-la-juventud': 'Isla de la Juventud',
};

// Province variance data (percentages from national rate)
// Coordinates are percentages (0-100) for tooltip positioning relative to viewBox
const PROVINCE_VARIANCE: Record<
  string,
  { variance: number; coords: { x: number; y: number } }
> = {
  'pinar-del-rio': { variance: -3.5, coords: { x: 6, y: 42 } },
  artemisa: { variance: -1.2, coords: { x: 12, y: 40 } },
  'la-habana': { variance: 0.5, coords: { x: 17, y: 39 } },
  mayabeque: { variance: -2.1, coords: { x: 21, y: 40 } },
  matanzas: { variance: 12.0, coords: { x: 27, y: 40 } },
  cienfuegos: { variance: 3.5, coords: { x: 33, y: 41 } },
  'villa-clara': { variance: 2.8, coords: { x: 38, y: 40 } },
  'sancti-spiritus': { variance: -1.5, coords: { x: 44, y: 40 } },
  'ciego-de-avila': { variance: 11.5, coords: { x: 50, y: 39 } },
  camaguey: { variance: 1.2, coords: { x: 59, y: 40 } },
  'las-tunas': { variance: -6.5, coords: { x: 67, y: 41 } },
  holguin: { variance: 4.0, coords: { x: 76, y: 42 } },
  granma: { variance: -8.0, coords: { x: 81, y: 58 } },
  'santiago-de-cuba': { variance: 5.5, coords: { x: 88, y: 65 } },
  guantanamo: { variance: -4.0, coords: { x: 95, y: 68 } },
  'isla-de-la-juventud': { variance: -5.5, coords: { x: 8, y: 77 } },
};

/**
 * Generates province rates based on the national USD rate
 * @param nationalRate - The national USD to CUP exchange rate
 * @returns ProvinceData object with calculated rates for each province
 */
export function generateProvinceRates(nationalRate: number): ProvinceData {
  const provinces: ProvinceRate[] = Object.entries(PROVINCE_VARIANCE).map(
    ([id, data]) => ({
      id,
      name: PROVINCE_NAMES[id],
      usdRate: Math.round(nationalRate * (1 + data.variance / 100)),
      variance: data.variance,
      coordinates: data.coords,
    })
  );

  return {
    provinces,
    nationalRate,
    lastUpdated: new Date().toISOString(),
  };
}
