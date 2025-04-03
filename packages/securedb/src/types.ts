export interface DatabaseMeta {
  lastEncryptedAt: null | string | Date;
  lastDecryptedAt: string | Date;
  totalChanges: number;
}

export interface SetupSecureDbOptions {
  decryptedFilePath: string;
  encryptedFilePath: string;
  metaPath: string;
  password: string;
  salt?: string | null;
}
