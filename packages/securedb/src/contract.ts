import type { DatabaseMeta } from './types';

export interface TrackChangesParams {
  decryptedFilePath: string;
  encryptedFilePath: string;
  salt: string | null;
  password: string;
  meta: DatabaseMeta;
  metaPath: string;
}

export interface SecureDbContract {
  trackChanges(): Promise<void>;
}
