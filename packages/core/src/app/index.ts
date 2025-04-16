import { Context } from '../context';
import { Router } from '../router';
import { extractRegisteredPathParts } from '../utilities';
import { composer, mwComposer, wrapComposer } from './composer';
import type { ApiMethod } from './constants';
import type { ListenOptions, OnError, OnNotFound } from './types';

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

  public async handle(req: Request): Promise<Response> {
    const parts = extractRegisteredPathParts(req.url);
    const ctx = new Context(req, {});

    const restWrapper = wrapComposer(ctx, this._onError);

    if (this.middlewares.length) {
      const mwRes = await restWrapper(
        mwComposer({
          ctx,
          middlewares: this.middlewares,
        })
      );

      if (mwRes) return mwRes;
    }

    const found = this.match(req.method as ApiMethod, parts);

    if (!found) {
      if (this._onNotFound) {
        const ctx = new Context(req, {});

        return this._onNotFound(ctx);
      }

      return new Response('404 Not Found', { status: 404 });
    }

    ctx.setParams(found.params);

    return restWrapper(
      composer({
        middlewares: found.route.middlewares,
        route: found.route,
        ctx: ctx,
      })
    );
  }

  public fetch = (req: Request) => {
    return this.handle(req);
  };

  /**
   * Listen on the specified port, defaulting to 3000
   * By default will use Bun's routes instead of fetch
   */
  public listen(options: ListenOptions = {}) {
    return Bun.serve({
      fetch: this.fetch,
      ...options,
    });
  }
}
