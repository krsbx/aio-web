import type { CookieOptions } from '../types';
import type { Context } from './context';

export interface ContextCookie {
  get(key: string): {
    value: string;
    options: Partial<CookieOptions>;
  };

  /**
   * Set the cookie on the headers
   */
  set(key: string, value: string): this;
  /**
   * Set the cookie on the headers with the given options
   */
  set(key: string, value: string, options: Partial<CookieOptions>): this;
  /**
   * Set the cookie on the headers with the given options
   */
  set(
    key: string,
    value: string,
    options: Partial<CookieOptions>,
    set: true
  ): this;
  /**
   * Set the cookie on the headers with the given options, set = false means dont track the changes
   */
  set(
    key: string,
    value: string,
    options: Partial<CookieOptions>,
    set: false
  ): this;

  delete(key: string): this;
}

export function createContextCookie(ctx: Context) {
  const cookie: Record<
    string,
    {
      value: string;
      options: Partial<CookieOptions>;
    }
  > = {};

  const cookieCtx: ContextCookie = {
    get(key) {
      return cookie[key];
    },
    set(key, value, options: Partial<CookieOptions> = {}, set: boolean = true) {
      if (set) {
        cookie[key] = {
          value,
          options,
        };
      }

      let str = `${key}=${encodeURIComponent(value)}`;
      if (options.Path) str += `; Path=${options.Path}`;
      if (options.HttpOnly) str += '; HttpOnly';
      if (options.Secure) str += '; Secure';
      if (options.SameSite) str += `; SameSite=${options.SameSite}`;
      if (typeof options.MaxAge === 'number')
        str += `; Max-Age=${options.MaxAge}`;
      if (options.Expires instanceof Date)
        str += `; Expires=${options.Expires.toUTCString()}`;

      ctx.header('Set-Cookie', str);

      return this;
    },
    delete(key) {
      delete cookie[key];

      return this.set(key, '', {}, false);
    },
  };

  return cookieCtx;
}
