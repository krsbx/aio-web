import type { ServeOptions } from 'bun';
import { Context } from '../context';
import { Router } from '../router';
import { composer } from './composer';
import type { AppHelperContract } from './contract';
import { match } from './helper';
import type { OnError, OnNotFound } from './types';

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
