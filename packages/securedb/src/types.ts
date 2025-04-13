import type { AesKeyOptions } from '@ignisia/encryption/dist/types';

export interface DatabaseMeta {
  lastEncryptedAt: null | string | Date;
  lastDecryptedAt: string | Date;
  totalChanges: number;
}

export interface SetupSecureDbOptions extends AesKeyOptions {
  decryptedFilePath: string;
  encryptedFilePath: string;
  metaPath: string;
}
