import { Router } from '@ignisia/core';
import { fileURLToPath } from 'bun';
import { ForgeApiMethod, ForgeApiMethods } from './constants';
import type { ForgeApi } from './types/api';

export function toRoutePath(path: string) {
  const normalizedPath = path
    .replace(/^\/+/, '') // remove leading slashes
    .replace(/\.(tsx|ts|js|jsx)$/, '') // remove extension
    .replace(/\/index$/, '') // remove trailing /index
    .replace(/\[(.+?)\]/g, ':$1'); // convert [param] to :param

  return ('/' + normalizedPath).replace(/\/+$/, '') || '/'; // ensure root is "/"
}

export async function apiLoader(relativePath: string) {
  const basePath = toRoutePath(relativePath);

  // Resolve the absolute path
  const absolutePath = fileURLToPath(new URL(relativePath, import.meta.url));

  const api = (await import(absolutePath)) as ForgeApi;
  const router = new Router(basePath);

  for (const [method, handler] of Object.entries(api)) {
    if (!ForgeApiMethods.includes(method as ForgeApiMethod)) continue;

    router[method.toLowerCase() as Lowercase<ForgeApiMethods>]('/', handler);
  }

  return router;
}
