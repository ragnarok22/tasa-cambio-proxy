import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { GET, revalidate } from './route';

const fetchMock = vi.fn<typeof fetch>();

const upstreamData = {
  tasas: {
    USD: 410,
    ECU: 455,
    MLC: 205,
    BTC: 470,
    BNB: 360,
    TRX: 165,
    USDT_TRC20: 450,
  },
  date: '2026-08-31',
  hour: 10,
  minutes: 34,
  seconds: 15,
};

function request(query = '') {
  return new NextRequest(`http://localhost/api/exchange-rate${query}`);
}

beforeEach(() => {
  vi.stubEnv('EL_TOQUE_API_TOKEN', 'test-token');
  fetchMock.mockReset();
  fetchMock.mockRejectedValue(new Error('Unexpected fetch call'));
  vi.stubGlobal('fetch', fetchMock);
});

describe('GET /api/exchange-rate', () => {
  test('keeps the one-hour route cache policy', () => {
    expect(revalidate).toBe(3600);
  });

  test('returns a consumer-friendly error when the token is missing', async () => {
    vi.stubEnv('EL_TOQUE_API_TOKEN', '');

    const response = await GET(request());

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: 'EL_TOQUE_API_TOKEN is not configured',
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test('forwards date filters and transforms the upstream response', async () => {
    fetchMock.mockResolvedValue(Response.json(upstreamData, { status: 200 }));

    const response = await GET(
      request(
        '?date_from=2026-08-31T00%3A00%3A00Z&date_to=2026-08-31T12%3A00%3A00Z'
      )
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      usd: 410,
      eur: 455,
      mlc: 205,
      date: '2026-08-31',
      time: '10:34:15',
      raw: upstreamData,
    });
    expect(fetchMock).toHaveBeenCalledWith(
      'https://tasas.eltoque.com/v1/trmi?date_from=2026-08-31T00%3A00%3A00Z&date_to=2026-08-31T12%3A00%3A00Z',
      {
        headers: {
          accept: '*/*',
          Authorization: 'Bearer test-token',
        },
        next: { revalidate: 3600 },
      }
    );
  });

  test.each([
    {
      name: 'ranges of exactly 24 hours',
      query:
        '?date_from=2026-08-30T00%3A00%3A00Z&date_to=2026-08-31T00%3A00%3A00Z',
      error:
        'Date range must be less than 24 hours. The difference between date_from and date_to cannot exceed 24 hours.',
    },
    {
      name: 'reversed ranges',
      query:
        '?date_from=2026-08-31T12%3A00%3A00Z&date_to=2026-08-31T00%3A00%3A00Z',
      error: 'date_from must be before date_to',
    },
  ])('rejects $name before fetching', async ({ query, error }) => {
    const response = await GET(request(query));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test('preserves an upstream error status', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 503 }));

    const response = await GET(request());

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      error: 'API error: 503',
    });
    expect(fetchMock).toHaveBeenCalledWith(
      'https://tasas.eltoque.com/v1/trmi',
      expect.any(Object)
    );
  });

  test('returns a network failure as a consumer-friendly error', async () => {
    fetchMock.mockRejectedValue(new Error('Network unavailable'));

    const response = await GET(request());

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: 'Network unavailable',
    });
  });

  test('normalizes non-Error failures', async () => {
    fetchMock.mockRejectedValue('network unavailable');

    const response = await GET(request());

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ error: 'Unknown error' });
  });
});
