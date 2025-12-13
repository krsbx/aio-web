import type { Router } from '.';
import type { ApiMethod } from '../app/constants';
import type { Handler, Middleware } from './types';

export interface RouterHelperContract<BasePath extends string> {
  register<
    V,
    P extends Record<string, string> = NonNullable<unknown>,
    Q extends Record<string, string> = NonNullable<unknown>,
    S extends Record<string, unknown> = NonNullable<unknown>,
  >(
    this: Router<BasePath>,
    method: ApiMethod,
    path: string,
    handler: Handler<V, P, Q, S>,
    middleware: Middleware<V, P, Q, S>[]
  ): this;
}
