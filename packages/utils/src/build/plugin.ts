import path from 'node:path';
import type { Options as BuildOptions } from 'tsup';

export type EsBuildPlugin = Required<BuildOptions>['esbuildPlugins'][number];

export function addExtension(
  extension: string = '.js',
  fileExtension: string = '.ts'
): EsBuildPlugin {
  return {
    name: 'add-extension',
    setup(build) {
      build.onResolve({ filter: /.*/ }, async (args) => {
        if (args.importer) {
          const p = path.join(args.resolveDir, args.path);
          let tsPath = `${p}${fileExtension}`;

          let importPath = '';

          if (await Bun.file(tsPath).exists()) {
            importPath = args.path + extension;
          } else {
            tsPath = path.join(
              args.resolveDir,
              args.path,
              `index${fileExtension}`
            );

            if (await Bun.file(tsPath).exists()) {
              importPath = `${args.path}/index${extension}`;
            }
          }

          return { path: importPath, external: true };
        }
      });
    },
  };
}
