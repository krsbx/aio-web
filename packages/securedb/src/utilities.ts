import { decryptFile, encryptFile } from '@ignisia/encryption';
import type { DatabaseMeta, SetupSecureDbOptions } from './types';
import type { TrackChangesParams } from './contract';

export async function writeMeta(metaPath: string, meta: DatabaseMeta) {
  await Bun.write(metaPath, JSON.stringify(meta, null, 2));
}

export async function readMeta(
  metaPath: string
): Promise<{ isExists: boolean; meta: DatabaseMeta }> {
  try {
    return {
      isExists: true,
      meta: await Bun.file(metaPath).json(),
    };
  } catch {
    return {
      isExists: false,
      meta: {
        lastDecryptedAt: new Date(),
        lastEncryptedAt: null,
        totalChanges: 0,
      },
    };
  }
}

export async function isFileExists(filePath: string) {
  return Bun.file(filePath).exists();
}

export async function trackChanges(this: TrackChangesParams) {
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

export async function setupSecureDb(options: SetupSecureDbOptions) {
  const { isExists: isMetaExists, meta } = await readMeta(options.metaPath);

  if (
    !(await isFileExists(options.decryptedFilePath)) &&
    (await isFileExists(options.encryptedFilePath))
  ) {
    await decryptFile({
      input: options.encryptedFilePath,
      output: options.decryptedFilePath,
      ...options,
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
