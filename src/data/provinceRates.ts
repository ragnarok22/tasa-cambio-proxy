import type { ProvinceRate, ProvinceData } from '@/types/province';

// Province names mapping (using CU-XX format to match SVG)
const PROVINCE_NAMES: Record<string, string> = {
  'CU-01': 'Pinar del Río',
  'CU-15': 'Artemisa',
  'CU-03': 'Ciudad de la Habana',
  'CU-16': 'Mayabeque',
  'CU-04': 'Matanzas',
  'CU-06': 'Cienfuegos',
  'CU-05': 'Villa Clara',
  'CU-07': 'Sancti Spíritus',
  'CU-08': 'Ciego de Ávila',
  'CU-09': 'Camagüey',
  'CU-10': 'Las Tunas',
  'CU-11': 'Holguín',
  'CU-12': 'Granma',
  'CU-13': 'Santiago de Cuba',
  'CU-14': 'Guantánamo',
  'CU-99': 'Isla de la Juventud',
};

// Province variance data (percentages from national rate)
// Coordinates are percentages (0-100) for tooltip positioning relative to viewBox
const PROVINCE_VARIANCE: Record<
  string,
  { variance: number; coords: { x: number; y: number } }
> = {
  'CU-01': { variance: -3.5, coords: { x: 6, y: 42 } },
  'CU-15': { variance: -1.2, coords: { x: 12, y: 40 } },
  'CU-03': { variance: 0.5, coords: { x: 17, y: 39 } },
  'CU-16': { variance: -2.1, coords: { x: 21, y: 40 } },
  'CU-04': { variance: 12.0, coords: { x: 27, y: 40 } },
  'CU-06': { variance: 3.5, coords: { x: 33, y: 41 } },
  'CU-05': { variance: 2.8, coords: { x: 38, y: 40 } },
  'CU-07': { variance: -1.5, coords: { x: 44, y: 40 } },
  'CU-08': { variance: 11.5, coords: { x: 50, y: 39 } },
  'CU-09': { variance: 1.2, coords: { x: 59, y: 40 } },
  'CU-10': { variance: -6.5, coords: { x: 67, y: 41 } },
  'CU-11': { variance: 4.0, coords: { x: 76, y: 42 } },
  'CU-12': { variance: -8.0, coords: { x: 81, y: 58 } },
  'CU-13': { variance: 5.5, coords: { x: 88, y: 65 } },
  'CU-14': { variance: -4.0, coords: { x: 95, y: 68 } },
  'CU-99': { variance: -5.5, coords: { x: 8, y: 77 } },
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
