import {
  Database,
  type Documents,
  type Field,
  type QueryBuilder,
} from '@ignisia/nosql/dist/documents';
import type { DatabaseOptions } from '@ignisia/nosql/dist/documents/database/types';
import type { SecureDbContract, TrackChangesParams } from '../contract';
import type { DatabaseMeta } from '../types';
import { setupSecureDb, trackChanges } from '../utilities';
import type { DefineSecureDbOptions, SecureDbOptions } from './types';

export class SecureNoSqlDb<
  Docs extends Record<string, Documents<string, Record<string, Field>>>,
> extends Database<Docs> {
  protected decryptedFilePath: string;
  protected encryptedFilePath: string;
  protected password: string;
  protected salt: string | null;
  protected isProtected: boolean;
  public readonly metaPath: string;
  public readonly meta: DatabaseMeta;

  protected trackChanges: SecureDbContract['trackChanges'];

  protected constructor(options: SecureDbOptions<Docs>) {
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

  public document<
    DocName extends keyof Docs & string,
    Doc extends Docs[DocName],
  >(docName: DocName) {
    const query = super.document(docName);
    const exec = query.exec;

    query.exec = async () => {
      const result = exec.call(query);

      if (this.isProtected) {
        await this.trackChanges();
      }

      return result;
    };

    return query as unknown as QueryBuilder<DocName, Doc>;
  }

  public static define<
    Docs extends Record<string, Documents<string, Record<string, Field>>>,
  >(options: DatabaseOptions<Docs>): SecureNoSqlDb<Docs>;
  public static define<
    Docs extends Record<string, Documents<string, Record<string, Field>>>,
  >(options: DefineSecureDbOptions<Docs>): Promise<SecureNoSqlDb<Docs>>;
  public static define<
    Docs extends Record<string, Documents<string, Record<string, Field>>>,
  >(options: DatabaseOptions<Docs> | DefineSecureDbOptions<Docs>) {
    const encryptedFilePath = options.filename + '.enc';
    const decryptedFilePath = options.filename;
    const metaPath = options.filename + '.meta.json';

    if ('password' in options) {
      return setupSecureDb({
        decryptedFilePath,
        encryptedFilePath,
        metaPath,
        ...options,
      }).then(
        async (config) =>
          new SecureNoSqlDb({
            ...config,
            ...options,
          })
      );
    }

    return new SecureNoSqlDb({
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
