import type { Router } from '.';
import type { Handler, Middleware, Route } from './types';

export interface RouterHelperContract<BasePath extends string> {
  match(
    this: Router<BasePath>,
    method: string,
    url: string
  ): {
    route: Route;
    params: Record<string, string>;
  } | null;
  register<
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
  ): void;
}
