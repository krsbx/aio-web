import {
  type Column,
  Database,
  type QueryBuilder,
  type Table,
} from '@ignisia/sql';
import type { DatabaseOptions } from '@ignisia/sql/dist/database/types';
import { Dialect } from '@ignisia/sql/dist/table/constants';
import type { SecureDbContract, TrackChangesParams } from '../contract';
import type { DatabaseMeta } from '../types';
import { setupSecureDb, trackChanges } from '../utilities';
import type { DefineSecureDbOptions, SecureDbOptions } from './types';

export class SecureSqlDb<
  DbDialect extends typeof Dialect.SQLITE,
  Tables extends Record<string, Table<string, Record<string, Column>>>,
> extends Database<DbDialect, Tables> {
  protected decryptedFilePath: string;
  protected encryptedFilePath: string;
  protected password: string;
  protected salt: string | null;
  protected isProtected: boolean;
  public readonly metaPath: string;
  public readonly meta: DatabaseMeta;

  protected trackChanges: SecureDbContract['trackChanges'];

  protected constructor(options: SecureDbOptions<DbDialect, Tables>) {
    super(options);

    this.password = options.password;
    this.decryptedFilePath = options.decryptedFilePath;
    this.encryptedFilePath = options.encryptedFilePath;
    this.metaPath = options.metaPath;
    this.meta = options.meta;
    this.salt = options.salt ?? null;
    this.isProtected = !!options.password;

    this.trackChanges = trackChanges.bind(
      this as unknown as TrackChangesParams
    );
  }

  public table<
    TableName extends keyof Tables & string,
    Table extends Tables[TableName],
  >(tableName: TableName) {
    const query = super.table(tableName);
    const exec = query.exec;

    query.exec = async () => {
      const result = exec.call(query);

      if (this.isProtected) {
        await this.trackChanges();
      }

      return result;
    };

    return query as unknown as QueryBuilder<TableName, Table>;
  }

  public static define<
    DbDialect extends typeof Dialect.SQLITE,
    Tables extends Record<string, Table<string, Record<string, Column>>>,
  >(
    options: DatabaseOptions<DbDialect, Tables>
  ): SecureSqlDb<DbDialect, Tables>;
  public static define<
    DbDialect extends typeof Dialect.SQLITE,
    Tables extends Record<string, Table<string, Record<string, Column>>>,
  >(
    options: DefineSecureDbOptions<DbDialect, Tables>
  ): Promise<SecureSqlDb<DbDialect, Tables>>;
  public static define<
    DbDialect extends typeof Dialect.SQLITE,
    Tables extends Record<string, Table<string, Record<string, Column>>>,
  >(
    options:
      | DatabaseOptions<DbDialect, Tables>
      | DefineSecureDbOptions<DbDialect, Tables>
  ) {
    if (options.dialect !== Dialect.SQLITE) {
      throw new Error('Only SQLite is supported');
    }

    const config = options.config;
    const encryptedFilePath = config.filename + '.enc';
    const decryptedFilePath = config.filename;
    const metaPath = config.filename + '.meta.json';

    if ('password' in options) {
      return setupSecureDb({
        encryptedFilePath,
        decryptedFilePath,
        metaPath,
        ...options,
      }).then(
        async (config) =>
          new SecureSqlDb({
            ...config,
            ...options,
          })
      );
    }

    return new SecureSqlDb({
      decryptedFilePath,
      encryptedFilePath,
      metaPath: '',
      password: '',
      salt: '',
      meta: {} as DatabaseMeta,
      ...options,
    });
  }
}
