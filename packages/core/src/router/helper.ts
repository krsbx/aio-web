import type { Router } from '.';
import type { ApiMethod } from '../app/constants';
import { extractPathPartsForRegister, joinPaths } from '../utilities';
import type {
  Handler,
  Middleware,
  ResolveMiddlewareOptions,
  Route,
} from './types';

function resolveMiddlewares(options: ResolveMiddlewareOptions) {
  const combined = [
    ...options.globalMiddlewares,
    ...options.pathMiddlewares.collect(options.parts),
    ...options.middlewares,
  ];

  return combined;
}

export function register<
  BasePath extends string,
  V,
  P extends Record<string, string> = NonNullable<unknown>,
  Q extends Record<string, string> = NonNullable<unknown>,
  S extends Record<string, unknown> = NonNullable<unknown>,
>(
  this: Router<BasePath>,
  method: ApiMethod,
  path: string,
  handler: Handler<V, P, Q, S>,
  middlewares: Middleware[]
) {
  const pathWithBase = joinPaths(this.basePath, path);
  const parts = extractPathPartsForRegister(pathWithBase);

  const routeEntry = {
    method,
    path: pathWithBase,
    handler,
    middlewares: resolveMiddlewares({
      globalMiddlewares: this.middlewares,
      middlewares: middlewares,
      pathMiddlewares: this.pathMiddlewares,
      parts,
    }),
  } as Route;

  this.routesTree.insert(parts, routeEntry);

  return this;
}
