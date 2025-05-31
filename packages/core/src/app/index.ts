import { Context } from '../context';
import { InternalServerError, NotFound } from '../context/constants';
import { Router } from '../router';
import { extractRegisteredPathParts } from '../utilities';
import { mwComposer } from './composer';
import { ApiMethods, type ApiMethod } from './constants';
import type {
  ListenOptions,
  NativeRoutes,
  OnError,
  OnNotFound,
  ReqHandlerOptions,
} from './types';

export class Ignisia<BasePath extends string> extends Router<BasePath> {
  protected _onError: OnError | null;
  protected _onNotFound: OnNotFound | null;

  public constructor(basePath: BasePath = '' as BasePath) {
    super(basePath);

    this._onError = null;
    this._onNotFound = null;
  }

  public match(method: ApiMethod, parts: string[]) {
    return this.routesTree.match(parts, method);
  }

  public onError(onError: OnError) {
    this._onError = onError;
  }

  public onNotFound(onNotFound: OnNotFound) {
    this._onNotFound = onNotFound;
  }

  private async reqHandler(options: ReqHandlerOptions) {
    const ctx = new Context(options.req, {});

    try {
      let mwRes = await mwComposer({
        middlewares: this.middlewares,
        ctx,
      });

      if (mwRes) return mwRes;

      const found = options.route
        ? {
            route: options.route,
            params: 'params' in options.req ? options.req.params : {},
          }
        : options.extractParams
          ? this.match(
              options.method,
              extractRegisteredPathParts(options.req.url)
            )
          : null;

      if (!found) {
        if (this._onNotFound) {
          return this._onNotFound(ctx);
        }

        return NotFound;
      }

      ctx.setParams(found.params);

      mwRes = await mwComposer({
        middlewares: found.route.middlewares,
        ctx,
      });

      if (mwRes) return mwRes;

      const res = await found.route.handler(ctx);
      ctx.res = res;

      return ctx.res;
    } catch (error) {
      if (this._onError) {
        return this._onError(error, ctx);
      }

      return InternalServerError;
    }
  }

  public async handle(req: Request): Promise<Response> {
    const ctx = new Context(req, {});

    try {
      const parts = extractRegisteredPathParts(req.url);

      let mwRes = await mwComposer({
        middlewares: this.middlewares,
        ctx,
      });

      if (mwRes) return mwRes;

      const found = this.match(req.method as ApiMethod, parts);

      if (!found) {
        if (this._onNotFound) {
          return this._onNotFound(ctx);
        }

        return NotFound;
      }

      ctx.setParams(found.params);

      mwRes = await mwComposer({
        middlewares: found.route.middlewares,
        ctx,
      });

      if (mwRes) return mwRes;

      const res = await found.route.handler(ctx);
      ctx.res = res;

      return ctx.res;
    } catch (error) {
      if (this._onError) {
        return this._onError(error, ctx);
      }

      return InternalServerError;
    }
  }

  public bunRoutes() {
    const routes: NativeRoutes = {};

    for (const route of this.routes) {
      const path = route.path.startsWith('/') ? route.path : `/${route.path}`;

      if (!routes[path]) routes[path] = {};

      ApiMethods.forEach((method) => {
        routes[path][method] = async (req) => {
          const ctx = new Context(req, {});
          const found = route.method === method;

          try {
            let mwRes = await mwComposer({
              middlewares: this.middlewares,
              ctx,
            });

            if (mwRes) return mwRes;

            if (!found) {
              if (this._onNotFound) {
                return this._onNotFound(ctx);
              }

              return NotFound;
            }

            ctx.setParams(req.params);

            mwRes = await mwComposer({
              middlewares: route.middlewares,
              ctx,
            });

            if (mwRes) return mwRes;

            const res = await route.handler(ctx);
            ctx.res = res;

            return ctx.res;
          } catch (error) {
            if (this._onError) {
              return this._onError(error, ctx);
            }

            return InternalServerError;
          }
        };
      });
    }

    return routes;
  }

  public fetch = (req: Request) => {
    return this.handle(req);
  };

  /**
   * Listen on the specified port, defaulting to 3000
   * By default will use Bun's routes instead of fetch
   */
  public listen({
    routes: isWithRoutes = true,
    ...options
  }: ListenOptions = {}) {
    return Bun.serve({
      routes: isWithRoutes ? this.bunRoutes() : undefined,
      fetch: isWithRoutes ? undefined : this.fetch,
      ...options,
    });
  }
}
