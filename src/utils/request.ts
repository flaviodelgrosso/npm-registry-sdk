import { RegistryError } from '../error.ts';

interface RequestOptions extends RequestInit {
  endpoint: string;
  params?: Record<string, unknown>;
}

export async function request<T>(registry: string, options: RequestOptions): Promise<T> {
  const { params, endpoint, ...request } = options;

  const url = new URL(registry + endpoint);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value) url.searchParams.append(key, String(value));
    }
  }

  let urlString = url.origin + url.pathname;
  if (url.search) {
    // Base path; path segments like %2F remain encoded.
    // url.search is the raw, percent-encoded query string (e.g., "?q=scope%3Atypes") or empty.
    // This is needed to make API happy with the qualifiers,
    // as it expects special characters (e.g., ':') in query values to be unencoded.
    // decodeURIComponent("?q=scope%3Atypes") results in "?q=scope:types".
    urlString += decodeURIComponent(url.search);
  }

  const response = await fetch(urlString, {
    method: request.method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    ...request,
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new RegistryError(responseData.error, responseData.code);
  }

  return responseData as T;
}
