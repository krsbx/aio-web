import type { RouterHelperContract } from './contract';
import { register } from './helper';
import type { ExtractPathParams, Handler, Middleware, Route } from './types';
import { joinPaths } from './utilities';

export class Router<BasePath extends string> {
  public basePath: BasePath;
  public readonly staticRoutes: Route[];
  public readonly staticRoutesMap: Map<string, Route>;
  public readonly dynamicRoutes: Route[];
  public readonly wildcardRoutes: Route[];
  public readonly middlewares: Middleware[];
  public readonly pathMiddlewares: Record<string, Middleware[]>;
  public readonly composedMiddlewares: Record<string, Middleware[]>;

  public register: RouterHelperContract<BasePath>['register'];

  public constructor(basePath: BasePath = '' as BasePath) {
    this.staticRoutes = [];
    this.staticRoutesMap = new Map();
    this.dynamicRoutes = [];
    this.wildcardRoutes = [];
    this.middlewares = [];
    this.pathMiddlewares = {};
    this.composedMiddlewares = {};
    this.basePath = basePath as BasePath;

    this.register = register.bind(this);
  }

  public use<
    Path extends string,
    FullPath extends `${BasePath}${Path}`,
    Values,
    Params extends ExtractPathParams<FullPath>,
    Query extends Record<string, string>,
    State extends Record<string, unknown>,
  >(...mws: Middleware<Values, Params, Query, State>[]): this;
  public use<
    Path extends string,
    FullPath extends `${BasePath}${Path}`,
    Values,
    Params extends ExtractPathParams<FullPath>,
    Query extends Record<string, string>,
    State extends Record<string, unknown>,
  >(path: Path, ...mws: Middleware<Values, Params, Query, State>[]): this;
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

    return this;
  }

  public get<
    Path extends string,
    FullPath extends `${BasePath}${Path}`,
    Values,
    Params extends ExtractPathParams<FullPath>,
    Query extends Record<string, string>,
    State extends Record<string, unknown>,
  >(path: Path, handler: Handler<Values, Params, Query, State>): this;
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
  ): this;
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

    return this.register('GET', path, handler, middleware);
  }

  public post<
    Path extends string,
    FullPath extends `${BasePath}${Path}`,
    Values,
    Params extends ExtractPathParams<FullPath>,
    Query extends Record<string, string>,
    State extends Record<string, unknown>,
  >(path: Path, handler: Handler<Values, Params, Query, State>): this;
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
  ): this;
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

    return this.register('POST', path, handler, middleware);
  }

  public put<
    Path extends string,
    FullPath extends `${BasePath}${Path}`,
    Values,
    Params extends ExtractPathParams<FullPath>,
    Query extends Record<string, string>,
    State extends Record<string, unknown>,
  >(path: Path, handler: Handler<Values, Params, Query, State>): this;
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
  ): this;
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

    return this.register('PUT', path, handler, middleware);
  }

  public patch<
    Path extends string,
    FullPath extends `${BasePath}${Path}`,
    Values,
    Params extends ExtractPathParams<FullPath>,
    Query extends Record<string, string>,
    State extends Record<string, unknown>,
  >(path: Path, handler: Handler<Values, Params, Query, State>): this;
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
  ): this;
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

    return this.register('PATCH', path, handler, middleware);
  }

  public delete<
    Path extends string,
    FullPath extends `${BasePath}${Path}`,
    Values,
    Params extends ExtractPathParams<FullPath>,
    Query extends Record<string, string>,
    State extends Record<string, unknown>,
  >(path: Path, handler: Handler<Values, Params, Query, State>): this;
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
  ): this;
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

    return this.register('DELETE', path, handler, middleware);
  }

  public options<
    Path extends string,
    FullPath extends `${BasePath}${Path}`,
    Values,
    Params extends ExtractPathParams<FullPath>,
    Query extends Record<string, string>,
    State extends Record<string, unknown>,
  >(path: Path, handler: Handler<Values, Params, Query, State>): this;
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
  ): this;
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

    return this.register('OPTIONS', path, handler, middleware);
  }

  public all<
    Path extends string,
    FullPath extends `${BasePath}${Path}`,
    Values,
    Params extends ExtractPathParams<FullPath>,
    Query extends Record<string, string>,
    State extends Record<string, unknown>,
  >(path: Path, handler: Handler<Values, Params, Query, State>): this;
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
  ): this;
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

    return this;
  }

  public route<Path extends string, FullPath extends `${BasePath}${Path}`>(
    path: Path,
    route: Router<Path>
  ): this {
    const fullPath = joinPaths(this.basePath, path) as FullPath;

    for (const subRoute of route.routes) {
      this.register(
        subRoute.method,
        subRoute.path.replace(fullPath, ''),
        subRoute.handler,
        subRoute.middleware
      );
    }

    for (const subPath in route.pathMiddlewares) {
      const fullPath = `${this.basePath}${path}${subPath}`;

      if (!this.pathMiddlewares[fullPath]) {
        this.pathMiddlewares[fullPath] = [];
      }

      this.pathMiddlewares[fullPath].push(...route.pathMiddlewares[subPath]);
    }

    return this;
  }

  public group<
    GroupPath extends string,
    FullPath extends `${BasePath}${GroupPath}`,
  >(path: GroupPath, router: (router: Router<FullPath>) => void): this;
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
  ): this;
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
  ): this {
    const callback = mws.pop() as (router: Router<FullPath>) => this;
    const middlewares = mws as unknown as Middleware[];

    const fullPath = joinPaths(this.basePath, path) as FullPath;
    const subRouter = new Router(fullPath);

    subRouter.middlewares.push(...this.middlewares, ...middlewares);

    callback(subRouter);

    return this.route(path as unknown as FullPath, subRouter);
  }

  public get routes() {
    return [
      ...this.staticRoutes,
      ...this.dynamicRoutes,
      ...this.wildcardRoutes,
    ];
  }
}
