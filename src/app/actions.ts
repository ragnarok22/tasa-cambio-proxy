'use server';

import OpenAI from 'openai';
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
 * Processes an image URL containing a table of provincial exchange rates using AI vision
 * @param imageUrl - URL of the image to process (must be publicly accessible)
 * @returns Structured data extracted from the image table
 */
export async function processProvinceRatesImage(
  imageUrl: string
): Promise<ProcessImageResponse> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: 'OPENAI_API_KEY is not configured',
    };
  }

  if (!imageUrl || !imageUrl.startsWith('http')) {
    return {
      success: false,
      error: 'Invalid image URL. Must be a valid HTTP/HTTPS URL',
    };
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
                url: imageUrl,
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
