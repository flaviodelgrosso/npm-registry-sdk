import type { DownloadPeriod } from './types/downloads.ts';

export const endpoints = {
  getRegistryMetadata: () => '/',

  getRegistryKeys: () => '/-/npm/v1/keys',

  getRegistryDownloads: (period: DownloadPeriod, packageName?: string) =>
    `/downloads/point/${encodeURIComponent(period)}${packageName ? `/${encodeURIComponent(packageName)}` : ''}`,

  getPackage: (packageName: string) => `/${encodeURIComponent(packageName)}`,

  getPackageVersion: (packageName: string, version: string) =>
    `/${encodeURIComponent(packageName)}/${encodeURIComponent(version)}`,

  getLatestVersion: (packageName: string) => `/${encodeURIComponent(packageName)}/latest`,

  search: () => '/-/v1/search',

  getDistTags: (packageName: string) => `/-/package/${encodeURIComponent(packageName)}/dist-tags`,

  downloadTarball: (packageName: string, version: string) =>
    `/${encodeURIComponent(packageName)}/-/${encodeURIComponent(packageName)}-${encodeURIComponent(version)}.tgz`,
} as const;
