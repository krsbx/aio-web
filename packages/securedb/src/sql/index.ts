import { type Column, Database, QueryBuilder, type Table } from '@ignisia/sql';
import { Dialect } from '@ignisia/sql/dist/table/constants';
import type { DefineSecureDbOptions, SecureDbOptions } from './types';
import type { DatabaseMeta } from '../types';
import { isFileExists, readMeta, writeMeta } from '../utilities';
import { decryptFile, encryptFile } from '@ignisia/encryption';
import type { DatabaseOptions } from '@ignisia/sql/dist/database/types';

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

  protected constructor(options: SecureDbOptions<DbDialect, Tables>) {
    super(options);

    this.password = options.password;
    this.decryptedFilePath = options.decryptedFilePath;
    this.encryptedFilePath = options.encryptedFilePath;
    this.metaPath = options.metaPath;
    this.meta = options.meta;
    this.salt = options.salt ?? null;
    this.isProtected = !!options.password;
  }

  protected async trackChange() {
    this.meta.totalChanges++;

    if (this.meta.totalChanges % 5 === 0) {
      await encryptFile({
        input: this.decryptedFilePath,
        output: this.encryptedFilePath,
        salt: this.salt,
        password: this.password,
      });

      this.meta.lastEncryptedAt = new Date();
      this.meta.totalChanges = 0;
    }

    await writeMeta(this.metaPath, this.meta);
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
        await this.trackChange();
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
      return readMeta(metaPath).then(
        async ({ isExists: isMetaExists, meta }) => {
          if (
            !(await isFileExists(decryptedFilePath)) &&
            (await isFileExists(encryptedFilePath))
          ) {
            await decryptFile({
              input: encryptedFilePath,
              output: decryptedFilePath,
              ...options,
            });
          }

          if (!isMetaExists) {
            await writeMeta(metaPath, meta);
          }

          return new SecureSqlDb({
            decryptedFilePath,
            encryptedFilePath,
            metaPath,
            meta: meta,
            ...options,
          });
        }
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
