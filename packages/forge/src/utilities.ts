import { Router } from '@ignisia/core';
import { fileURLToPath } from 'bun';
import { renderToString } from 'react-dom/server';
import { ForgeApiMethod, ForgeApiMethods } from './constants';
import type { ForgeApi } from './types/api';
import type { Page } from './types/page';

export function toRoutePath(path: string) {
  const normalizedPath = path
    .replace(/^\/+/, '') // remove leading slashes
    .replace(/^pages\//, '') // remove pages/
    .replace(/^api\//, '') // remove api/
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

export async function pageLoader(relativePath: string) {
  const basePath = toRoutePath(relativePath);

  // Resolve the absolute path
  const absolutePath = fileURLToPath(new URL(relativePath, import.meta.url));

  const page = (await import(absolutePath)) as Page;
  const router = new Router(basePath);

  router.get('/', async (ctx) => {
    let props: Record<string, unknown> = {};

    if (page.getServerSideProps) {
      props = await page.getServerSideProps(ctx);
    }

    return ctx.html(renderToString(page.default(props)));
  });

  return router;
}
