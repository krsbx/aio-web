import path from 'node:path';
import type { Middleware } from '../../router/types';
import type { ServeStaticOptions } from './types';
import {
  getBasePath,
  getMimeType,
  getRelativePath,
  normalizePath,
} from './utilities';

export function serveStatic(options: ServeStaticOptions): Middleware {
  const { root, getPath, fallback = '', spa = false } = options;

  const basePath = getBasePath(root);

  return async (ctx, next) => {
    const relativePath = getRelativePath(ctx, getPath);
    const normalizedPath = normalizePath(relativePath, fallback);

    let finalPath = path.join(basePath, normalizedPath);

    let file = Bun.file(finalPath);

    if (!(await file.exists())) {
      if (spa && fallback) {
        finalPath = path.join(basePath, fallback);
        file = Bun.file(finalPath);
      } else {
        return await next();
      }
    }

    ctx.header('Content-Type', getMimeType(finalPath), false);

    return new Response(file, { status: 200 });
  };
}
