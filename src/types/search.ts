import type { SearchQueryQualifiers } from '../qualifiers.ts';
import type { Objects } from './package.ts';

export type SearchOptions = {
  /** How many results to return (default 20, max 250) */
  size?: number;
  /** Offset to return results from */
  from?: number;
  /** How much of an effect should quality have on search results */
  quality?: number;
  /** How much of an effect should popularity have on search results */
  popularity?: number;
  /** How much of an effect should maintenance have on search results */
  maintenance?: number;
  /** Qualifiers to append to the query */
  qualifiers?: SearchQueryQualifiers;
};

export type SearchResults = {
  objects: Objects;
  total: number;
  time: string;
};
