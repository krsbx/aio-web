import type { Router } from '.';
import type { Handler, Middleware, Route } from './types';
import { joinPaths } from './utilities';

function resolveMiddlewares<BasePath extends string>(
  this: Router<BasePath>,
  path: string,
  middlewares: Middleware[]
) {
  const combined = [...this.middlewares];

  // Sort pathMiddlewares keys from longest to shortest
  const sortedPaths = Object.keys(this.pathMiddlewares).sort(
    (a, b) => b.length - a.length
  );

  for (const prefix of sortedPaths) {
    if (path.startsWith(prefix)) {
      combined.push(...this.pathMiddlewares[prefix]);
    }
  }

  combined.push(...middlewares);

  this.composedMiddlewares[path] = combined;
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

  resolveMiddlewares.call(this, pathWithBase, middleware as Middleware[]);

  return this;
}
