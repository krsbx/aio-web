import type { BunRequest } from 'bun';
import { Context } from '../context';
import { Router } from '../router';
import { composer } from './composer';
import type { AppHelperContract } from './contract';
import { match } from './helper';
import type { ListenOptions, NativeRoutes, OnError, OnNotFound } from './types';

export class Ignisia<BasePath extends string> extends Router<BasePath> {
  protected _onError: OnError | null;
  protected _onNotFound: OnNotFound | null;

  public match: AppHelperContract<BasePath>['match'];

  public constructor(basePath: BasePath = '' as BasePath) {
    super(basePath);

    this._onError = null;
    this._onNotFound = null;
    this.match = match.bind(this);
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
      req.url.slice(pathStart).split('?')[0]!.replace(/\/+$/, '') || '/';
    const found = this.match(req.method, pathname);

    if (!found) {
      if (this._onNotFound) {
        return this._onNotFound(new Context(req, {}));
      }

      return new Response('Not Found', { status: 404 });
    }

    return composer({
      request: req,
      middlewares: this.composedMiddlewares[found.route.path]!,
      onError: this._onError,
      params: found.params,
      route: found.route,
    });
  }

  public bunRoutes() {
    const routes: NativeRoutes = {};

    for (const route of this.routes) {
      if (!routes[route.path]) routes[route.path] = {};

      routes[route.path][route.method] = async (req: BunRequest) =>
        composer({
          request: req,
          middlewares: this.composedMiddlewares[route.path]!,
          onError: this._onError,
          params: req.params,
          route: route,
        });
    }

    return routes;
  }

  public fetch = (req: Request) => {
    return this.handle(req);
  };

  /**
   * Listen on the specified port, defaulting to 3000
   * By default will use Bun's fetch instead of routes
   */
  public listen({
    routes: isWithRoutes = false,
    ...options
  }: ListenOptions = {}) {
    return Bun.serve({
      routes: isWithRoutes ? this.bunRoutes() : undefined,
      fetch: isWithRoutes ? undefined : this.fetch,
      ...options,
    });
  }
}
