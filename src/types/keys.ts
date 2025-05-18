export type RegistryKeys = {
  keys: RegistryKey[];
};

type RegistryKey = {
  expires: string | null;
  keyid: string;
  keytype: string;
  scheme: string;
  key: string;
};
