import type { DatabaseOptions } from '@ignisia/sql/dist/database/types';
import type { Column, Database, Table } from '@ignisia/sql';
import type { Dialect } from '@ignisia/sql/dist/table/constants';
import type { DatabaseMeta } from '../types';

export interface SecureDbOptions<
  Db extends Database<
    typeof Dialect.SQLITE,
    Record<string, Table<string, Record<string, Column>>>
  >,
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
  DbDialect extends typeof Dialect.SQLITE,
  Tables extends Record<string, Table<string, Record<string, Column>>>,
> extends DatabaseOptions<DbDialect, Tables> {
  password: string;
  salt?: string | null;
}
