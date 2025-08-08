
type httpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type json = Record<string, any>;


export async function baseAPI(method: httpMethod, url: string, body?: json) {
  try {
    let finalUrl = url;

    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (method === 'GET' && body) {
      finalUrl += toQueryString(body);
    } else if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(finalUrl, options);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
}

function toQueryString(params: json): string {
  const esc = encodeURIComponent;
  return (
    '?' +
    Object.entries(params)
      .map(([k, v]) => `${esc(k)}=${esc(String(v))}`)
      .join('&')
  );
}