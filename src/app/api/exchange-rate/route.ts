import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 3600; // Cache for 1 hour

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

export async function GET(request: NextRequest) {
  const token = process.env.EL_TOQUE_API_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: 'EL_TOQUE_API_TOKEN is not configured' },
      { status: 500 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const dateFrom = searchParams.get('date_from');
  const dateTo = searchParams.get('date_to');

  try {
    const url = new URL('https://tasas.eltoque.com/v1/trmi');
    if (dateFrom) {
      url.searchParams.set('date_from', dateFrom);
    }
    if (dateTo) {
      url.searchParams.set('date_to', dateTo);
    }

    const response = await fetch(url.toString(), {
      headers: {
        accept: '*/*',
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data: TRMIResponse = await response.json();

    // Transform to simple format for backwards compatibility
    const transformed = {
      usd: data.tasas.USD,
      eur: data.tasas.ECU,
      mlc: data.tasas.MLC,
      date: data.date,
      time: `${data.hour}:${data.minutes}:${data.seconds}`,
      raw: data, // Include raw data for advanced use
    };

    return NextResponse.json(transformed);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
