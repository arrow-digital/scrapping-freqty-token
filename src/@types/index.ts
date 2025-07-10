export enum ENUMDatabaseType {
  'production',
  'test'
}

export type DatabaseType = keyof typeof ENUMDatabaseType;

export enum ENUMUpdateForType {
  'LinkIO',
  'KIS',
}

export type UpdateForType = keyof typeof ENUMUpdateForType;

// freqty credentials
export type Credentials = {
  email: string;
  password: string;
};

// freqty token type
export type FreqtyTokenType = {
  token: string;
  name: string;
};
