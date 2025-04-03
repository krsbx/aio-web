import type { Documents, Field } from '@ignisia/nosql/dist/documents';
import type { DatabaseOptions } from '@ignisia/nosql/dist/documents/database/types';
import type { DatabaseMeta } from '../types';

export interface SecureDbOptions<
  Docs extends Record<string, Documents<string, Record<string, Field>>>,
> extends DatabaseOptions<Docs> {
  decryptedFilePath: string;
  encryptedFilePath: string;
  metaPath: string;
  password: string;
  meta: DatabaseMeta;
  salt?: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface DefineSecureDbOptions<
  Docs extends Record<string, Documents<string, Record<string, Field>>>,
> extends Omit<
    SecureDbOptions<Docs>,
    'decryptedFilePath' | 'encryptedFilePath' | 'metaPath' | 'meta'
  > {}
