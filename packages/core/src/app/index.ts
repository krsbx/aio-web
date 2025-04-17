import { Context } from '../context';
import { InternalServerError, NotFound } from '../context/constants';
import { Router } from '../router';
import { extractRegisteredPathParts } from '../utilities';
import { mwComposer } from './composer';
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
