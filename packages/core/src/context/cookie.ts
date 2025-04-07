import type { Context } from '.';
import type { CookieOptions } from './types';

export class ContextCookie {
  private _ctx: Context;
  private _cookie: Record<
    string,
    {
      value: string;
      options: Partial<CookieOptions>;
    }
  >;

  public constructor(ctx: Context) {
    this._ctx = ctx;
    this._cookie = Object.create(null);
  }

  public get(key: string) {
    return this._cookie[key];
  }

  /**
   * Set the cookie on the headers
   */
  public set(key: string, value: string): void;
  /**
   * Set the cookie on the headers with the given options
   */
  public set(key: string, value: string, options: Partial<CookieOptions>): void;
  /**
   * Set the cookie on the headers with the given options
   */
  public set(
    key: string,
    value: string,
    options: Partial<CookieOptions>,
    set: true
  ): void;
  /**
   * Set the cookie on the headers with the given options, set = false means dont track the changes
   */
  public set(
    key: string,
    value: string,
    options: Partial<CookieOptions>,
    set: false
  ): void;
  public set(
    key: string,
    value: string,
    options: Partial<CookieOptions> = {},
    set: boolean = true
  ) {
    if (set) {
      this._cookie[key] = {
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

    this._ctx.header('Set-Cookie', parts.join('; '));
  }

  public delete(key: string) {
    delete this._cookie[key];

    this.set(key, '', {}, false);
  }
}
