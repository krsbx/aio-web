import type { ServeOptions } from 'bun';
import { Context } from '../context';
import { composer } from './composer';
import type { RouterHelperContract } from './contract';
import { match, register } from './helper';
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
  public readonly staticRoutes: Route[];
  public readonly staticRoutesMap: Map<string, Route>;
  public readonly dynamicRoutes: Route[];
  public readonly wildcardRoutes: Route[];

  private middlewares: Middleware[];
  private _onError: OnError | null;
  private _onNotFound: OnNotFound | null;

  private pathMiddlewares: Record<string, Middleware[]>;
  public composedMiddlewares: Record<string, Middleware[]>;

  public match: RouterHelperContract<BasePath>['match'];
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
    this._onError = null;
    this._onNotFound = null;

    this.match = match.bind(this);
    this.register = register.bind(this);
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
    const callback = mws.pop() as (router: Router<FullPath>) => void;
    const middlewares = mws as unknown as Middleware[];

    const fullPath = joinPaths(this.basePath, path) as FullPath;
    const subRouter = new Router(fullPath);

    subRouter.middlewares.push(...this.middlewares, ...middlewares);

    callback(subRouter);

    for (const route of subRouter.routes) {
      this.register(
        route.method,
        route.path.replace(fullPath, ''), // strip off base path
        route.handler,
        route.middleware
      );
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

  public get routes() {
    return [
      ...this.staticRoutes,
      ...this.dynamicRoutes,
      ...this.wildcardRoutes,
    ];
  }

  public onError(onError: OnError) {
    this._onError = onError;
  }

  public onNotFound(onNotFound: OnNotFound) {
    this._onNotFound = onNotFound;
  }

  public async handle(req: Request): Promise<Response> {
    const pathStart = req.url.indexOf('/', req.url.indexOf('://') + 3);

    const pathname =
      req.url.slice(pathStart).split('?')[0].replace(/\/+$/, '') || '/';
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
