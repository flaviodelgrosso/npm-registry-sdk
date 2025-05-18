import { endpoints } from './endpoints.ts';
import { RegistryError } from './error.ts';
import { buildSearchQueryWithQualifiers } from './qualifiers.ts';
import type {
  DistTags,
  DownloadPeriod,
  PackageInfo,
  PackageMetadata,
  RegistryDownloads,
  RegistryKeys,
  RegistryMetadata,
  SearchOptions,
  SearchResults,
} from './types/index.ts';
import { type RequestInitOptions, request } from './utils/request.ts';

interface NpmRegistryOptions extends RequestInitOptions {
  /**
   * The base URL of the NPM Registry.
   * @default 'https://registry.npmjs.org'
   */
  registry?: string;

  /**
   * The base URL of the NPM Registry API.
   * @default 'https://api.npmjs.org'
   */
  api?: string;
}

const DEFAULT_REGISTRY_URL = 'https://registry.npmjs.org';
const DEFAULT_REGISTRY_API_URL = 'https://api.npmjs.org';

export default class NpmRegistry {
  private registry: string;
  private api: string;
  private request: RequestInitOptions;

  constructor({ api, registry, ...request }: NpmRegistryOptions = {}) {
    this.registry = registry || DEFAULT_REGISTRY_URL;
    this.api = api || DEFAULT_REGISTRY_API_URL;
    this.request = request;
  }

  /**
   * Get the registry metadata
   * @returns The registry metadata
   * @see https://github.com/npm/registry/blob/main/docs/REGISTRY-API.md#get
   */
  public getRegistryMetadata(): Promise<RegistryMetadata> {
    return request<RegistryMetadata>(this.registry, {
      endpoint: endpoints.getRegistryMetadata(),
      ...this.request,
    });
  }

  /**
   * Get the public signing keys used by the registry.
   * @returns The registry keys
   * @see https://docs.npmjs.com/about-registry-signatures
   */
  public async getRegistryKeys(): Promise<RegistryKeys> {
    return request<RegistryKeys>(this.registry, {
      endpoint: endpoints.getRegistryKeys(),
      ...this.request,
    });
  }

  /**
   * Get the download statistics for the registry
   * @param period The download period (e.g., 'last-day', 'last-week', 'last-month', 'last-year', 'yyyy-mm-dd:yyyy-mm-dd')
   * @param packageName The package name (optional)
   * @returns The download statistics
   * @see https://github.com/npm/registry/blob/master/docs/download-counts.md#point-values
   */
  public async getRegistryDownloads(
    period: DownloadPeriod,
    packageName?: string,
  ): Promise<RegistryDownloads> {
    return request<RegistryDownloads>(this.api, {
      endpoint: endpoints.getRegistryDownloads(period, packageName),
      ...this.request,
    });
  }

  /**
   * Get package information from the registry
   * @param packageName The package name
   * @returns The package information
   * @see https://github.com/npm/registry/blob/main/docs/REGISTRY-API.md#getpackage
   */
  public async getPackage(packageName: string): Promise<PackageInfo> {
    return request<PackageInfo>(this.registry, {
      endpoint: endpoints.getPackage(packageName),
      ...this.request,
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
    return request<PackageMetadata>(this.registry, {
      endpoint: endpoints.getPackageVersion(packageName, version),
      ...this.request,
    });
  }

  /**
   * Get the latest version of a package
   * @param packageName The package name
   * @returns The latest version metadata
   */
  public async getLatestVersion(packageName: string): Promise<PackageMetadata> {
    return request<PackageMetadata>(this.registry, {
      endpoint: endpoints.getLatestVersion(packageName),
      ...this.request,
    });
  }

  /**
   * Search for packages in the registry
   * @param query The search query
   * @param options The search options
   * @returns The search results
   * @see https://github.com/npm/registry/blob/main/docs/REGISTRY-API.md#get-v1search
   */
  public async search(query: string, options?: SearchOptions): Promise<SearchResults> {
    const { qualifiers, ...searchOptions } = options || {};
    const queryWithQualifiers = qualifiers
      ? buildSearchQueryWithQualifiers(query, qualifiers)
      : query;

    return request<SearchResults>(this.registry, {
      endpoint: endpoints.search(),
      params: {
        text: queryWithQualifiers,
        ...searchOptions,
      },
      ...this.request,
    });
  }

  /**
   * Get the dist-tags for a package
   * @param packageName The package name
   * @returns The dist-tags
   */
  public async getDistTags(packageName: string): Promise<DistTags> {
    return request<DistTags>(this.registry, {
      endpoint: endpoints.getDistTags(packageName),
      ...this.request,
    });
  }

  /**
   * Download a package tarball
   * @param packageName The package name
   * @param version The package version
   * @returns The tarball as an ArrayBuffer
   */
  public async downloadTarball(packageName: string, version: string): Promise<ArrayBuffer> {
    const tarballUrl = this.registry + endpoints.downloadTarball(packageName, version);

    const response = await fetch(tarballUrl, {
      ...this.request,
    });

    if (!response.ok) {
      throw new RegistryError(
        `Failed to download tarball: ${response.statusText}`,
        'DOWNLOAD_ERROR',
      );
    }

    return response.arrayBuffer();
  }
}
