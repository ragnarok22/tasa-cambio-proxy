'use server';

interface FetchTRMIParams {
  dateFrom?: string;
  dateTo?: string;
}

export async function fetchTRMI(params?: FetchTRMIParams) {
  const token = process.env.EL_TOQUE_API_TOKEN;

  if (!token) {
    return {
      success: false,
      error: 'EL_TOQUE_API_TOKEN is not configured',
    };
  }

  try {
    const dateFrom =
      params?.dateFrom || new Date().toISOString().split('T')[0] + ' 00:00:01';
    const dateTo =
      params?.dateTo || new Date().toISOString().split('T')[0] + ' 23:59:01';

    const url = new URL('https://tasas.eltoque.com/v1/trmi');
    url.searchParams.set('date_from', dateFrom);
    url.searchParams.set('date_to', dateTo);

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

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
