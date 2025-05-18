# npm-registry-sdk

[![NPM version](https://img.shields.io/npm/v/npm-registry-sdk.svg?style=flat)](https://www.npmjs.com/package/npm-registry-sdk)
[![NPM downloads](https://img.shields.io/npm/dm/npm-registry-sdk.svg?style=flat)](https://www.npmjs.com/package/npm-registry-sdk)
[![CI](https://github.com/flaviodelgrosso/npm-registry-sdk/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/flaviodelgrosso/npm-registry-sdk/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/flaviodelgrosso/npm-registry-sdk/graph/badge.svg?token=FAWWPSCT1S)](https://codecov.io/gh/flaviodelgrosso/npm-registry-sdk)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

A modern TypeScript client library for the npm registry API. This library provides a simple and type-safe way to interact with the npm registry.

## Features

- 🎯 Fully type-safe API with TypeScript
- 🔍 Package search functionality
- 📦 Package metadata retrieval
- 🔄 Version-specific information
- ⬇️ Tarball download support
- 🧪 100% test coverage
- 🚀 Zero dependencies

## Installation

```bash
npm install npm-registry-sdk
```

## Usage

### Initialize the Client

```typescript
import { NpmRegistry } from 'npm-registry-sdk';

// Use default registry URLs
const registry = new NpmRegistry();

// Or with custom options
const customRegistry = new NpmRegistry({
  // Custom registry URL (default: 'https://registry.npmjs.org')
  registry: 'https://custom-registry.example.com',
  // Additional fetch options
  headers: {
    'Authorization': 'Bearer token'
  }
});
```

### Search for Packages

```typescript
// Basic search
const results = await registry.search('react');

// Search with options
const resultsWithOptions = await registry.search('react', {
  size: 20,
  from: 0
});

// Search with qualifiers
const resultsWithQualifiers = await registry.search('react', {
  size: 20,
  qualifiers: {
    author: 'facebook',
    keywords: 'frontend,ui',
    not: 'deprecated'
  }
});

console.log(results.objects.map(obj => obj.package.name));
```

### Get Package Information

```typescript
// Get full package info
const packageInfo = await registry.getPackage('react');

// Get specific version
const versionInfo = await registry.getPackageVersion('react', '18.2.0');

// Get latest version
const latestInfo = await registry.getLatestVersion('react');
```

### Get Dist Tags

```typescript
const tags = await registry.getDistTags('react');
console.log(tags.latest); // e.g., '18.2.0'
```

### Get registry metadata

```typescript
const metadata = await registry.getMetadata();
console.log(metadata); // e.g., { db_name: '', db_count: '', ... }
```

### Get public signing keys used by the registry

```typescript
const registryKeys = await registry.getRegistryKeys();
console.log(keys); // e.g., { keys: [{ 'expires': '...', 'keyid': '...' }] }
```

### Download Statistics

```typescript
// Get download counts for a specific period
const allDownloads = await registry.getRegistryDownloads('last-week');
console.log(allDownloads.downloads); // Total downloads for all packages

// Get download counts for a specific package
const packageDownloads = await registry.getRegistryDownloads('last-month', 'react');
console.log(packageDownloads.downloads); // Downloads for react package

// Available periods: 'last-day', 'last-week', 'last-month', 'last-year'
// You can also specify a custom date range: 'yyyy-mm-dd:yyyy-mm-dd'
const customPeriod = await registry.getRegistryDownloads('2023-01-01:2023-12-31', 'react');
```

### Download Package Tarballs

```typescript
// Download a specific version of a package as ArrayBuffer
const tarball = await registry.downloadTarball('react', '18.2.0');
// You can then save this to a file or process it as needed
```

## API Reference

### Class: NpmRegistry

Creates a new instance of the npm registry client.

```typescript
constructor(options?: NpmRegistryOptions)
```

Options:

- `registry?: string` - The base URL of the NPM Registry (default: `https://registry.npmjs.org`)
- `api?: string` - The base URL of the NPM Registry API (default: `https://api.npmjs.org`)
- Additional options are passed to the underlying `fetch` calls as `RequestInit`

### API Methods

#### getPackage

Get full package information including all versions.

```typescript
getPackage(packageName: string): Promise<PackageInfo>
```

#### getPackageVersion

Get metadata for a specific version of a package.

```typescript
getPackageVersion(packageName: string, version: string): Promise<PackageMetadata>
```

#### getLatestVersion

Get metadata for the latest version of a package.

```typescript
getLatestVersion(packageName: string): Promise<PackageMetadata>
```

#### getDistTags

Get the dist-tags (like 'latest', 'beta', etc.) for a package.

```typescript
getDistTags(packageName: string): Promise<DistTags>
```

#### search

Search for packages in the registry.

```typescript
search(query: string, options?: SearchOptions): Promise<SearchResults>
```

Options:

- `size?: number` - Number of results per page
- `from?: number` - Starting position
- `quality?: number` - Quality score
- `popularity?: number` - Popularity score
- `maintenance?: number` - Maintenance score
- `qualifiers?: SearchQueryQualifiers` - Additional search qualifiers (author, keywords, etc.)

#### getRegistryDownloads

Get download statistics for the entire registry or a specific package.

```typescript
getRegistryDownloads(period: DownloadPeriod, packageName?: string): Promise<RegistryDownloads>
```

Periods:

- Predefined: 'last-day', 'last-week', 'last-month', 'last-year'
- Custom range: 'yyyy-mm-dd:yyyy-mm-dd'

#### getRegistryMetadata

Get metadata about the registry.

```typescript
getRegistryMetadata(): Promise<RegistryMetadata>
```

#### getRegistryKeys

Get the public signing keys used by the registry.

```typescript
getRegistryKeys(): Promise<RegistryKeys>
```

#### downloadTarball

Download a specific version of a package as an ArrayBuffer.

```typescript
downloadTarball(packageName: string, version: string): Promise<ArrayBuffer>
```

## TypeScript Support

This library is written in TypeScript and includes comprehensive type definitions for all APIs. You'll get full IntelliSense support and type checking out of the box.

## Contributing

Contributions are welcome! Please see our [Contributing Guide](CONTRIBUTING.md) for more details.

## License

[ISC](LICENSE)
