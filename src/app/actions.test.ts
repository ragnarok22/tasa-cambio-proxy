import {
  afterEach,
  beforeEach,
  describe,
  expect,
  test,
  vi,
  type Mock,
} from 'vitest';

const serviceMocks = vi.hoisted(() => {
  const cacheRegistrations: unknown[][] = [];

  return {
    cacheRegistrations,
    createCompletion: vi.fn(),
    unstableCache: vi.fn(
      (callback: (...args: never[]) => unknown, ...options: unknown[]) => {
        cacheRegistrations.push(options);
        return callback;
      }
    ),
  };
});

vi.mock('next/cache', () => ({
  unstable_cache: serviceMocks.unstableCache,
}));

vi.mock('openai', () => ({
  default: class MockOpenAI {
    chat = {
      completions: {
        create: serviceMocks.createCompletion,
      },
    };
  },
}));

import {
  fetchProvinceRates,
  fetchTRMI,
  processProvinceRatesImage,
} from './actions';

const fetchMock = vi.fn<typeof fetch>();
const createCompletionMock = serviceMocks.createCompletion as Mock;

const upstreamData = {
  tasas: {
    USD: 410,
    ECU: 455,
    MLC: 205,
  },
  date: '2026-08-31',
  hour: 10,
  minutes: 34,
  seconds: 15,
};

function completion(content: string | null) {
  return {
    choices: [{ message: { content } }],
  };
}

beforeEach(() => {
  vi.stubEnv('EL_TOQUE_API_TOKEN', 'test-token');
  vi.stubEnv('OPENAI_API_KEY', 'test-openai-key');
  fetchMock.mockReset();
  fetchMock.mockRejectedValue(new Error('Unexpected fetch call'));
  vi.stubGlobal('fetch', fetchMock);
  createCompletionMock.mockReset();
  createCompletionMock.mockRejectedValue(
    new Error('Unexpected OpenAI completion call')
  );
});

afterEach(() => {
  vi.useRealTimers();
});

