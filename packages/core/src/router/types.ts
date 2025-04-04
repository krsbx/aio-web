import type { Context } from '../context';

export type Middleware<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  V = any,
  P extends Record<string, string> = NonNullable<unknown>,
  Q extends Record<string, string> = NonNullable<unknown>,
  S extends Record<string, unknown> = NonNullable<unknown>,
> = (
  ctx: Context<V, P, Q, S>,
  next: () => Promise<void>
) => Promise<void> | void;

export type Handler<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  V = any,
  P extends Record<string, string> = NonNullable<unknown>,
  Q extends Record<string, string> = NonNullable<unknown>,
  S extends Record<string, unknown> = NonNullable<unknown>,
> = (ctx: Context<V, P, Q, S>) => Response | Promise<Response>;

export interface Route<
  V,
  P extends Record<string, string>,
  Q extends Record<string, string>,
  S extends Record<string, unknown>,
> {
  method: string;
  path: string;
  handler: Handler<V, P, Q, S>;
  middleware: Middleware<V, P, Q, S>[];
  pattern: RegExp;
  keys: string[];
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

export interface ComposerOptions {
  request: Request;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  route: Route<any, any, any, any>;
  params: Record<string, string>;
  middlewares: Middleware[];
  pathMiddlewares: Record<string, Middleware[]>;
  onError: OnError | null;
}

export interface OnError<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  V = any,
  P extends Record<string, string> = NonNullable<unknown>,
  Q extends Record<string, string> = NonNullable<unknown>,
  S extends Record<string, unknown> = NonNullable<unknown>,
> {
  (error: unknown, ctx: Context<V, P, Q, S>): Response | Promise<Response>;
}

export interface OnNotFound<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  V = any,
  P extends Record<string, string> = NonNullable<unknown>,
  Q extends Record<string, string> = NonNullable<unknown>,
  S extends Record<string, unknown> = NonNullable<unknown>,
> {
  (ctx: Context<V, P, Q, S>): Response | Promise<Response>;
}
