import { decryptFile, encryptFile } from '@ignisia/encryption';
import type { SetupSecureDbOptions } from '../types';
import { isFileExists, readMeta, writeMeta } from '../utilities';
import type {
  DecryptDbParams,
  EncryptDbParams,
  TrackChangesParams,
} from './contract';

export async function encrypt(this: EncryptDbParams) {
  await encryptFile({
    input: this.decryptedFilePath,
    output: this.encryptedFilePath,
    salt: this.salt,
    password: this.password,
  });
}

export async function decrypt(this: DecryptDbParams) {
  await decryptFile({
    input: this.encryptedFilePath,
    output: this.decryptedFilePath,
    password: this.password,
    salt: this.salt,
  });
}

export async function trackChanges(this: TrackChangesParams) {
  this.meta.totalChanges++;

  if (this.meta.totalChanges % 5 === 0) {
    await this.encrypt();

    this.meta.lastEncryptedAt = new Date();
    this.meta.totalChanges = 0;
  }

  await writeMeta(this.metaPath, this.meta);
}

export async function setupSecureDb(options: SetupSecureDbOptions) {
  const { isExists: isMetaExists, meta } = await readMeta(options.metaPath);
  const [isDecryptedExists, isEncryptedExists] = await Promise.all([
    isFileExists(options.decryptedFilePath),
    isFileExists(options.encryptedFilePath),
  ]);

  if (!isDecryptedExists && isEncryptedExists) {
    await decrypt.call({
      ...options,
      salt: options.salt ?? null,
    });
  }

  if (!isMetaExists) {
    await writeMeta(options.metaPath, meta);
  }

  return {
    ...options,
    meta: meta,
  };
}
