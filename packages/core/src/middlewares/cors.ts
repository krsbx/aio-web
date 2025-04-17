import { ApiMethod, ApiMethods } from '../app/constants';
import type { Handler, Middleware } from '../router/types';

interface CORSOptions {
  origin?: string | string[] | ((origin: string | null) => string | false);
  allowMethods?: (ApiMethod | (string & {}))[];
  allowHeaders?: string[];
  exposeHeaders?: string[];
  credentials?: boolean;
  maxAge?: number;
}

export function cors(options: CORSOptions = {}): Middleware | Handler {
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
    let resolvedOrigin: string | false = '*';

    if (typeof origin === 'function') {
      resolvedOrigin = origin(reqOrigin);
    } else if (Array.isArray(origin)) {
      resolvedOrigin = origin.includes(reqOrigin || '')
        ? reqOrigin || ''
        : false;
    } else {
      resolvedOrigin = origin;
    }

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
      ctx.res!.headers.set(
        'Access-Control-Expose-Headers',
        exposeHeaders.join(',')
      );
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
