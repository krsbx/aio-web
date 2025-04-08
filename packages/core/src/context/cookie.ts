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
    this._cookie = {};
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

    let str = `${key}=${encodeURIComponent(value)}`;
    if (options.Path) str += `; Path=${options.Path}`;
    if (options.HttpOnly) str += '; HttpOnly';
    if (options.Secure) str += '; Secure';
    if (options.SameSite) str += `; SameSite=${options.SameSite}`;
    if (typeof options.MaxAge === 'number')
      str += `; Max-Age=${options.MaxAge}`;
    if (options.Expires instanceof Date)
      str += `; Expires=${options.Expires.toUTCString()}`;

    this._ctx.header('Set-Cookie', str);
  }

  public delete(key: string) {
    delete this._cookie[key];

    this.set(key, '', {}, false);
  }
}
