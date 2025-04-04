import type { ServeOptions } from 'bun';
import { Context } from '../context';
import { composer } from './composer';
import type {
  ExtractPathParams,
  Handler,
  Middleware,
  OnError,
  OnNotFound,
  Route,
} from './types';
import { joinPaths } from './utilities';

export class Router<BasePath extends string> {
  public basePath: BasePath;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public routes: Route<any, any, any, any>[];
  private middlewares: Middleware[];
  private _onError: OnError | null;
  private _onNotFound: OnNotFound | null;

  private pathMiddlewares: Record<string, Middleware[]>;
  public composedMiddlewares: Record<string, Middleware[]>;

  public constructor(basePath: BasePath = '' as BasePath) {
    this.routes = [];
    this.middlewares = [];
    this.pathMiddlewares = {};
    this.composedMiddlewares = {};
    this.basePath = basePath as BasePath;
    this._onError = null;
    this._onNotFound = null;
  }

  public use<
    Path extends string,
    FullPath extends `${BasePath}${Path}`,
    Values,
    Params extends ExtractPathParams<FullPath>,
    Query extends Record<string, string>,
    State extends Record<string, unknown>,
  >(...mws: Middleware<Values, Params, Query, State>[]): void;
  public use<
    Path extends string,
    FullPath extends `${BasePath}${Path}`,
    Values,
    Params extends ExtractPathParams<FullPath>,
    Query extends Record<string, string>,
    State extends Record<string, unknown>,
  >(path: Path, ...mws: Middleware<Values, Params, Query, State>[]): void;
  public use<
    Path extends string,
    FullPath extends `${BasePath}${Path}`,
    Values,
    Params extends ExtractPathParams<FullPath>,
    Query extends Record<string, string>,
    State extends Record<string, unknown>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  >(...args: any[]) {
    if (typeof args[0] === 'string') {
      const path = joinPaths(this.basePath, args[0]);
      const mws = args.slice(1) as Middleware<Values, Params, Query, State>[];

      if (!this.pathMiddlewares[path]) {
        this.pathMiddlewares[path] = [];
      }

      this.pathMiddlewares[path].push(...(mws as Middleware[]));
    } else {
      this.middlewares.push(...(args as Middleware[]));
    }
  }

  private resolveMiddlewares(path: string, routeMiddleware: Middleware[]) {
    const combined: Middleware[] = [...this.middlewares];

    // Sort pathMiddlewares keys from longest to shortest
    const sortedPaths = Object.keys(this.pathMiddlewares).sort(
      (a, b) => b.length - a.length
    );

    for (const prefix of sortedPaths) {
      if (path.startsWith(prefix)) {
        combined.push(...this.pathMiddlewares[prefix]);
      }
    }

    combined.push(...routeMiddleware);

    this.composedMiddlewares[path] = combined;
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
    const pathWithBase = joinPaths(this.basePath, path);

    const keys: string[] = [];
    const pattern = new RegExp(
      '^' +
        pathWithBase.replace(/\/:(\w+)/g, (_, key) => {
          keys.push(key);

          return '/([^/]+)';
        }) +
        '$'
    );

    this.routes.push({
      method,
      path: pathWithBase,
      handler,
      middleware,
      pattern,
      keys,
    });

    this.resolveMiddlewares(pathWithBase, middleware as Middleware[]);
  }

  public get<
    Path extends string,
    FullPath extends `${BasePath}${Path}`,
    Values,
    Params extends ExtractPathParams<FullPath>,
    Query extends Record<string, string>,
    State extends Record<string, unknown>,
  >(path: Path, handler: Handler<Values, Params, Query, State>): void;
  public get<
    Path extends string,
    FullPath extends `${BasePath}${Path}`,
    Values,
    Params extends ExtractPathParams<FullPath>,
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
    FullPath extends `${BasePath}${Path}`,
    Values,
    Params extends ExtractPathParams<FullPath>,
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
    const middleware = mws as Middleware<Values, Params, Query, State>[];

