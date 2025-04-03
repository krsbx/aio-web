import { composer } from './composer';
import type { Middleware, Route, Handler, ExtractPathParams } from './types';

export class Router {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public routes: Route<any, any, any, any>[];
  private middlewares: Middleware[];
  private pathMiddlewares: Record<string, Middleware[]>;

  public constructor() {
    this.routes = [];
    this.middlewares = [];
    this.pathMiddlewares = {};
  }

  public use<
    Path extends string,
    Values,
    Params extends ExtractPathParams<Path>,
    Query extends Record<string, string>,
    State extends Record<string, unknown>,
  >(...mws: Middleware<Values, Params, Query, State>[]): void;
  public use<
    Path extends string,
    Values,
    Params extends ExtractPathParams<Path>,
    Query extends Record<string, string>,
    State extends Record<string, unknown>,
  >(path: Path, ...mws: Middleware<Values, Params, Query, State>[]): void;
  public use<
    Path extends string,
    Values,
    Params extends ExtractPathParams<Path>,
    Query extends Record<string, string>,
    State extends Record<string, unknown>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  >(...args: any[]) {
    if (typeof args[0] === 'string') {
      const path = args[0];
      const mws = args.slice(1) as Middleware<Values, Params, Query, State>[];

      if (!this.pathMiddlewares[path]) {
        this.pathMiddlewares[path] = [];
      }

      this.pathMiddlewares[path].push(...(mws as Middleware[]));
    } else {
      this.middlewares.push(...(args as Middleware[]));
    }
  }

  private register<
    V,
    P extends Record<string, string> = NonNullable<unknown>,
    Q extends Record<string, string> = NonNullable<unknown>,
    S extends Record<string, unknown> = NonNullable<unknown>,
  >(
    method: string,
    path: string,
    handler: Handler<V, P, Q, S>,
    middleware: Middleware<V, P, Q, S>[] = []
  ) {
    const keys: string[] = [];
    const pattern = new RegExp(
      '^' +
        path.replace(/\/:(\w+)/g, (_, key) => {
          keys.push(key);
          return '/([^/]+)';
        }) +
        '$'
    );

    this.routes.push({ method, path, handler, middleware, pattern, keys });
  }

  public get<
    Path extends string,
    Values,
    Params extends ExtractPathParams<Path>,
    Query extends Record<string, string>,
    State extends Record<string, unknown>,
  >(path: Path, handler: Handler<Values, Params, Query, State>): void;
  public get<
    Path extends string,
    Values,
    Params extends ExtractPathParams<Path>,
    Query extends Record<string, string>,
    State extends Record<string, unknown>,
  >(
    path: Path,
    ...mws: [
      ...Middleware<Values, Params, Query, State>[],
      Handler<Values, Params, Query, State>,
    ]
  ): void;
  public get<
    Path extends string,
    Values,
    Params extends ExtractPathParams<Path>,
    Query extends Record<string, string>,
    State extends Record<string, unknown>,
  >(
    path: Path,
    ...mws: [
      ...Middleware<Values, Params, Query, State>[],
      Handler<Values, Params, Query, State>,
    ]
  ) {
    const handler = mws.pop() as Handler<Values, Params, Query, State>;

    this.register(
      'GET',
      path,
      handler,
      mws as Middleware<Values, Params, Query, State>[]
    );
  }

  public post<
    Path extends string,
    Values,
    Params extends ExtractPathParams<Path>,
    Query extends Record<string, string>,
    State extends Record<string, unknown>,
  >(path: Path, handler: Handler<Values, Params, Query, State>): void;
  public post<
    Path extends string,
    Values,
    Params extends ExtractPathParams<Path>,
    Query extends Record<string, string>,
    State extends Record<string, unknown>,
  >(
    path: Path,
    ...mws: [
      ...Middleware<Values, Params, Query, State>[],
      Handler<Values, Params, Query, State>,
    ]
  ): void;
  public post<
    Path extends string,
    Values,
    Params extends ExtractPathParams<Path>,
    Query extends Record<string, string>,
    State extends Record<string, unknown>,
  >(
    path: Path,
    ...mws: [
      ...Middleware<Values, Params, Query, State>[],
      Handler<Values, Params, Query, State>,
    ]
  ) {
    const handler = mws.pop() as Handler<Values, Params, Query, State>;

    this.register(
      'POST',
      path,
      handler,
      mws as Middleware<Values, Params, Query, State>[]
    );
  }

