import fs from 'node:fs/promises';
import path from 'node:path';
import type { ExportsOptions } from '.';
import { addImport, addRequire } from './helper';
import type { ExportJson } from './types';

type CreateExportsOptions = Omit<ExportsOptions, 'source'> & {
  record: Record<string, ExportJson>;
  srcPath: string;
};

export function createExports(options: CreateExportsOptions) {
  async function tranverse(dirPath: string, prefix: string = '.') {
    const entries = (
      await fs.readdir(path.resolve(options.srcPath, dirPath))
    ).sort((a, b) => a.localeCompare(b));

    for (const entry of entries) {
      const relativeKey = path.posix.join(prefix, entry);
      const fullPath = path.resolve(options.srcPath, dirPath, entry);

      if ((await fs.stat(fullPath)).isDirectory()) {
        const index = path.resolve(fullPath, 'index.ts');

        if (await Bun.file(index).exists()) {
          if (options.addImport) {
            addImport({
              record: options.record,
              isRelative: true,
              key: relativeKey,
              value: '/index',
              isRoot: false,
            });
          }

          if (options.addRequire) {
            addRequire({
              record: options.record,
              isRelative: true,
              key: relativeKey,
              value: '/index',
              isRoot: false,
            });
          }
        }

        await tranverse(path.join(dirPath, entry), relativeKey);
      }
    }
  }

  return tranverse('');
}
