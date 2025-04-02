import { Database, type Column, type Table } from '@ignisia/sql';
import { Dialect } from '@ignisia/sql/dist/table/constants';
import type { DefineSecureDbOptions, SecureDbOptions } from './types';
import { isFileExists, readMeta, writeMeta } from '../utilities';
import { decryptFile } from '@ignisia/encryption';
import type { DatabaseMeta } from '../types';

export class SecureSqlDb<
  DbDialect extends typeof Dialect.SQLITE,
  Tables extends Record<string, Table<string, Record<string, Column>>>,
> {
  public db: Database<DbDialect, Tables>;
  private decryptedFilePath: string;
  private encryptedFilePath: string;
  public metaPath: string;
  public meta: DatabaseMeta;
  public password: string;
  public salt: string | null;

  protected constructor(options: SecureDbOptions<Database<DbDialect, Tables>>) {
    if (options.db.dialect !== Dialect.SQLITE) {
      throw new Error('Only SQLite is supported');
    }

    this.db = options.db;
    this.password = options.password;
    this.decryptedFilePath = options.decryptedFilePath;
    this.encryptedFilePath = options.encryptedFilePath;
    this.metaPath = options.metaPath;
    this.meta = options.meta;
    this.salt = options.salt ?? null;
  }

  public static async define<
    DbDialect extends typeof Dialect.SQLITE,
    Tables extends Record<string, Table<string, Record<string, Column>>>,
  >(options: DefineSecureDbOptions<DbDialect, Tables>) {
    if (options.dialect !== Dialect.SQLITE) {
      throw new Error('Only SQLite is supported');
    }

    const config = options.config;
    const password = options.password;
    const encryptedFilePath = config.filename + '.enc';
    const decryptedFilePath = config.filename;
    const metaPath = config.filename + '.meta.json';
    const { isExists: isMetaExists, meta } = await readMeta(metaPath);

    if (
      !(await isFileExists(decryptedFilePath)) &&
      (await isFileExists(encryptedFilePath))
    ) {
      await decryptFile({
        input: encryptedFilePath,
        output: decryptedFilePath,
        salt: options.salt,
        password,
      });
    }

    if (!isMetaExists) {
      await writeMeta(metaPath, meta);
    }

    const db = Database.define({
      dialect: options.dialect,
      tables: options.tables,
      config,
    });

    return new SecureSqlDb({
      decryptedFilePath,
      encryptedFilePath,
      metaPath,
      password,
      meta: meta,
      salt: options.salt,
      db,
    });
  }
}
