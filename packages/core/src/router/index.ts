import { ApiMethod, ApiMethods } from '../app/constants';
import { extractPathPartsForRegister, joinPaths } from '../utilities';
import type { RouterHelperContract } from './contract';
import { register } from './helper';
import { TrieMiddlewareNode, TrieRouteNode } from './trie';
import type { ExtractPathParams, Handler, Middleware } from './types';

export class Router<BasePath extends string> {
  public basePath: BasePath;
  public readonly routesTree: TrieRouteNode;
  public readonly middlewares: Middleware[];
  public readonly pathMiddlewares: TrieMiddlewareNode;

  public register: RouterHelperContract<BasePath>['register'];

  public constructor(basePath: BasePath = '' as BasePath) {
    this.routesTree = new TrieRouteNode();

    this.middlewares = [];
    this.pathMiddlewares = new TrieMiddlewareNode();
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public use(...args: any[]) {
    if (typeof args[0] === 'string') {
      const path = joinPaths(this.basePath, args[0]);
      const parts = extractPathPartsForRegister(path);
      const mws = args.slice(1) as Middleware[];

      this.pathMiddlewares.insert(parts, mws);
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

    return this.register(ApiMethod.GET, path, handler, middleware);
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

    return this.register(ApiMethod.POST, path, handler, middleware);
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

    return this.register(ApiMethod.PUT, path, handler, middleware);
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

    return this.register(ApiMethod.PATCH, path, handler, middleware);
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

    return this.register(ApiMethod.DELETE, path, handler, middleware);
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

    return this.register(ApiMethod.OPTIONS, path, handler, middleware);
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

    for (const method of ApiMethods) {
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
        subRoute.middlewares
      );
    }

    for (const subPath in route.pathMiddlewares) {
      const fullPath = `${this.basePath}${path}${subPath}`;
      const parts = extractPathPartsForRegister(fullPath);

      this.pathMiddlewares.insert(parts, route.pathMiddlewares.collect(parts));
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
    return this.routesTree.collectRoutes(this.basePath);
  }
}
