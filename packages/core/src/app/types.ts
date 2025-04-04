import type { BunRequest, ServeOptions } from 'bun';
import type { Context } from '../context';
import type { Middleware, Route } from '../router/types';
import type { ApiMethod } from './constants';

export interface MatchResult {
  route: Route;
  params: Record<string, string>;
}

export interface ComposerOptions {
  request: Request;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  route: Route<any, any, any, any>;
  params: Record<string, string>;
  middlewares: Middleware[];
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

export type NativeRoutes = Record<
  string,
  Partial<Record<ApiMethod, (req: BunRequest) => Response | Promise<Response>>>
>;

export interface ListenOptions extends Omit<ServeOptions, 'fetch' | 'routes'> {
  routes?: boolean;
}
