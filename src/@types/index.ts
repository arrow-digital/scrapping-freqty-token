export enum ENUMDatabaseType {
  'production',
  'test'
}

export type DatabaseType = keyof typeof ENUMDatabaseType;

export enum ENUMUpdateForName {
  'Linkio',
  'KIS',
}

export type UpdateForName = keyof typeof ENUMUpdateForName;

// freqty credentials
export type Credentials = {
  email: string;
  password: string;
  name: UpdateForName;
};

// freqty token type
export type FreqtyTokenType = {
  token: string;
  name: string;
};
