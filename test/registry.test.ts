import { ok, rejects, strictEqual } from 'node:assert';
import { describe, mock, test } from 'node:test';
import { NpmRegistry } from '../src/registry.ts';

describe('Registry', () => {
  const registry = new NpmRegistry();
  const mockedFetch = mock.method(globalThis, 'fetch');

  test('should get registry metadata', async () => {
    mockedFetch.mock.mockImplementationOnce(
      async () =>
        ({
          ok: true,
          json: async () => ({
            disk_size: 123456789,
          }),
        }) as Response,
    );

    const result = await registry.getRegistryMetadata();
    ok(result.disk_size);
  });

  test('should get registry keys', async () => {
    mockedFetch.mock.mockImplementationOnce(
      async () =>
        ({
          ok: true,
          json: async () => ({
            keys: [
              {
                key: 'registry-fake-key--',
                expires: '2023-01-01T00:00:00.000Z',
              },
            ],
          }),
        }) as Response,
    );

    const result = await registry.getRegistryKeys();
    ok(result.keys.length > 0);
  });

  test('should get registry downloads', async () => {
    mockedFetch.mock.mockImplementationOnce(
      async () =>
        ({
          ok: true,
          json: async () => ({
            downloads: 123,
            start: '2023-01-01T00:00:00.000Z',
            end: '2023-01-02T00:00:00.000Z',
          }),
        }) as Response,
    );

    const result = await registry.getRegistryDownloads('last-week');
    ok(result.downloads === 123);
  });

  test('should get package downloads', async () => {
    mockedFetch.mock.mockImplementationOnce(
      async () =>
        ({
          ok: true,
          json: async () => ({
            downloads: 123,
            start: '2023-01-01T00:00:00.000Z',
            end: '2023-01-02T00:00:00.000Z',
            package: 'react',
          }),
        }) as Response,
    );

    const result = await registry.getRegistryDownloads('last-week', 'react');
    ok(result.package === 'react');
  });

  test('should get package information', async () => {
    mockedFetch.mock.mockImplementationOnce(
      async () =>
        ({
          ok: true,
          json: async () => ({
            _id: 'react',
            name: 'react',
            'dist-tags': {
              latest: '18.2.0',
            },
            versions: {
              '18.2.0': {
                name: 'react',
                version: '18.2.0',
                description: 'React is a JavaScript library for building user interfaces.',
              },
            },
          }),
        }) as Response,
    );

    const result = await registry.getPackage('react');
    strictEqual(result._id, 'react');
    strictEqual(result.name, 'react');
    ok(result.versions['18.2.0']);
  });

  test('should get package version', async () => {
    mockedFetch.mock.mockImplementationOnce(
      async () =>
        ({
          ok: true,
          json: async () => ({
            name: 'react',
            version: '18.2.0',
            description: 'React is a JavaScript library for building user interfaces.',
            keywords: ['react'],
          }),
        }) as Response,
    );

    const result = await registry.getPackageVersion('react', '18.2.0');
    strictEqual(result.name, 'react');
    strictEqual(result.version, '18.2.0');
  });

  test('should get latest version', async () => {
    mockedFetch.mock.mockImplementationOnce(
      async () =>
        ({
          ok: true,
          json: async () => ({
            name: 'react',
            version: '18.2.0',
            description: 'React is a JavaScript library for building user interfaces.',
            keywords: ['react'],
          }),
        }) as Response,
    );

    const result = await registry.getLatestVersion('react');
    strictEqual(result.name, 'react');
    strictEqual(result.version, '18.2.0');
  });

  test('should search packages', async () => {
    mockedFetch.mock.mockImplementationOnce(
      async () =>
        ({
          ok: true,
          json: async () => ({
            objects: [
              {
                package: {
                  name: 'react',
                  version: '18.2.0',
                  description: 'React is a JavaScript library for building user interfaces.',
                },
                score: {
                  final: 0.9,
                  detail: {
                    quality: 0.9,
                    popularity: 0.9,
                    maintenance: 0.9,
                  },
                },
                searchScore: 0.9,
              },
            ],
            total: 1,
            time: new Date().toISOString(),
          }),
        }) as Response,
    );

    const result = await registry.search('react');
    ok(result.objects.length > 0);
    ok(result.objects[0].package.name.includes('react'));
  });

  test('should search packages with qualifiers', async () => {
    mockedFetch.mock.mockImplementationOnce(
      async () =>
        ({
          ok: true,
          json: async () => ({
            objects: [
              {
                package: {
                  name: 'react',
                  version: '18.2.0',
                  description: 'React is a JavaScript library for building user interfaces.',
                },
                score: {
                  final: 0.9,
                  detail: {
                    quality: 0.9,
                    popularity: 0.9,
                    maintenance: 0.9,
                  },
                },
                searchScore: 0.9,
              },
            ],
            total: 1,
            time: new Date().toISOString(),
          }),
        }) as Response,
    );

    const result = await registry.search('react', { qualifiers: { not: 'deprecated' } });
    ok(result.objects.length > 0);
    ok(result.objects[0].package.name.includes('react'));
  });

  test('should download package tarball', async () => {
    // Mock package version info
    mockedFetch.mock.mockImplementationOnce(
      async () =>
        ({
          ok: true,
          json: async () => ({
            name: 'react',
            version: '18.2.0',
          }),
        }) as Response,
    );

    // Mock tarball download
    mockedFetch.mock.mockImplementationOnce(
      async () =>
        ({
          ok: true,
          arrayBuffer: async () => new ArrayBuffer(8),
        }) as Response,
    );

    const result = await registry.downloadTarball('react', '18.2.0');
    ok(result instanceof ArrayBuffer);
  });

  test('should throw RegistryError when tarball download fails', async () => {
    const errorStatusText = 'Not Found';
    mockedFetch.mock.mockImplementationOnce(
      async () =>
        ({
          ok: false,
          statusText: errorStatusText,
        }) as Response,
    );

    await rejects(async () => registry.downloadTarball('react', '18.2.0'), {
      error: `Failed to download tarball: ${errorStatusText}`,
      code: 'DOWNLOAD_ERROR',
    });
  });

  test('should handle network errors', async () => {
    mockedFetch.mock.mockImplementationOnce(async () => {
      throw new Error('Network error');
    });

    await rejects(() => registry.getPackage('test'), /Network error/);
  });

  test('should handle API errors', async () => {
    mockedFetch.mock.mockImplementationOnce(
      async () =>
        ({
          ok: false,
          json: async () => ({
            code: 'NOT_FOUND',
            error: 'Package not found',
          }),
        }) as Response,
    );

    await rejects(() => registry.getPackage('non-existent-package'), {
      code: 'NOT_FOUND',
      error: 'Package not found',
    });
  });

  test('should get dist tags', async () => {
    mockedFetch.mock.mockImplementationOnce(
      async () =>
        ({
          ok: true,
          json: async () => ({
            latest: '18.2.0',
            next: '19.0.0',
          }),
        }) as Response,
    );

    const result = await registry.getDistTags('react');
    strictEqual(result.latest, '18.2.0');
    strictEqual(result.next, '19.0.0');
  });
});
