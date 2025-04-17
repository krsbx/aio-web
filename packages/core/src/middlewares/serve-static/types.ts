import type { Context } from '../../context';

export interface GetPath {
  (ctx: Context): string;
}

export interface ServeStaticOptions {
  root: string;
  getPath?: GetPath;
  fallback?: string;
  spa?: boolean;
}