    this.register('GET', path, handler, middleware);
  }

  public post<
    Path extends string,
    FullPath extends `${BasePath}${Path}`,
    Values,
    Params extends ExtractPathParams<FullPath>,
    Query extends Record<string, string>,
    State extends Record<string, unknown>,
  >(path: Path, handler: Handler<Values, Params, Query, State>): void;
  public post<
    Path extends string,
    FullPath extends `${BasePath}${Path}`,
    Values,
    Params extends ExtractPathParams<FullPath>,
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
    FullPath extends `${BasePath}${Path}`,
    Values,
    Params extends ExtractPathParams<FullPath>,
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
    const middleware = mws as Middleware<Values, Params, Query, State>[];

    this.register('POST', path, handler, middleware);
  }

  public put<
    Path extends string,
    FullPath extends `${BasePath}${Path}`,
    Values,
    Params extends ExtractPathParams<FullPath>,
    Query extends Record<string, string>,
    State extends Record<string, unknown>,
  >(path: Path, handler: Handler<Values, Params, Query, State>): void;
  public put<
    Path extends string,
    FullPath extends `${BasePath}${Path}`,
    Values,
    Params extends ExtractPathParams<FullPath>,
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
    FullPath extends `${BasePath}${Path}`,
    Values,
    Params extends ExtractPathParams<FullPath>,
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
    const middleware = mws as Middleware<Values, Params, Query, State>[];

    this.register('PUT', path, handler, middleware);
  }

  public patch<
    Path extends string,
    FullPath extends `${BasePath}${Path}`,
    Values,
    Params extends ExtractPathParams<FullPath>,
    Query extends Record<string, string>,
    State extends Record<string, unknown>,
  >(path: Path, handler: Handler<Values, Params, Query, State>): void;
  public patch<
    Path extends string,
    FullPath extends `${BasePath}${Path}`,
    Values,
    Params extends ExtractPathParams<FullPath>,
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
    FullPath extends `${BasePath}${Path}`,
    Values,
    Params extends ExtractPathParams<FullPath>,
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
    const middleware = mws as Middleware<Values, Params, Query, State>[];

    this.register('PATCH', path, handler, middleware);
  }

  public delete<
    Path extends string,
    FullPath extends `${BasePath}${Path}`,
    Values,
    Params extends ExtractPathParams<FullPath>,
    Query extends Record<string, string>,
    State extends Record<string, unknown>,
  >(path: Path, handler: Handler<Values, Params, Query, State>): void;
  public delete<
    Path extends string,
    FullPath extends `${BasePath}${Path}`,
    Values,
    Params extends ExtractPathParams<FullPath>,
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
    FullPath extends `${BasePath}${Path}`,
    Values,
    Params extends ExtractPathParams<FullPath>,
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
    const middleware = mws as Middleware<Values, Params, Query, State>[];

    this.register('DELETE', path, handler, middleware);
  }

  public options<
    Path extends string,
    FullPath extends `${BasePath}${Path}`,
    Values,
    Params extends ExtractPathParams<FullPath>,
    Query extends Record<string, string>,
    State extends Record<string, unknown>,
  >(path: Path, handler: Handler<Values, Params, Query, State>): void;
  public options<
    Path extends string,
    FullPath extends `${BasePath}${Path}`,
    Values,
    Params extends ExtractPathParams<FullPath>,
    Query extends Record<string, string>,
    State extends Record<string, unknown>,
  >(
    path: Path,
    ...mws: [
      ...Middleware<Values, Params, Query, State>[],
      Handler<Values, Params, Query, State>,
    ]
  ): void;
  public options<
    Path extends string,
    FullPath extends `${BasePath}${Path}`,
    Values,
    Params extends ExtractPathParams<FullPath>,
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
    const middleware = mws as Middleware<Values, Params, Query, State>[];

    this.register('OPTIONS', path, handler, middleware);
  }

  public all<
    Path extends string,
    FullPath extends `${BasePath}${Path}`,
    Values,
    Params extends ExtractPathParams<FullPath>,
    Query extends Record<string, string>,
    State extends Record<string, unknown>,
  >(path: Path, handler: Handler<Values, Params, Query, State>): void;
  public all<
    Path extends string,
    FullPath extends `${BasePath}${Path}`,
    Values,
    Params extends ExtractPathParams<FullPath>,
    Query extends Record<string, string>,
    State extends Record<string, unknown>,
  >(
    path: Path,
    ...mws: [
      ...Middleware<Values, Params, Query, State>[],
      Handler<Values, Params, Query, State>,
    ]
  ): void;
  public all<
    Path extends string,
    FullPath extends `${BasePath}${Path}`,
    Values,
    Params extends ExtractPathParams<FullPath>,
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
    const middleware = mws as Middleware<Values, Params, Query, State>[];

    for (const method of ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']) {
      this.register(method, path, handler, middleware);
    }
  }

  public group<
    GroupPath extends string,
    FullPath extends `${BasePath}${GroupPath}`,
  >(path: GroupPath, router: (router: Router<FullPath>) => void): void;
  public group<
    GroupPath extends string,
    FullPath extends `${BasePath}${GroupPath}`,
    Values,
    Params extends ExtractPathParams<FullPath>,
    Query extends Record<string, string>,
    State extends Record<string, unknown>,
  >(
    path: GroupPath,
    ...mws: [
      ...Middleware<Values, Params, Query, State>[],
      (router: Router<FullPath>) => void,
    ]
  ): void;
  public group<
    GroupPath extends string,
    FullPath extends `${BasePath}${GroupPath}`,
    Values,
    Params extends ExtractPathParams<FullPath>,
    Query extends Record<string, string>,
    State extends Record<string, unknown>,
  >(
    path: GroupPath,
    ...mws: [
      ...Middleware<Values, Params, Query, State>[],
      (router: Router<FullPath>) => void,
    ]
  ): void {
    const callback: (router: Router<FullPath>) => void = mws.pop() as (
      router: Router<FullPath>
    ) => void;
    const middlewares = mws as unknown as Middleware[];

    const subRouter = new Router<FullPath>(
      joinPaths(this.basePath, path) as FullPath
    );

    subRouter.middlewares.push(...this.middlewares, ...middlewares);
    callback(subRouter);

    for (const route of subRouter.routes) {
      this.routes.push(route);
    }

    for (const subPath in subRouter.pathMiddlewares) {
      const fullPath = `${this.basePath}${path}${subPath}`;

      if (!this.pathMiddlewares[fullPath]) {
        this.pathMiddlewares[fullPath] = [];
      }

      this.pathMiddlewares[fullPath].push(
        ...subRouter.pathMiddlewares[subPath]
      );
    }
  }

  public onError(onError: OnError) {
    this._onError = onError;
  }

  public onNotFound(onNotFound: OnNotFound) {
    this._onNotFound = onNotFound;
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
    const pathStart = req.url.indexOf('/', req.url.indexOf('://') + 3);
    const pathname = req.url.slice(pathStart).split('?')[0];
    const found = this.match(req.method, pathname);

    if (!found) {
      if (this._onNotFound) {
        return this._onNotFound(new Context(req, {}));
      }

      return new Response('Not Found', { status: 404 });
    }

    return composer({
      request: req,
      middlewares: this.composedMiddlewares[found.route.path],
      onError: this._onError,
      params: found.params,
      route: found.route,
    });
  }

  public fetch = (req: Request) => {
    return this.handle(req);
  };

  public listen(options?: Omit<ServeOptions, 'fetch'>) {
    return Bun.serve({
      fetch: this.fetch,
      ...options,
    });
  }
}