  public put<
    Path extends string,
    Values,
    Params extends ExtractPathParams<Path>,
    Query extends Record<string, string>,
    State extends Record<string, unknown>,
  >(path: Path, handler: Handler<Values, Params, Query, State>): void;
  public put<
    Path extends string,
    Values,
    Params extends ExtractPathParams<Path>,
    Query extends Record<string, string>,
    State extends Record<string, unknown>,
  >(
    path: Path,
    ...mws: [
      ...Middleware<Values, Params, Query, State>[],
      Handler<Values, Params, Query, State>,
    ]
  ): void;
  public put<
    Path extends string,
    Values,
    Params extends ExtractPathParams<Path>,
    Query extends Record<string, string>,
    State extends Record<string, unknown>,
  >(
    path: Path,
    ...mws: [
      ...Middleware<Values, Params, Query, State>[],
      Handler<Values, Params, Query, State>,
    ]
  ) {
    const handler = mws.pop() as Handler<Values, Params, Query, State>;

    this.register(
      'PUT',
      path,
      handler,
      mws as Middleware<Values, Params, Query, State>[]
    );
  }

  public patch<
    Path extends string,
    Values,
    Params extends ExtractPathParams<Path>,
    Query extends Record<string, string>,
    State extends Record<string, unknown>,
  >(path: Path, handler: Handler<Values, Params, Query, State>): void;
  public patch<
    Path extends string,
    Values,
    Params extends ExtractPathParams<Path>,
    Query extends Record<string, string>,
    State extends Record<string, unknown>,
  >(
    path: Path,
    ...mws: [
      ...Middleware<Values, Params, Query, State>[],
      Handler<Values, Params, Query, State>,
    ]
  ): void;
  public patch<
    Path extends string,
    Values,
    Params extends ExtractPathParams<Path>,
    Query extends Record<string, string>,
    State extends Record<string, unknown>,
  >(
    path: Path,
    ...mws: [
      ...Middleware<Values, Params, Query, State>[],
      Handler<Values, Params, Query, State>,
    ]
  ) {
    const handler = mws.pop() as Handler<Values, Params, Query, State>;

    this.register(
      'PATCH',
      path,
      handler,
      mws as Middleware<Values, Params, Query, State>[]
    );
  }

  public delete<
    Path extends string,
    Values,
    Params extends ExtractPathParams<Path>,
    Query extends Record<string, string>,
    State extends Record<string, unknown>,
  >(path: Path, handler: Handler<Values, Params, Query, State>): void;
  public delete<
    Path extends string,
    Values,
    Params extends ExtractPathParams<Path>,
    Query extends Record<string, string>,
    State extends Record<string, unknown>,
  >(
    path: Path,
    ...mws: [
      ...Middleware<Values, Params, Query, State>[],
      Handler<Values, Params, Query, State>,
    ]
  ): void;
  public delete<
    Path extends string,
    Values,
    Params extends ExtractPathParams<Path>,
    Query extends Record<string, string>,
    State extends Record<string, unknown>,
  >(
    path: Path,
    ...mws: [
      ...Middleware<Values, Params, Query, State>[],
      Handler<Values, Params, Query, State>,
    ]
  ) {
    const handler = mws.pop() as Handler<Values, Params, Query, State>;

    this.register(
      'DELETE',
      path,
      handler,
      mws as Middleware<Values, Params, Query, State>[]
    );
  }

  public options<
    Path extends string,
    Values,
    Params extends ExtractPathParams<Path>,
    Query extends Record<string, string>,
    State extends Record<string, unknown>,
  >(
    path: Path,
    handler: Handler<Values, Params, Query, State>,
    ...middleware: Middleware<Values, Params, Query, State>[]
  ) {
    this.register('OPTIONS', path, handler, middleware);
  }

  public all<
    Path extends string,
    Values,
    Params extends ExtractPathParams<Path>,
    Query extends Record<string, string>,
    State extends Record<string, unknown>,
  >(
    path: Path,
    handler: Handler<Values, Params, Query, State>,
    ...middleware: Middleware<Values, Params, Query, State>[]
  ) {
    for (const method of ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']) {
      this.register(method, path, handler, middleware);
    }
  }

  public match(method: string, url: string) {
    for (const route of this.routes) {
      if (route.method !== method) continue;

      const match = route.pattern.exec(url);

      if (!match) continue;

      const params: Record<string, string> = {};

      route.keys.forEach((key, i) => {
        params[key] = decodeURIComponent(match[i + 1]);
      });

      return {
        route,
        params,
      };
    }

    return null;
  }

  public async handle(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const found = this.match(req.method, url.pathname);

    if (!found) {
      return new Response('Not Found', { status: 404 });
    }

    return composer({
      request: req,
      middlewares: this.middlewares,
      pathMiddlewares: this.pathMiddlewares,
      ...found,
    });
  }
}
