import { api } from './api.ts';
import { RegistryError } from './error.ts';
import { type SearchQueryQualifiers, buildSearchQueryWithQualifiers } from './qualifiers.ts';
import type { PackageInfo, PackageMetadata, SearchOptions, SearchResults } from './types.ts';

const DEFAULT_REGISTRY_URL = 'https://registry.npmjs.org';

type RequestOptions = {
  endpoint: string;
  params?: Record<string, unknown>;
};

type RegistryOptions = Pick<RequestInit, 'signal' | 'headers'> & {
  /**
   * The base URL of the NPM Registry API.
   * @default 'https://registry.npmjs.org'
   */
  url?: string;
};

export class NpmRegistry {
  private url: string;
  private signal?: AbortSignal | null;
  private headers?: HeadersInit;

  constructor({ url, signal, headers }: RegistryOptions = {}) {
    this.url = url || DEFAULT_REGISTRY_URL;
    this.signal = signal;
    this.headers = headers;
  }

  /**
   * Get package information from the registry
   * @param packageName The package name
   * @returns The package information
   */
  public async getPackage(packageName: string): Promise<PackageInfo> {
    return this.#__request<PackageInfo>({
      endpoint: api.getPackage(packageName),
    });
  }

  /**
   * Get package metadata for a specific version
   * @param packageName The package name
   * @param version The package version
   * @returns Package metadata
   */
  public async getPackageVersion(packageName: string, version: string): Promise<PackageMetadata> {
    return this.#__request<PackageMetadata>({
      endpoint: api.getPackageVersion(packageName, version),
    });
  }

  /**
   * Get the latest version of a package
   * @param packageName The package name
   * @returns The latest version metadata
   */
  public async getLatestVersion(packageName: string): Promise<PackageMetadata> {
    return this.#__request<PackageMetadata>({
      endpoint: api.getLatestVersion(packageName),
    });
  }

  /**
   * Search for packages in the registry
   * @param query The search query
   * @param size The number of results to return (max 250)
   * @param from The starting point for pagination
   */
  public async search(
    query: string,
    options?: SearchOptions & { qualifiers?: SearchQueryQualifiers },
  ): Promise<SearchResults> {
    const { qualifiers, ...searchOptions } = options || {};
    const queryWithQualifiers = qualifiers
      ? buildSearchQueryWithQualifiers(query, qualifiers)
      : query;

    return this.#__request({
      endpoint: api.search(),
      params: {
        text: queryWithQualifiers,
        ...searchOptions,
      },
    });
  }

  /**
   * Download a package tarball
   * @param packageName The package name
   * @param version The package version
   * @returns The tarball as an ArrayBuffer
   */
  public async downloadTarball(packageName: string, version: string): Promise<ArrayBuffer> {
    const tarballUrl = `${this.url}/${api.downloadTarball(packageName, version)}`;

    const response = await fetch(tarballUrl, {
      signal: this.signal,
      headers: this.headers,
    });

    if (!response.ok) {
      throw new RegistryError(
        `Failed to download tarball: ${response.statusText}`,
        'DOWNLOAD_ERROR',
      );
    }

    return response.arrayBuffer();
  }

  async #__request<T>({ endpoint, params }: RequestOptions): Promise<T> {
    const url = new URL(`${this.url}${endpoint}`);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        url.searchParams.append(key, String(value));
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
      method: 'GET',
      signal: this.signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...this.headers,
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new RegistryError(responseData.error, responseData.code);
    }

    return responseData as T;
  }
}
