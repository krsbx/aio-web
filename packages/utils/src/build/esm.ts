import { resolve } from 'node:path';
import { build as tsup, type Options as BuildOptions } from 'tsup';
import { addExtension } from './plugin';

export async function build(source: string, options: BuildOptions = {}) {
  return tsup({
    splitting: false,
    entry: [
      resolve(source, 'src/**/*.ts'),
      `!${resolve(source, 'src/**/*.d.ts')}`,
    ],
    external: ['bun', 'bun:sqlite'],
    format: ['esm'],
    outDir: 'dist/esm',
    minify: false,
    bundle: false,
    treeshake: true,
    sourcemap: false,
    clean: true,
    skipNodeModulesBundle: true,
    dts: true,
    esbuildPlugins: [addExtension('.js', '.ts')],
    ...options,
  });
}
