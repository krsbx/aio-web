import type { Document, Field } from '@ignisia/nosql/dist/documents';
import type { DatabaseOptions } from '@ignisia/nosql/dist/documents/database/types';
import type { DatabaseMeta, SetupSecureDbOptions } from '../types';

export interface SecureDbOptions<
  Docs extends Record<string, Document<string, Record<string, Field>>>,
> extends DatabaseOptions<Docs>,
    SetupSecureDbOptions {
  meta: DatabaseMeta;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface DefineSecureDbOptions<
  Docs extends Record<string, Document<string, Record<string, Field>>>,
> extends Omit<
    SecureDbOptions<Docs>,
    'decryptedFilePath' | 'encryptedFilePath' | 'metaPath' | 'meta'
  > {}
