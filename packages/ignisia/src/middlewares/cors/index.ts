import { ApiMethods } from '../../app/constants';
import type { Middleware } from '../../router/types';
import type { CORSOptions } from './types';
import { resolveOrigin } from './utilities';

export function cors(options: CORSOptions = {}): Middleware {
  const {
    origin = '*',
    allowMethods = ApiMethods,
    allowHeaders = [],
    exposeHeaders = [],
    credentials = false,
    maxAge,
  } = options;

  return async (ctx, next) => {
    const reqOrigin = ctx.req.header('origin');
    const resolvedOrigin = resolveOrigin(origin, reqOrigin);

    if (resolvedOrigin) {
      ctx.header('Access-Control-Allow-Origin', resolvedOrigin);
    }

    if (credentials) {
      ctx.header('Access-Control-Allow-Credentials', 'true');
    }

    if (allowMethods.length) {
      ctx.header('Access-Control-Allow-Origin', allowMethods.join(','));
    }

    if (allowHeaders.length) {
      ctx.header('Access-Control-Allow-Headers', allowHeaders.join(','));
    }

    if (exposeHeaders.length) {
      ctx.header('Access-Control-Expose-Headers', exposeHeaders.join(','));
    }

    if (typeof maxAge === 'number') {
      ctx.header('Access-Control-Max-Age', maxAge.toString());
    }

    if (ctx.req.method === 'OPTIONS') {
      return ctx.noContent();
    }

    await next();
  };
}
