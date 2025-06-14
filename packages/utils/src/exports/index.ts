import path from 'node:path';
import { createExports } from './create';
import { addImport, addRequire } from './helper';
import type { ExportJson } from './types';

export type ExportsOptions = {
  source: string;
  /**
   * Add `import` to the `package.json`
   * @default false
   */
  addImport?: boolean;
  /**
   * Add `require` to the `package.json`
   * @default false
   */
  addRequire?: boolean;
};

export async function exports(options: ExportsOptions) {
  const pkgJson = await Bun.file(
    path.resolve(options.source, 'package.json')
  ).json();
  const srcPath = path.resolve(options.source, 'src');

  pkgJson.exports = {} as Record<string, ExportJson>;

  if (options.addImport) {
    addImport({
      record: pkgJson.exports,
      isRelative: false,
      key: '.',
      value: 'index',
      isRoot: true,
    });
    addImport({
      record: pkgJson.exports,
      isRelative: true,
      key: '*',
      value: '',
      isRoot: false,
    });
    addImport({
      record: pkgJson.exports,
      isRelative: true,
      key: '**/*',
      value: '',
      isRoot: false,
    });
  }

  if (options.addRequire) {
    addRequire({
      record: pkgJson.exports,
      isRelative: false,
      key: '.',
      value: 'index',
      isRoot: true,
    });
    addRequire({
      record: pkgJson.exports,
      isRelative: true,
      key: '*',
      value: '',
      isRoot: false,
    });
    addRequire({
      record: pkgJson.exports,
      isRelative: true,
      key: '**/*',
      value: '',
      isRoot: false,
    });
  }

  pkgJson.exports['./package.json'] = './package.json';

  await createExports({
    record: pkgJson.exports,
    srcPath,
    ...options,
  });

  // Write the updated package.json
  await Bun.write(
    path.resolve(options.source, 'package.json'),
    JSON.stringify(pkgJson, null, 2)
  );
}
