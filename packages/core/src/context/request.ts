/* eslint-disable @typescript-eslint/no-explicit-any */
import { parseCookies, parseFormData, parseQuery } from './parser';
import type { ContextCache, ParsedForm } from './types';

export class ContextRequest<
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
  Values extends any = any,
  Params extends Record<string, string> = NonNullable<unknown>,
  Query extends Record<string, string | string[]> = NonNullable<unknown>,
> {
  private _request: Request;
  private _url: URL | null;
  private _params: Params;
  private _cache: Partial<ContextCache<Values>>;
  private _query: Query | null;

  public constructor(request: Request, params: Params) {
    this._request = request;
    this._params = params;
    this._url = null;
    this._cache = {};
    this._query = null;
  }

  public param(): Params;
  public param<
    K extends keyof Params | (string & {}),
    V extends K extends keyof Params ? Params[K] : string,
  >(key: K): V;
  public param<K extends keyof Params | (string & {})>(key?: K) {
    if (key) return this._params[key];

    return this._params;
  }

  public query(): Query;
  public query<
    K extends keyof Query | (string & {}),
    V extends K extends keyof Query ? Query[K] | null : string | null,
  >(key: K): V;
  public query<K extends keyof Query | (string & {})>(key?: K) {
    if (!this._query) {
      this._query = parseQuery(this.url.searchParams) as Query;
    }

    if (key) return this._query[key] || null;

    return this._query;
  }

  public header(): Record<string, string>;
  public header(key: string): string | null;
  public header(key?: string) {
    if (key) {
      if (this._cache.headers) {
        return this._cache.headers[key.toLowerCase()] || null;
      }

      return this._request.headers.get(key);
    }

    if (!this._cache.headers) {
      this._cache.headers = {};

      for (const [key, value] of this._request.headers.entries()) {
        this._cache.headers[key.toLowerCase()] = value;
      }
    }

    return this._cache.headers;
  }

  public async json<T extends Values = any>(): Promise<T> {
    if (!this._cache.json) {
      this._cache.json = await this._request.json();
    }

    return this._cache.json as T;
  }

  public async text(): Promise<string> {
    if (!this._cache.text) {
      this._cache.text = await this._request.text();
    }

    return this._cache.text;
  }

  public async arrayBuffer(): Promise<ArrayBuffer> {
    if (!this._cache.arrayBuffer) {
      this._cache.arrayBuffer = await this._request.arrayBuffer();
    }

    return this._cache.arrayBuffer;
  }

  public async blob(): Promise<Blob> {
    if (!this._cache.blob) {
      this._cache.blob = await this._request.blob();
    }

    return this._cache.blob;
  }

  public async formData<
    T extends Values = any,
    FinalValue extends T extends Record<string, any>
      ? ParsedForm<T>
      : never = T extends Record<string, any> ? ParsedForm<T> : never,
  >(): Promise<FinalValue>;
  public async formData(raw: true): Promise<FormData>;
  public async formData<
    FinalValue extends Values extends Record<string, any>
      ? ParsedForm<Values>
      : never,
  >(raw?: boolean) {
    if (!this._cache.formData) {
      this._cache.formData = await this._request.formData();
    }

    if (raw) return this._cache.formData;

    if (!this._cache.parsedForm) {
      this._cache.parsedForm = parseFormData(
        this._cache.formData
      ) as FinalValue;
    }

    return this._cache.parsedForm as FinalValue;
  }

  public cookies(): Record<string, string>;
  public cookies(key: string): string;
  public cookies(key?: string) {
    if (!this._cache.cookies) {
      this._cache.cookies = parseCookies(this._request.headers.get('cookie'));
    }

    if (key) {
      return this._cache.cookies[key];
    }

    return this._cache.cookies;
  }

  public get url() {
    if (!this._url) {
      this._url = new URL(this._request.url);
    }

    return this._url;
  }

  public get method() {
    return this._request.method;
  }
}
