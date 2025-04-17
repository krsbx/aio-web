import type { AesKeyOptions } from '@ignisia/encryption/types';

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
