export const api = {
  getPackage: (packageName: string) => `/${encodeURIComponent(packageName)}`,

  getPackageVersion: (packageName: string, version: string) =>
    `/${encodeURIComponent(packageName)}/${encodeURIComponent(version)}`,

  getLatestVersion: (packageName: string) => `/${encodeURIComponent(packageName)}/latest`,

  search: () => '/-/v1/search',

  downloadTarball: (packageName: string, version: string) =>
    `/${encodeURIComponent(packageName)}/-/${encodeURIComponent(packageName)}-${encodeURIComponent(version)}.tgz`,
} as const;
