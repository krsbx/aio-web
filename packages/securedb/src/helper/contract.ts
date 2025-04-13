import type { DatabaseMeta, SetupSecureDbOptions } from '../types';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface EncryptDbParams
  extends Omit<SetupSecureDbOptions, 'metaPath'> {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface DecryptDbParams
  extends Omit<SetupSecureDbOptions, 'metaPath'> {}

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
