import { strictEqual } from 'node:assert';
import { describe, test } from 'node:test';

import { buildSearchQueryWithQualifiers } from '../src/qualifiers.ts';

describe('buildSearchQueryWithQualifiers', () => {
  test('should build search query with qualifiers', () => {
    const query = 'react';
    const expectedQuery = 'react+not:deprecated,insecure+scope:@types';
    const result = buildSearchQueryWithQualifiers(query, {
      not: 'deprecated,insecure',
      scope: '@types',
    });
    strictEqual(result, expectedQuery);
  });

  test('should build search query with empty qualifiers', () => {
    const query = 'react';
    const result = buildSearchQueryWithQualifiers(query, {});
    strictEqual(result, query);
  });

  test('should ignore invalid qualifiers', () => {
    const query = 'cross-spawn';
    const result = buildSearchQueryWithQualifiers(query, {
      // @ts-expect-error: TypeScript will complains but we want to test invalid qualifiers
      invalid: 'value',
      scope: '@types',
    });
    strictEqual(result, 'cross-spawn+scope:@types');
  });
});
