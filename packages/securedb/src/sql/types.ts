import type { DatabaseOptions } from '@ignisia/sql/dist/database/types';
import type { Column, Table } from '@ignisia/sql';
import type { Dialect } from '@ignisia/sql/dist/table/constants';
import type { DatabaseMeta, SetupSecureDbOptions } from '../types';

export interface SecureDbOptions<
  DbDialect extends typeof Dialect.SQLITE,
  Tables extends Record<string, Table<string, Record<string, Column>>>,
> extends DatabaseOptions<DbDialect, Tables>,
    SetupSecureDbOptions {
  meta: DatabaseMeta;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface DefineSecureDbOptions<
  DbDialect extends typeof Dialect.SQLITE,
  Tables extends Record<string, Table<string, Record<string, Column>>>,
> extends Omit<
    SecureDbOptions<DbDialect, Tables>,
    'decryptedFilePath' | 'encryptedFilePath' | 'metaPath' | 'meta'
  > {}
