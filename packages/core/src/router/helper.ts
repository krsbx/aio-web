import type { Router } from '.';
import type { ApiMethod } from '../app/constants';
import type {
  Handler,
  Middleware,
  ResolveMiddlewareOptions,
  Route,
} from './types';
import { joinPaths } from './utilities';

function resolveMiddlewares(options: ResolveMiddlewareOptions) {
  const combined = [...options.globalMiddlewares];

  // Sort pathMiddlewares keys from longest to shortest
  const sortedPaths = Object.keys(options.pathMiddlewares).sort(
    (a, b) => b.length - a.length
  );

  for (const prefix of sortedPaths) {
    if (options.path.startsWith(prefix)) {
      combined.push(...options.pathMiddlewares[prefix]);
    }
  }

  combined.push(...options.middlewares);

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
  const parts = pathWithBase.split('/').filter(Boolean);

  const routeEntry = {
    method,
    path: pathWithBase,
    handler,
    middlewares: resolveMiddlewares({
      globalMiddlewares: this.middlewares,
      middlewares: middlewares,
      pathMiddlewares: this.pathMiddlewares,
      path,
    }),
  } as Route;

  this.routesTree.insert(parts, routeEntry);

  return this;
}
