import { ok, strictEqual } from 'node:assert';
import { describe, test } from 'node:test';
import NpmRegistry from '../../src/registry.ts';

describe('NPM Registry (integration)', () => {
  const registry = new NpmRegistry();

  describe('getRegistryMetadata', () => {
    test('should get registry metadata', async () => {
      const result = await registry.getRegistryMetadata();
      ok(result);
    });
  });

  describe('getRegistryKeys', () => {
    test('should get registry keys', async () => {
      const result = await registry.getRegistryKeys();
      ok(result.keys);
    });
  });

  describe('getRegistryDownloads', () => {
    test('should get registry downloads', async () => {
      const result = await registry.getRegistryDownloads('last-week');
      ok(result.downloads);
      ok(result.end);
      ok(result.start);
    });

    test('should get package downloads', async () => {
      const result = await registry.getRegistryDownloads('last-week', '@slack/client');
      ok(result.downloads);
      ok(result.end);
      ok(result.start);
      ok(result.package);
    });
  });

  describe('getPackage', () => {
    test('should get package information', async () => {
      const result = await registry.getPackage('react');
      strictEqual(result._id, 'react');
      strictEqual(result.name, 'react');
      ok(result.versions);
    });
  });

  describe('getPackageVersion', () => {
    test('should get package version information', async () => {
      const result = await registry.getPackageVersion('react', '18.2.0');
      strictEqual(result.name, 'react');
      strictEqual(result.version, '18.2.0');
    });
  });

  describe('getLatestVersion', () => {
    test('should get latest version information', async () => {
      const result = await registry.getLatestVersion('react');
      strictEqual(result.name, 'react');
      ok(result.version);
    });
  });

  describe('search', () => {
    test('should search for packages', async () => {
      const result = await registry.search('react', { size: 3 });
      ok(result.objects.length === 3);
      ok(result.objects[0].package.name.includes('react'));
    });
  });

  describe('getDistTags', () => {
    test('should get distribution tags', async () => {
      const result = await registry.getDistTags('react');
      ok(result.latest);
      ok(result.next);
    });
  });
});
