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
  const parts = pathWithBase.split('/').filter(Boolean);

  const routeEntry = {
    method,
    path: pathWithBase,
    handler,
    middleware,
  } as Route;

  this.routesTree.insert(parts, routeEntry);

  resolveMiddlewares.call(this, pathWithBase, middleware as Middleware[]);

  return this;
}
