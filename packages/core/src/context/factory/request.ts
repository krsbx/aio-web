/* eslint-disable @typescript-eslint/no-explicit-any */
import { parseCookies, parseFormData, parseQuery } from '../parser';
import type { ContextCache, ParsedForm } from '../types';

export interface CookieRequest<
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
  Values extends any = any,
  Params extends Record<string, string> = NonNullable<unknown>,
  Query extends Record<string, string> = NonNullable<unknown>,
> {
  params(): Params;
  params<
    K extends keyof Params | (string & {}),
    V extends K extends keyof Params ? Params[K] : string,
  >(
    key: K
  ): V;

  query(): Query;
  query<
    K extends keyof Query | (string & {}),
    V extends K extends keyof Query ? Query[K] : string,
  >(
    key: K
  ): V;

  json<T extends Values = any>(): Promise<T>;
  text(): Promise<string>;
  arrayBuffer(): Promise<ArrayBuffer>;
  blob(): Promise<Blob>;

  formData(): Promise<ParsedForm>;
  formData(raw: true): Promise<FormData>;

  cookies(): Record<string, string>;
  cookies(key: string): string;

  get url(): URL;
  get method(): string;
}

export function createContextRequest<
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
  Values extends any = any,
  Params extends Record<string, string> = NonNullable<unknown>,
  Query extends Record<string, string> = NonNullable<unknown>,
>(request: Request, params: Params) {
  const cache: Partial<ContextCache<Values>> = {};
  let url: URL | null = null;
  let query: Query | null = null;

  const ctxReq = {
    params<
      K extends keyof Params | (string & {}),
      V extends K extends keyof Params ? Params[K] : string,
    >(key?: K) {
      if (key) {
        return params[key] as V;
      }

      return params;
    },
    query<
      K extends keyof Query | (string & {}),
      V extends K extends keyof Query ? Query[K] : string,
    >(key?: K) {
      if (!query) query = parseQuery(this.url.searchParams) as Query;

      if (key) {
        return query[key] as V;
      }

      return query;
    },
    async json<T extends Values = any>() {
      if (!cache.json) cache.json = await request.json();

      return cache.json as T;
    },
    async text() {
      if (!cache.text) cache.text = await request.text();

      return cache.text;
    },
    async arrayBuffer() {
      if (!cache.arrayBuffer) cache.arrayBuffer = await request.arrayBuffer();

      return cache.arrayBuffer;
    },
    async blob() {
      if (!cache.blob) cache.blob = await request.blob();

      return cache.blob;
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    async formData<
      FinalValue extends Values extends Record<string, any>
        ? ParsedForm<Values>
        : never,
    >(raw: boolean = false) {
      if (!cache.formData) {
        cache.formData = await request.formData();
      }

      if (raw) return cache.formData;

      if (!cache.parsedForm) {
        cache.parsedForm = parseFormData(cache.formData) as FinalValue;
      }

      return cache.parsedForm;
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    cookies(key?: string) {
      if (!cache.cookies) {
        cache.cookies = parseCookies(request.headers.get('cookie'));
      }

      if (key) {
        return cache.cookies[key];
      }

      return cache.cookies;
    },
    get url() {
      if (!url) url = new URL(request.url);

      return url;
    },
    get method() {
      return request.method;
    },
  } satisfies CookieRequest<Values, Params, Query>;

  return ctxReq;
}
