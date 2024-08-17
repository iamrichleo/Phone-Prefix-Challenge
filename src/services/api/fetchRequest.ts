type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface FetchOptions<T> {
  method?: HttpMethod;
  headers?: HeadersInit;
  body?: T;
  responseType?: 'json' | 'text'; // Added responseType option
}

export default async function fetchRequest<TResponse, TRequest = undefined>(
  url: string,
  options?: FetchOptions<TRequest>
): Promise<TResponse> {
  try {
    const { method = 'GET', headers = {}, body, responseType = 'json' } = options || {};

    const response = await fetch(url, {
      method,
      headers: {
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    // Check if the response is OK (status code 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
    }

    // Parse the response based on the expected response type
    let data: TResponse;
    if (responseType === 'json') {
      data = (await response.json()) as TResponse;
    } else if (responseType === 'text') {
      data = (await response.text()) as TResponse;
    } else {
      throw new Error('Unsupported response type');
    }

    return data;
  } catch (error) {
    // Log the error and rethrow it so it can be handled by the calling code
    console.error('Fetch request failed:', error);
    throw error;
  }
}
