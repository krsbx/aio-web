import type { ApiMethod } from '../app/constants';
import type { Context } from '../context';
import type { TrieMiddlewareNode } from './trie';

export type Middleware<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  V = any,
  P extends Record<string, string> = NonNullable<unknown>,
  Q extends Record<string, string> = NonNullable<unknown>,
  S extends Record<string, unknown> = NonNullable<unknown>,
> = (
  ctx: Context<V, P, Q, S>,
  next: () => Promise<void | Response> | void | Response
) => Promise<void | Response> | void | Response;

export type Handler<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  V = any,
  P extends Record<string, string> = NonNullable<unknown>,
  Q extends Record<string, string> = NonNullable<unknown>,
  S extends Record<string, unknown> = NonNullable<unknown>,
> = (ctx: Context<V, P, Q, S>) => Response | Promise<Response>;

export interface Route<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  V = any,
  P extends Record<string, string> = NonNullable<unknown>,
  Q extends Record<string, string> = NonNullable<unknown>,
  S extends Record<string, unknown> = NonNullable<unknown>,
> {
  method: ApiMethod;
  path: string;
  handler: Handler<V, P, Q, S>;
  middlewares: Middleware<V, P, Q, S>[];
}

export type ExtractPathParams<Path extends string> =
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Path extends `${infer Start}:${infer Param}/${infer Rest}`
    ? {
        [K in Param | keyof ExtractPathParams<`/${Rest}`>]: string;
      }
    : // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Path extends `${infer Start}:${infer Param}`
      ? {
          [K in Param]: string;
        }
      : NonNullable<unknown>;

export interface ResolveMiddlewareOptions {
  parts: string[];
  pathMiddlewares: TrieMiddlewareNode;
  middlewares: Middleware[];
}
