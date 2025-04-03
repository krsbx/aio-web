import type { DatabaseMeta } from '../types';

export interface EncryptDbParams {
  decryptedFilePath: string;
  encryptedFilePath: string;
  salt: string | null;
  password: string;
}

export interface DecryptDbParams {
  decryptedFilePath: string;
  encryptedFilePath: string;
  salt: string | null;
  password: string;
}

export interface TrackChangesParams {
  encrypt: SecureDbContract['encrypt'];
  meta: DatabaseMeta;
  metaPath: string;
}

export interface SecureDbContract {
  encrypt(): Promise<void>;
  decrypt(): Promise<void>;
  trackChanges(): Promise<void>;
}
