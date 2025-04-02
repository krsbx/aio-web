import { decryptFile } from '@ignisia/encryption';
import {
  Database,
  type Documents,
  type Field,
} from '@ignisia/nosql/dist/documents';
import type { DatabaseMeta } from '../types';
import { isFileExists, readMeta, writeMeta } from '../utilities';
import type { DefineSecureDbOptions, SecureDbOptions } from './types';

export class SecureNoSqlDb<
  Docs extends Record<string, Documents<string, Record<string, Field>>>,
> {
  public db: Database<Docs>;
  private decryptedFilePath: string;
  private encryptedFilePath: string;
  public metaPath: string;
  public meta: DatabaseMeta;
  public password: string;
  public salt: string | null;

  protected constructor(options: SecureDbOptions<Database<Docs>>) {
    this.db = options.db;
    this.password = options.password;
    this.decryptedFilePath = options.decryptedFilePath;
    this.encryptedFilePath = options.encryptedFilePath;
    this.metaPath = options.metaPath;
    this.meta = options.meta;
    this.salt = options.salt ?? null;
  }

  public static async define<
    Docs extends Record<string, Documents<string, Record<string, Field>>>,
  >(options: DefineSecureDbOptions<Docs>) {
    const password = options.password;
    const encryptedFilePath = options.filename + '.enc';
    const decryptedFilePath = options.filename;
    const metaPath = options.filename + '.meta.json';
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
      docs: options.docs,
      filename: options.filename,
    });

    return new SecureNoSqlDb({
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
