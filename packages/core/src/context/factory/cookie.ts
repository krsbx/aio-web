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
  set(key: string, value: string): void;
  /**
   * Set the cookie on the headers with the given options
   */
  set(key: string, value: string, options: Partial<CookieOptions>): void;
  /**
   * Set the cookie on the headers with the given options
   */
  set(
    key: string,
    value: string,
    options: Partial<CookieOptions>,
    set: true
  ): void;
  /**
   * Set the cookie on the headers with the given options, set = false means dont track the changes
   */
  set(
    key: string,
    value: string,
    options: Partial<CookieOptions>,
    set: false
  ): void;

  delete(key: string): void;
}

export function createContextCookie(ctx: Context) {
  const cookie: Record<
    string,
    {
      value: string;
      options: Partial<CookieOptions>;
    }
  > = {};

  const cookieCtx = {
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

      const parts = [`${key}=${encodeURIComponent(value)}`];
      if (options.Path) parts.push(`Path=${options.Path}`);
      if (options.HttpOnly) parts.push('HttpOnly');
      if (options.Secure) parts.push('Secure');
      if (options.SameSite) parts.push(`SameSite=${options.SameSite}`);
      if (typeof options.MaxAge === 'number')
        parts.push(`Max-Age=${options.MaxAge}`);
      if (options.Expires instanceof Date)
        parts.push(`Expires=${options.Expires.toUTCString()}`);

      ctx.header('Set-Cookie', parts.join('; '));
    },
    delete(key) {
      delete cookie[key];

      this.set(key, '', {}, false);
    },
  } satisfies ContextCookie;

  return cookieCtx;
}
