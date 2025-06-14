import { resolve } from 'node:path';
import { build as tsup, type Options as BuildOptions } from 'tsup';
import { fixCjsBuild } from './fix';

export async function build(source: string, options: BuildOptions = {}) {
  await tsup({
    splitting: false,
    entry: [
      resolve(source, 'src/**/*.ts'),
      `!${resolve(source, 'src/**/*.d.ts')}`,
    ],
    external: ['bun', 'bun:sqlite'],
    format: ['cjs'],
    outDir: 'dist/cjs',
    minify: false,
    bundle: false,
    treeshake: true,
    sourcemap: false,
    clean: true,
    skipNodeModulesBundle: true,
    dts: true,
    legacyOutput: true,
    ...options,
  });

  fixCjsBuild(source);
}
