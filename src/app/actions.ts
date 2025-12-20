'use server';

import OpenAI from 'openai';
import { readFileSync } from 'fs';
import { join } from 'path';
import type { ProvinceData, ProvinceRate } from '@/types/province';

// Province name to ID mapping (CU-XX format to match SVG)
const PROVINCE_NAME_TO_ID: Record<string, string> = {
  'Pinar del Río': 'CU-01',
  Artemisa: 'CU-15',
  'La Habana': 'CU-03',
  'Ciudad de la Habana': 'CU-03',
  Mayabeque: 'CU-16',
  Matanzas: 'CU-04',
  Cienfuegos: 'CU-06',
  'Villa Clara': 'CU-05',
  'Sancti Spíritus': 'CU-07',
  'Ciego de Ávila': 'CU-08',
  Camagüey: 'CU-09',
  'Las Tunas': 'CU-10',
  Holguín: 'CU-11',
  Granma: 'CU-12',
  'Santiago de Cuba': 'CU-13',
  Guantánamo: 'CU-14',
  'Isla de la Juventud': 'CU-99',
  'La Isla de la Juventud': 'CU-99',
};

// Province coordinates for tooltip positioning (percentages relative to viewBox)
const PROVINCE_COORDINATES: Record<string, { x: number; y: number }> = {
  'CU-01': { x: 6, y: 42 },
  'CU-15': { x: 12, y: 40 },
  'CU-03': { x: 17, y: 39 },
  'CU-16': { x: 21, y: 40 },
  'CU-04': { x: 27, y: 40 },
  'CU-06': { x: 33, y: 41 },
  'CU-05': { x: 38, y: 40 },
  'CU-07': { x: 44, y: 40 },
  'CU-08': { x: 50, y: 39 },
  'CU-09': { x: 59, y: 40 },
  'CU-10': { x: 67, y: 41 },
  'CU-11': { x: 76, y: 42 },
  'CU-12': { x: 81, y: 58 },
  'CU-13': { x: 88, y: 65 },
  'CU-14': { x: 95, y: 68 },
  'CU-99': { x: 8, y: 77 },
};

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
 * Fetches province exchange rates using AI vision to process the image
 * @param nationalUsdRate - The national USD to CUP exchange rate (used for variance calculation)
 * @returns ProvinceData object with rates extracted from the image
 */
export async function fetchProvinceRates(
  nationalUsdRate: number
): Promise<ProvinceData> {
  // Get province rates from AI vision processing
  const result = await processProvinceRatesImage();

  if (!result.success || !result.data) {
    // Fallback: return empty data if AI fails
    return {
      provinces: [],
      nationalRate: nationalUsdRate,
      lastUpdated: new Date().toISOString(),
    };
  }

  // Transform AI data to ProvinceRate format
  const provinces: ProvinceRate[] = result.data
    .map((item) => {
      const provinceId = PROVINCE_NAME_TO_ID[item.province];
      if (!provinceId || !item.usd) {
        return null;
      }

      // Calculate variance as percentage from national rate
      const variance = ((item.usd - nationalUsdRate) / nationalUsdRate) * 100;

      return {
        id: provinceId,
        name: item.province,
        usdRate: item.usd,
        variance: parseFloat(variance.toFixed(1)),
        coordinates: PROVINCE_COORDINATES[provinceId] || { x: 50, y: 50 },
      };
    })
    .filter((province): province is ProvinceRate => province !== null);

  return {
    provinces,
    nationalRate: nationalUsdRate,
    lastUpdated: new Date().toISOString(),
  };
}

interface ProvinceRateData {
  province: string;
  usd?: number;
  eur?: number;
  mlc?: number;
}

interface ProcessImageResponse {
  success: boolean;
  data?: ProvinceRateData[];
  error?: string;
  rawResponse?: string;
}

/**
 * Processes an image containing a table of provincial exchange rates using AI vision
 * @param imageUrl - Optional URL of the image to process. If not provided, reads from public/tasa.jpg
 * @returns Structured data extracted from the image table
 */
export async function processProvinceRatesImage(
  imageUrl?: string
): Promise<ProcessImageResponse> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: 'OPENAI_API_KEY is not configured',
    };
  }

  let imageSource: string;

  // If no URL provided, read from local file
  if (!imageUrl) {
    try {
      const imagePath = join(process.cwd(), 'public', 'tasa.jpg');
      const imageBuffer = readFileSync(imagePath);
      const base64Image = imageBuffer.toString('base64');
      imageSource = `data:image/jpeg;base64,${base64Image}`;
    } catch (fileError) {
      return {
        success: false,
        error: `Failed to read local image: ${fileError instanceof Error ? fileError.message : 'Unknown error'}`,
      };
    }
  } else {
    // Validate URL format
    if (!imageUrl.startsWith('http')) {
      return {
        success: false,
        error: 'Invalid image URL. Must be a valid HTTP/HTTPS URL',
      };
    }
    imageSource = imageUrl;
  }

  try {
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this image which contains a table with Cuban provincial exchange rates.
Extract the data and return it as a JSON array with the following structure:
[
  {
    "province": "Province Name",
    "usd": 123.45,
    "eur": 123.45,
    "mlc": 123.45
  }
]

Important:
- Return ONLY valid JSON, no markdown code blocks or extra text
- Use exact province names from the image
- Include all currencies shown (USD, EUR, MLC) as numbers
- If a currency is not shown for a province, omit that field
- Province names should be in Spanish as they appear in the image`,
            },
            {
              type: 'image_url',
              image_url: {
                url: imageSource,
              },
            },
          ],
        },
      ],
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      return {
        success: false,
        error: 'No response from AI model',
      };
    }

    // Try to parse the JSON response
    let parsedData: ProvinceRateData[];
    try {
      // Remove markdown code blocks if present
      const cleanedContent = content
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      parsedData = JSON.parse(cleanedContent);

      // Validate the structure
      if (!Array.isArray(parsedData)) {
        throw new Error('Response is not an array');
      }

      // Validate each item has required fields
      for (const item of parsedData) {
        if (!item.province || typeof item.province !== 'string') {
          throw new Error('Invalid province data structure');
        }
      }
    } catch (parseError) {
      return {
        success: false,
        error: `Failed to parse AI response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`,
        rawResponse: content,
      };
    }

    return {
      success: true,
      data: parsedData,
      rawResponse: content,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
