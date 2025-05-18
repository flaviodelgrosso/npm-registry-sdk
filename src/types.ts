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
};

export type SearchResults = {
  objects: Objects;
  total: number;
  time: string;
};

type Objects = Array<{
  downloads: Downloads;
  dependents: number;
  updated: string;
  package: PackageMetadata;
  score: Score;
  searchScore: number;
  flags: Flags;
}>;

type Downloads = {
  monthly: number;
  weekly: number;
};

type Score = {
  final: number;
  detail: Detail;
};

type Detail = {
  quality: number;
  popularity: number;
  maintenance: number;
};

type Flags = {
  unstable?: number;
  insecure?: number;
  deprecated?: number;
};

export type PackageMetadata = {
  /** The name of the package */
  name: string;
  /** The version of the package */
  version: string;
  /** The description of the package */
  description?: string;
  /** An array of keywords */
  keywords?: string[];
  /** The date the package was last modified */
  date: string;
  license: string;
  /** Sanitized package name */
  sanitized_name: string;
  /** Links to various package resources */
  links: {
    npm: string;
    homepage?: string;
    repository?: string;
    bugs?: string;
  };
  /** The publisher of this version */
  publisher: {
    username: string;
    email: string;
  };
  /** Package maintainers */
  maintainers: Array<{
    username: string;
    email: string;
  }>;
};

export type PackageVersions = {
  [version: string]: {
    name: string;
    version: string;
    description?: string;
    main?: string;
    scripts?: Record<string, string>;
    author?:
      | string
      | {
          name: string;
          email?: string;
          url?: string;
        };
    license?: string;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
    optionalDependencies?: Record<string, string>;
    engines?: Record<string, string>;
    repository?: {
      type: string;
      url: string;
    };
  };
};

export type PackageInfo = {
  /** The name of the package */
  _id: string;
  /** The name of the package */
  name: string;
  /** The description of the package */
  description?: string;
  /** The current version of the package */
  'dist-tags': {
    latest: string;
    [tag: string]: string;
  };
  /** All versions of the package */
  versions: PackageVersions;
  /** The maintainers of the package */
  maintainers: Array<{
    name: string;
    email: string;
  }>;
  /** Package metadata */
  time: {
    created: string;
    modified: string;
    [version: string]: string;
  };
  /** The homepage URL */
  homepage?: string;
  /** Keywords describing the package */
  keywords?: string[];
  /** Repository where the package code lives */
  repository?: {
    type: string;
    url: string;
  };
  /** The packages author */
  author?: {
    name: string;
    email?: string;
    url?: string;
  };
  /** The license of the package */
  license?: string;
  /** The README of the package */
  readme?: string;
  /** The readmeFilename of the package */
  readmeFilename?: string;
};
