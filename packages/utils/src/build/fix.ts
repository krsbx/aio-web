import { resolve } from 'node:path';

export function fixCjsBuild(source: string) {
  return Bun.write(
    resolve(source, 'dist/cjs/package.json'),
    JSON.stringify(
      {
        type: 'commonjs',
      },
      null,
      2
    )
  );
}
