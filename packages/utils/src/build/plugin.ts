import fs from 'node:fs';
import path from 'node:path';
import type { Options as BuildOptions } from 'tsup';

export type Plugin = Required<BuildOptions>['esbuildPlugins'][number];

export function addExtension(
  extension: string = '.js',
  fileExtension: string = '.ts'
): Plugin {
  return {
    name: 'add-extension',
    setup(build) {
      build.onResolve({ filter: /.*/ }, (args) => {
        if (args.importer) {
          const p = path.join(args.resolveDir, args.path);
          let tsPath = `${p}${fileExtension}`;

          let importPath = '';
          if (fs.existsSync(tsPath)) {
            importPath = args.path + extension;
          } else {
            tsPath = path.join(
              args.resolveDir,
              args.path,
              `index${fileExtension}`
            );

            if (fs.existsSync(tsPath)) {
              importPath = `${args.path}/index${extension}`;
            }
          }

          return { path: importPath, external: true };
        }
      });
    },
  };
}
