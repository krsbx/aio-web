import type { DatabaseMeta } from './types';

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
