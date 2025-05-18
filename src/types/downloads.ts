export type RegistryDownloads = {
  /** The number of downloads for the specified period. */
  downloads: number;
  /** The date range for the downloads. */
  start: string;
  /** The date range for the downloads. */
  end: string;
  /** The package name, if specified. */
  package?: string;
};

export type DownloadPeriod =
  /** Gets downloads for the last available day. In practice, this will usually be "yesterday" (in GMT) but if stats for that day have not yet landed, it will be the day before. */
  | 'last-day'
  /** Gets downloads for the last 7 available days. */
  | 'last-week'
  /** Gets downloads for the last 30 available days. */
  | 'last-month'
  /** Gets downloads for the last 365 available days. */
  | 'last-year'
  /** Date in the format `YYYY-MM-DD`. */
  | `${number}-${number}-${number}`
  /** Inclusive date range in the format `YYYY-MM-DD:YYYY-MM-DD`. */
  | `${number}-${number}-${number}:${number}-${number}-${number}`;
