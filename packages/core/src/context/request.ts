import type { BunRequest } from 'bun';
import type { ContextCache, ParsedForm } from './types';
import { parseFormData, parseQuery } from './parser';

export class ContextRequest<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unnecessary-type-constraint
  Values extends any = any,
  Params extends Record<string, string> = NonNullable<unknown>,
  Query extends Record<string, string> = NonNullable<unknown>,
> {
  private _request: BunRequest;
  private _url: URL;
  private _params: Params;
  private _cache: Partial<ContextCache<Values>>;
  private _query: Query;

  public constructor(request: BunRequest) {
    this._request = request;
    this._params = request.params as Params;
    this._url = new URL(request.url);
    this._cache = {} as Partial<ContextCache<Values>>;
    this._query = parseQuery(this._url.searchParams) as Query;
  }

  public params(): Params;
  public params<K extends keyof Params>(key: K): Params[K];
  public params<K extends keyof Params>(key?: K) {
    if (key) return this._params[key];

    return this._params;
  }

  public query(): Query;
  public query<K extends keyof Query>(key: K): Query[K];
  public query<K extends keyof Query>(key?: K) {
    if (key) return this._query[key];

    return this._query;
  }

  public async json(): Promise<Values> {
    if (!this._cache.json) {
      this._cache.json = await this._request.json();
    }

    return this._cache.json!;
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    FinalValue extends Values extends Record<string, any>
      ? ParsedForm<Values>
      : never,
  >(): Promise<FinalValue>;
  public async formData(raw: true): Promise<FormData>;
  public async formData<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  public get url() {
    return this._url.toString();
  }

  public get method() {
    return this._request.method;
  }
}
