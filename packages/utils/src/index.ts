import { $ } from 'bun';
import { resolve } from 'node:path';
import { build as tsup, type Options } from 'tsup';

export async function build(source: string, options: Options = {}) {
  await $`rm -rf ${resolve(source, 'dist')}`;

  await tsup({
    splitting: true,
    entryPoints: [resolve(source, 'src/**/*.ts')],
    external: ['bun', 'bun:sqlite'],
    format: ['esm'],
    outDir: 'dist',
    minify: false,
    sourcemap: false,
    dts: true,
    ...options,
  });

  process.exit();
}
