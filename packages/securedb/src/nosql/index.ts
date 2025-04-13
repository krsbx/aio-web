import {
  Database,
  type Document,
  type Field,
  type QueryBuilder,
} from '@ignisia/nosql/dist/documents';
import type { DatabaseOptions } from '@ignisia/nosql/dist/documents/database/types';
import { decrypt, encrypt, setupSecureDb, trackChanges } from '../helper';
import type {
  DecryptDbParams,
  EncryptDbParams,
  SecureDbContract,
  TrackChangesParams,
} from '../helper/contract';
import type { DatabaseMeta } from '../types';
import type { DefineSecureDbOptions, SecureDbOptions } from './types';

export class SecureNoSqlDb<
    Docs extends Record<string, Document<string, Record<string, Field>>>,
  >
  extends Database<Docs>
  implements AsyncDisposable
{
  protected decryptedFilePath: string;
  protected encryptedFilePath: string;
  protected password: string;
  protected salt: string | Uint8Array | null;
  protected isProtected: boolean;
  public readonly metaPath: string;
  public readonly meta: DatabaseMeta;

  protected trackChanges: SecureDbContract['trackChanges'];
  public encrypt: SecureDbContract['encrypt'];
  public decrypt: SecureDbContract['decrypt'];

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
    this.encrypt = encrypt.bind(this as unknown as EncryptDbParams);
    this.decrypt = decrypt.bind(this as unknown as DecryptDbParams);
  }

  public document<
    DocName extends keyof Docs & string,
    Doc extends Docs[DocName],
  >(docName: DocName) {
    const query = super.document(docName);
    const exec = query.exec;

    query.exec = async () => {
      const result = await exec.call(query);

      if (this.isProtected) {
        await this.trackChanges();
      }

      return result;
    };

    return query as unknown as QueryBuilder<DocName, Doc>;
  }

  public async [Symbol.asyncDispose]() {
    if (!this.isProtected) return;

    console.log('SecureNoSqlDb disposing...');

    await this.encrypt();

    await Promise.all([
      Bun.file(this.metaPath).delete(),
      Bun.file(this.decryptedFilePath).delete(),
    ]);

    console.log('SecureNoSqlDb disposed');
  }

  public static define<
    Docs extends Record<string, Document<string, Record<string, Field>>>,
  >(options: DatabaseOptions<Docs>): SecureNoSqlDb<Docs>;
  public static define<
    Docs extends Record<string, Document<string, Record<string, Field>>>,
  >(options: DefineSecureDbOptions<Docs>): Promise<SecureNoSqlDb<Docs>>;
  public static define<
    Docs extends Record<string, Document<string, Record<string, Field>>>,
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
