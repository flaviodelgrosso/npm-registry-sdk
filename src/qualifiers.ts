const SearchQueryQualifiers = [
  /** Show/filter results in which bcoe is the author */
  'author',
  /** Show/filter results in which bcoe is qualifier as a maintainer */
  'maintainer',
  /** Show/filter results published under the @foo scope */
  'scope',
  /** Show/filter results that have batman in the keywords
   * separating multiple keywords with
   * , acts like a logical OR
   * + acts like a logical AND
   * ,- can be used to exclude keywords
   */
  'keywords',
  /** Exclude packages based on condition (unstable, insecure, deprecated) */
  'not',
  /** Include packages based on condition (unstable, insecure, deprecated) */
  'is',
  /** Do not boost exact matches, defaults to true */
  'boost-exact',
] as const;

type SearchQueryQualifier = (typeof SearchQueryQualifiers)[number];

export type SearchQueryQualifiers = Partial<Record<SearchQueryQualifier, string>>;
/**
 *
 * @param query
 * @param qualifiers
 * @description Return query string with qualifiers
 * @example buildSearchQueryWithQualifiers('react', { 'not': 'deprecated,insecure' });
 */
export function buildSearchQueryWithQualifiers(
  query: string,
  qualifiers: SearchQueryQualifiers,
): string {
  const queryWithQualifiers = Object.entries(qualifiers).reduce((acc, [key, value]) => {
    if (SearchQueryQualifiers.includes(key as SearchQueryQualifier)) {
      return `${acc}+${key}:${value}`;
    }
    return acc;
  }, query);

  return queryWithQualifiers.trim();
}
