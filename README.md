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

// Use default registry (https://registry.npmjs.org)
const registry = new NpmRegistry();

// Or with custom options
const customRegistry = new NpmRegistry({
  url: 'https://custom-registry.example.com',
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

### Download Package Tarball

```typescript
const tarball = await registry.downloadTarball('react', '18.2.0');
```

## API Reference

### `NpmRegistry`

#### Constructor Options

```typescript
interface RegistryOptions {
  url?: string;         // Custom registry URL
  signal?: AbortSignal; // AbortController signal
  headers?: HeadersInit; // Custom headers
}
```

#### Methods

- `getPackage(packageName: string): Promise<PackageInfo>`
- `getPackageVersion(packageName: string, version: string): Promise<PackageMetadata>`
- `getLatestVersion(packageName: string): Promise<PackageMetadata>`
- `search(query: string, options?: SearchOptions & { qualifiers?: SearchQueryQualifiers }): Promise<SearchResults>`
- `downloadTarball(packageName: string, version: string): Promise<ArrayBuffer>`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.
