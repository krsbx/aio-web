import type { DetailedExportJson, ExportJson } from './types';

type Options = {
  record: Record<string, ExportJson>;
  key: string;
  value: string;
  isRelative: boolean;
  isRoot: boolean;
};

export function addExports(options: Options & { type: 'esm' | 'cjs' }) {
  const isEsm = options.type === 'esm';
  const finalKey = options.isRoot
    ? '.'
    : options.isRelative
      ? `./${options.key}`
      : options.key;
  const finalValue = options.isRoot
    ? options.value
    : `${options.key}${options.value}`;

  if (!options.record[finalKey]) {
    options.record[finalKey] = {
      types: `./dist/${options.type}/${finalValue}.d.ts`,
    };
  }

  (options.record[finalKey] as DetailedExportJson)[
    isEsm ? 'import' : 'require'
  ] = `./dist/${options.type}/${finalValue}.${isEsm ? 'js' : 'cjs'}`;

  return options.record;
}

export function addImport(options: Options) {
  return addExports({ ...options, type: 'esm' });
}

export function addRequire(options: Options) {
  return addExports({ ...options, type: 'cjs' });
}
