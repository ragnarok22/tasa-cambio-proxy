import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 3600; // Cache for 1 hour

interface TRMIResponse {
  tasas: {
    ECU: number;
    BNB: number;
    USD: number;
    BTC: number;
    TRX: number;
    USDT_TRC20: number;
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

  // Validate date range (must be less than 24 hours)
  if (dateFrom && dateTo) {
    const from = new Date(dateFrom);
    const to = new Date(dateTo);
    const diffInHours = (to.getTime() - from.getTime()) / (1000 * 60 * 60);

    if (diffInHours >= 24) {
      return NextResponse.json(
        {
          error:
            'Date range must be less than 24 hours. The difference between date_from and date_to cannot exceed 24 hours.',
        },
        { status: 400 }
      );
    }

    if (diffInHours < 0) {
      return NextResponse.json(
        { error: 'date_from must be before date_to' },
        { status: 400 }
      );
    }
  }

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
