import path from 'node:path';
import fs from 'node:fs/promises';

type ExportJson =
  | {
      types: string;
      import: string;
    }
  | string;

function createExports(record: Record<string, ExportJson>, srcPath: string) {
  async function tranverse(dirPath: string, prefix: string = '.') {
    const entries = (await fs.readdir(path.resolve(srcPath, dirPath))).sort(
      (a, b) => a.localeCompare(b)
    );

    for (const entry of entries) {
      const relativeKey = path.posix.join(prefix, entry);
      const fullPath = path.resolve(srcPath, dirPath, entry);

      if ((await fs.stat(fullPath)).isDirectory()) {
        const index = path.resolve(fullPath, 'index.ts');

        if (await Bun.file(index).exists()) {
          record[`./${relativeKey}`] = {
            types: `./dist/${relativeKey}/index.d.ts`,
            import: `./dist/${relativeKey}/index.js`,
          };
        }

        await tranverse(path.join(dirPath, entry), relativeKey);
      }
    }
  }

  return tranverse('');
}

export async function exports(source: string) {
  const pkgJson = await Bun.file(path.resolve(source, 'package.json')).json();
  const srcPath = path.resolve(source, 'src');

  pkgJson.exports = {
    '.': {
      types: './dist/index.d.ts',
      import: './dist/index.js',
    },
    './*': {
      types: './dist/*.d.ts',
      import: './dist/*.js',
    },
    './**/*': {
      types: './dist/**/*.d.ts',
      import: './dist/**/*.js',
    },
    './package.json': './package.json',
  } as Record<string, ExportJson>;

  await createExports(pkgJson.exports, srcPath);

  // Write the updated package.json
  await Bun.write(
    path.resolve(source, 'package.json'),
    JSON.stringify(pkgJson, null, 2)
  );
}
