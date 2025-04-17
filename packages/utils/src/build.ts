import { resolve } from 'node:path';
import { build as tsup, type Options as BuildOptions } from 'tsup';
import { exports } from './exports';

export async function build(
  source: string,
  options: BuildOptions = {},
  autoUpdateExports: boolean = true
) {
  await tsup({
    splitting: false,
    entryPoints: [resolve(source, 'src/**/*.ts')],
    external: ['bun', 'bun:sqlite'],
    format: ['esm'],
    outDir: 'dist',
    minify: false,
    bundle: false,
    treeshake: true,
    sourcemap: false,
    clean: true,
    skipNodeModulesBundle: true,
    dts: true,
    ...options,
  });

  if (autoUpdateExports) {
    await exports(source);
  }

  process.exit();
}
