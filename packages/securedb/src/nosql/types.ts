import type { DatabaseOptions } from '@ignisia/nosql/dist/documents/database/types';
import type { Documents, Database, Field } from '@ignisia/nosql/dist/documents';
import type { DatabaseMeta } from '../types';

export interface SecureDbOptions<
  Db extends Database<Record<string, Documents<string, Record<string, Field>>>>,
> {
  db: Db;
  decryptedFilePath: string;
  encryptedFilePath: string;
  metaPath: string;
  password: string;
  meta: DatabaseMeta;
  salt?: string | null;
}

export interface DefineSecureDbOptions<
  Docs extends Record<string, Documents<string, Record<string, Field>>>,
> extends DatabaseOptions<Docs> {
  password: string;
  salt?: string | null;
}
