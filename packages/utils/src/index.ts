import { $ } from 'bun';
import { resolve } from 'node:path';
import { build as tsup } from 'tsup';

export async function build(source: string) {
  await $`rm -rf ${resolve(source, 'dist')}`;

  await tsup({
    splitting: false,
    entryPoints: [resolve(source, 'src/**/*.ts')],
    external: ['bun', 'bun:*'],
    format: ['esm'],
    outDir: 'dist',
    minify: false,
    sourcemap: false,
    dts: true,
  });

  process.exit();
}
