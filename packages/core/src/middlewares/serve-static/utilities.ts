import path from 'node:path';
import type { Context } from '../../context';
import type { GetPath } from './types';

export function getBasePath(root: string) {
  return path.isAbsolute(root) ? root : path.resolve(process.cwd(), root);
}

export function getRelativePath(ctx: Context, getPath: GetPath | undefined) {
  const relativePath = getPath ? getPath(ctx) : ctx.req.url.pathname;

  return decodeURIComponent(relativePath);
}

export function normalizePath(path: string, fallback: string) {
  return path.endsWith('/') ? `${path}${fallback}` : path;
}

export function getMimeType(filePath: string) {
  return Bun.file(filePath).type || 'application/octet-stream';
}