describe('fetchTRMI', () => {
  test('returns a consumer-friendly error when the token is missing', async () => {
    vi.stubEnv('EL_TOQUE_API_TOKEN', '');

    await expect(fetchTRMI()).resolves.toEqual({
      success: false,
      error: 'EL_TOQUE_API_TOKEN is not configured',
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test('forwards filters and transforms ECU to the app-facing EUR field', async () => {
    fetchMock.mockResolvedValue(Response.json(upstreamData));

    await expect(
      fetchTRMI({
        dateFrom: '2026-08-31T00:00:00Z',
        dateTo: '2026-08-31T12:00:00Z',
      })
    ).resolves.toEqual({
      success: true,
      data: {
        usd: 410,
        eur: 455,
        mlc: 205,
        date: '2026-08-31',
        time: '10:34:15',
        raw: upstreamData,
      },
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
      params: {
        dateFrom: '2026-08-30T00:00:00Z',
        dateTo: '2026-08-31T00:00:00Z',
      },
      error:
        'Date range must be less than 24 hours. The difference between dateFrom and dateTo cannot exceed 24 hours.',
    },
    {
      name: 'reversed ranges',
      params: {
        dateFrom: '2026-08-31T12:00:00Z',
        dateTo: '2026-08-31T00:00:00Z',
      },
      error: 'dateFrom must be before dateTo',
    },
  ])('rejects $name before fetching', async ({ params, error }) => {
    await expect(fetchTRMI(params)).resolves.toEqual({
      success: false,
      error,
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test('normalizes upstream HTTP failures', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 503 }));

    await expect(fetchTRMI()).resolves.toEqual({
      success: false,
      error: 'API error: 503',
    });
  });

  test('normalizes non-Error network failures', async () => {
    fetchMock.mockRejectedValue('network unavailable');

    await expect(fetchTRMI()).resolves.toEqual({
      success: false,
      error: 'Unknown error',
    });
  });
});

describe('processProvinceRatesImage', () => {
  test('keeps the twelve-hour cache registration', () => {
    expect(serviceMocks.cacheRegistrations).toContainEqual([
      ['province-rates-image'],
      {
        revalidate: 43200,
        tags: ['province-rates'],
      },
    ]);
  });

  test('returns an error when the OpenAI key is missing', async () => {
    vi.stubEnv('OPENAI_API_KEY', '');

    await expect(
      processProvinceRatesImage('https://example.com/rates.png')
    ).resolves.toEqual({
      success: false,
      error: 'OPENAI_API_KEY is not configured',
    });
    expect(createCompletionMock).not.toHaveBeenCalled();
  });

  test('rejects non-HTTP image URLs', async () => {
    await expect(processProvinceRatesImage('rates.png')).resolves.toEqual({
      success: false,
      error: 'Invalid image URL. Must be a valid HTTP/HTTPS URL',
    });
    expect(createCompletionMock).not.toHaveBeenCalled();
  });

  test('parses JSON returned inside a Markdown code block', async () => {
    const content =
      '```json\n[{"province":"Pinar del Río","usd":390,"eur":430}]\n```';
    createCompletionMock.mockResolvedValue(completion(content));

    await expect(
      processProvinceRatesImage('https://example.com/rates.png')
    ).resolves.toEqual({
      success: true,
      data: [{ province: 'Pinar del Río', usd: 390, eur: 430 }],
      rawResponse: content,
    });
    expect(createCompletionMock).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'gpt-4o',
        max_tokens: 2000,
        messages: [
          expect.objectContaining({
            role: 'user',
            content: expect.arrayContaining([
              expect.objectContaining({ type: 'text' }),
              {
                type: 'image_url',
                image_url: {
                  url: 'https://example.com/rates.png',
                },
              },
            ]),
          }),
        ],
      })
    );
  });

  test('handles an empty model response', async () => {
    createCompletionMock.mockResolvedValue(completion(null));

    await expect(
      processProvinceRatesImage('https://example.com/rates.png')
    ).resolves.toEqual({
      success: false,
      error: 'No response from AI model',
    });
  });

  test.each([
    {
      name: 'malformed JSON',
      content: '{invalid',
      error: /^Failed to parse AI response:/,
    },
    {
      name: 'a non-array response',
      content: '{"province":"Matanzas","usd":400}',
      error: /Response is not an array/,
    },
    {
      name: 'an item without a province name',
      content: '[{"usd":400}]',
      error: /Invalid province data structure/,
    },
  ])('rejects $name', async ({ content, error }) => {
    createCompletionMock.mockResolvedValue(completion(content));

    const result = await processProvinceRatesImage(
      'https://example.com/rates.png'
    );

    expect(result).toMatchObject({
      success: false,
      error: expect.stringMatching(error),
      rawResponse: content,
    });
  });

  test('normalizes OpenAI failures', async () => {
    createCompletionMock.mockRejectedValue(new Error('OpenAI unavailable'));

    await expect(
      processProvinceRatesImage('https://example.com/rates.png')
    ).resolves.toEqual({
      success: false,
      error: 'OpenAI unavailable',
    });
  });
});

describe('fetchProvinceRates', () => {
  test('falls back to an empty result when image processing fails', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-31T14:00:00.000Z'));
    vi.stubEnv('OPENAI_API_KEY', '');

    await expect(fetchProvinceRates(410)).resolves.toEqual({
      provinces: [],
      nationalRate: 410,
      lastUpdated: '2026-08-31T14:00:00.000Z',
    });
  });

  test('maps known provinces and calculates rounded variance', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-31T14:00:00.000Z'));
    createCompletionMock.mockResolvedValue(
      completion(
        JSON.stringify([
          { province: 'Pinar del Río', usd: 390 },
          { province: 'Ciudad de la Habana', usd: 421 },
          { province: 'Unknown', usd: 500 },
          { province: 'Matanzas' },
        ])
      )
    );

    await expect(fetchProvinceRates(410)).resolves.toEqual({
      provinces: [
        {
          id: 'CU-01',
          name: 'Pinar del Río',
          usdRate: 390,
          variance: -4.9,
          coordinates: { x: 6, y: 42 },
        },
        {
          id: 'CU-03',
          name: 'Ciudad de la Habana',
          usdRate: 421,
          variance: 2.7,
          coordinates: { x: 17, y: 39 },
        },
      ],
      nationalRate: 410,
      lastUpdated: '2026-08-31T14:00:00.000Z',
    });
  });
});
