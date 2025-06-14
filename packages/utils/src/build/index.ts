import { type Options as TsUpBuildOptions } from 'tsup';
import { exports } from '../exports';
import { build as buildCjs } from './cjs';
import { build as buildEsm } from './esm';

type BuildOptions = TsUpBuildOptions & {
  /**
   * Enable auto update exports
   * @default true
   */
  autoUpdateExports?: boolean;
  /**
   * Enable CJS build
   * @default false
   */
  buildCjs?: boolean;
  /**
   * Enable ESM build
   * @default true
   */
  buildEsm?: boolean;
};

export async function build(source: string, options: BuildOptions = {}) {
  const autoUpdateExports =
    typeof options.autoUpdateExports === 'undefined'
      ? true
      : options.autoUpdateExports;
  options.buildEsm =
    typeof options.buildEsm === 'undefined' ? true : options.buildEsm;

  const builds: Promise<void>[] = [];

  if (options.buildCjs) {
    builds.push(buildCjs(source, options));
  }

  if (options.buildEsm) {
    builds.push(buildEsm(source, options));
  }

  await Promise.all(builds);

  if (autoUpdateExports) {
    await exports({
      source: source,
      addImport: options.buildEsm,
      addRequire: options.buildCjs,
    });
  }

  process.exit();
}

export { buildCjs, buildEsm };
