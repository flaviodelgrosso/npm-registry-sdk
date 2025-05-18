import { api } from './api.ts';
import { RegistryError } from './error.ts';
import { type SearchQueryQualifiers, buildSearchQueryWithQualifiers } from './qualifiers.ts';
import type {
  DistTags,
  PackageInfo,
  PackageMetadata,
  RegistryKeys,
  RegistryMetadata,
  SearchOptions,
  SearchResults,
} from './types/index.ts';

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
   * Get the registry metadata
   * @returns The registry metadata
   * @see https://github.com/npm/registry/blob/main/docs/REGISTRY-API.md#get
   */
  public getRegistryMetadata(): Promise<RegistryMetadata> {
    return this.#request<RegistryMetadata>({
      endpoint: api.getRegistryMetadata(),
    });
  }

  /**
   * Get the public signing keys used by the registry.
   * @returns The registry keys
   * @see https://docs.npmjs.com/about-registry-signatures
   */
  public async getRegistryKeys(): Promise<RegistryKeys> {
    return this.#request<RegistryKeys>({
      endpoint: api.getRegistryKeys(),
    });
  }

  /**
   * Get package information from the registry
   * @param packageName The package name
   * @returns The package information
   * @see https://github.com/npm/registry/blob/main/docs/REGISTRY-API.md#getpackage
   */
  public async getPackage(packageName: string): Promise<PackageInfo> {
    return this.#request<PackageInfo>({
      endpoint: api.getPackage(packageName),
    });
  }

  /**
   * Get package metadata for a specific version
   * @param packageName The package name
   * @param version The package version
   * @returns Package metadata
   * @see https://github.com/npm/registry/blob/main/docs/REGISTRY-API.md#getpackageversion
   */
  public async getPackageVersion(packageName: string, version: string): Promise<PackageMetadata> {
    return this.#request<PackageMetadata>({
      endpoint: api.getPackageVersion(packageName, version),
    });
  }

  /**
   * Get the latest version of a package
   * @param packageName The package name
   * @returns The latest version metadata
   */
  public async getLatestVersion(packageName: string): Promise<PackageMetadata> {
    return this.#request<PackageMetadata>({
      endpoint: api.getLatestVersion(packageName),
    });
  }

  /**
   * Search for packages in the registry
   * @param query The search query
   * @param options The search options
   * @returns The search results
   * @see https://github.com/npm/registry/blob/main/docs/REGISTRY-API.md#get-v1search
   */
  public async search(
    query: string,
    options?: SearchOptions & { qualifiers?: SearchQueryQualifiers },
  ): Promise<SearchResults> {
    const { qualifiers, ...searchOptions } = options || {};
    const queryWithQualifiers = qualifiers
      ? buildSearchQueryWithQualifiers(query, qualifiers)
      : query;

    return this.#request<SearchResults>({
      endpoint: api.search(),
      params: {
        text: queryWithQualifiers,
        ...searchOptions,
      },
    });
  }

  /**
   * Get the dist-tags for a package
   * @param packageName The package name
   * @returns The dist-tags
   */
  public async getDistTags(packageName: string): Promise<DistTags> {
    return this.#request<DistTags>({
      endpoint: api.getDistTags(packageName),
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

  async #request<T>({ endpoint, params }: RequestOptions): Promise<T> {
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
