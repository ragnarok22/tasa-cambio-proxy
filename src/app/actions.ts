'use server';

import { generateProvinceRates } from '@/data/province-rates';
import type { ProvinceData } from '@/types/province';

interface FetchTRMIParams {
  dateFrom?: string;
  dateTo?: string;
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

export async function fetchTRMI(params?: FetchTRMIParams) {
  const token = process.env.EL_TOQUE_API_TOKEN;

  if (!token) {
    return {
      success: false,
      error: 'EL_TOQUE_API_TOKEN is not configured',
    };
  }

  // Validate date range (must be less than 24 hours)
  if (params?.dateFrom && params?.dateTo) {
    const from = new Date(params.dateFrom);
    const to = new Date(params.dateTo);
    const diffInHours = (to.getTime() - from.getTime()) / (1000 * 60 * 60);

    if (diffInHours >= 24) {
      return {
        success: false,
        error:
          'Date range must be less than 24 hours. The difference between dateFrom and dateTo cannot exceed 24 hours.',
      };
    }

    if (diffInHours < 0) {
      return {
        success: false,
        error: 'dateFrom must be before dateTo',
      };
    }
  }

  try {
    const url = new URL('https://tasas.eltoque.com/v1/trmi');
    if (params?.dateFrom) {
      url.searchParams.set('date_from', params.dateFrom);
    }
    if (params?.dateTo) {
      url.searchParams.set('date_to', params.dateTo);
    }

    const response = await fetch(url.toString(), {
      headers: {
        accept: '*/*',
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: TRMIResponse = await response.json();

    // Transform to simple format
    const transformed = {
      usd: data.tasas.USD,
      eur: data.tasas.ECU,
      mlc: data.tasas.MLC,
      date: data.date,
      time: `${data.hour}:${data.minutes}:${data.seconds}`,
      raw: data,
    };

    return { success: true, data: transformed };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Fetches province exchange rates based on the national USD rate
 * @param nationalUsdRate - The national USD to CUP exchange rate
 * @returns ProvinceData object with calculated rates for each province
 */
export async function fetchProvinceRates(
  nationalUsdRate: number
): Promise<ProvinceData> {
  // This is currently synchronous, but using async allows for
  // future enhancements like fetching from an API or database
  return generateProvinceRates(nationalUsdRate);
}
