import type { Router } from '.';
import type { Handler, Middleware, Route } from './types';
import { joinPaths } from './utilities';

function findRoutes(routes: Route[], method: string, url: string) {
  for (const route of routes) {
    if (route.method !== method) continue;

    const match = route.pattern.exec(url);

    if (!match) continue;

    const params: Record<string, string> = {};

    route.keys.forEach((key, i) => {
      const value = match[i + 1];
      if (value !== undefined) {
        params[key] = decodeURIComponent(value);
      }
    });

    return { route, params };
  }

  return null;
}

export function match<BasePath extends string>(
  this: Router<BasePath>,
  method: string,
  url: string
) {
  const staticHit = this.staticRoutesMap.get(`${method}:${url}`);

  if (staticHit) return { route: staticHit, params: {} };

  const dynamicHit = findRoutes(this.dynamicRoutes, method, url);

  if (dynamicHit) return dynamicHit;

  const wildcardHit = findRoutes(this.wildcardRoutes, method, url);

  if (wildcardHit) return wildcardHit;

  return null;
}

export function register<
  BasePath extends string,
  V,
  P extends Record<string, string> = NonNullable<unknown>,
  Q extends Record<string, string> = NonNullable<unknown>,
  S extends Record<string, unknown> = NonNullable<unknown>,
>(
  this: Router<BasePath>,
  method: string,
  path: string,
  handler: Handler<V, P, Q, S>,
  middleware: Middleware<V, P, Q, S>[]
) {
  const pathWithBase = joinPaths(this.basePath, path);

  const keys: string[] = [];
  let patternStr = '^';

  if (pathWithBase === '*') {
    patternStr = '.*';
  } else {
    const segments = pathWithBase.split('/').filter(Boolean);

    for (const segment of segments) {
      if (segment === '*') {
        const wildcardKey = `wildcard${keys.length}`;
        keys.push(wildcardKey);
        patternStr += '/(.*?)';
      } else if (segment.startsWith(':')) {
        const key = segment.slice(1);
        keys.push(key);
        patternStr += '/([^/]+)';
      } else {
        patternStr += '/' + segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }
    }

    patternStr += '/?$'; // Optional trailing slash
  }

  const pattern = new RegExp(patternStr);

  const routeEntry = {
    method,
    path: pathWithBase,
    handler,
    middleware,
    pattern,
    keys,
  } as Route;

  if (pathWithBase.includes('*')) {
    this.wildcardRoutes.push(routeEntry);
  } else if (keys.length > 0) {
    this.dynamicRoutes.push(routeEntry);
  } else {
    this.staticRoutes.push(routeEntry);
    this.staticRoutesMap.set(`${method}:${pathWithBase}`, routeEntry);
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  this.resolveMiddlewares(pathWithBase, middleware as Middleware[]);
}
