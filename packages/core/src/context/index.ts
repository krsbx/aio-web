import { StatusCode } from './constants';
import { ContextCookie } from './cookie';
import { ContextRequest } from './request';

export class Context<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unnecessary-type-constraint
  Values extends any = any,
  Params extends Record<string, string> = NonNullable<unknown>,
  Query extends Record<string, string> = NonNullable<unknown>,
  State extends Record<string, unknown> = NonNullable<unknown>,
> {
  public readonly request: Request;

  private _state: State;
  private _status: StatusCode;
  private _headers: Headers | undefined;
  private _cookie: ContextCookie | null;
  private _req: ContextRequest<Values, Params, Query>;
  private _res: Response | null;

  public constructor(request: Request, params: Params) {
    this.request = request;
    this._state = {} as State;
    this._status = StatusCode.OK;
    this._headers = undefined;
    this._cookie = null;
    this._req = new ContextRequest<Values, Params, Query>(request, params);
    this._res = null;
  }

  public get req() {
    return this._req;
  }

  public get cookie() {
    if (!this._cookie) {
      this._cookie = new ContextCookie(this);
    }

    return this._cookie;
  }

  public set res(res: Response | null) {
    this._res = res;
  }

  public get res() {
    if (!this._res) this._res = this.body(null);

    return this._res;
  }

  /**
   * Append response headers by default
   */
  public header(key: string, value: string): Context;
  /**
   * Specify to append the response headers
   */
  public header(key: string, value: string, append: true): Context;
  /**
   * Prevent appending the response headers
   */
  public header(key: string, value: string, append: false): Context;
  public header(key: string, value: string, append = true) {
    if (!this._headers) {
      this._headers = new Headers();
    }

    if (append) {
      this._headers.append(key, value);
    } else {
      this._headers.set(key, value);
    }

    return this;
  }

  public status(status: StatusCode) {
    this._status = status;

    return this;
  }

  public set<
    Key extends string,
    Value,
    FinalState extends State & { [K in Key]: Value },
  >(key: Key, value: Value) {
    this._state = {
      ...this._state,
      [key]: value,
    } as FinalState;

    return this as unknown as Context<FinalState, Params>;
  }

  public get<Key extends keyof State, Value extends State[Key]>(key: Key) {
    return this._state[key] as Value;
  }

  public body(value: BodyInit | null): Response;
  public body(value: BodyInit | null, contentType: string): Response;
  public body(value: BodyInit | null, contentType?: string) {
    if (contentType) {
      this.header('Content-Type', contentType, false);
    }

    return new Response(value, {
      status: this._status,
      headers: this._headers,
    });
  }

  public text(value: string) {
    return this.body(value, 'text/plain');
  }

  public json<Value>(value: Value) {
    return this.body(JSON.stringify(value), 'application/json');
  }

  public html(value: string) {
    return this.body(value, 'text/html');
  }

  public noContent() {
    this.status(StatusCode.NO_CONTENT);

    return this.body(null);
  }

  public notFound(): Response;
  public notFound(message: string): Response;
  public notFound(message?: string) {
    this.status(StatusCode.NOT_FOUND);

    return this.json({
      message: message ?? 'Not Found',
    });
  }

  public redirect(url: string): Response;
  public redirect(url: string, statusCode: StatusCode): Response;
  public redirect(url: string, statusCode?: StatusCode) {
    this.status(statusCode ?? StatusCode.MOVED_PERMANENTLY);
    this.header('Location', url);

    return new Response(null, {
      status: this._status,
      headers: this._headers,
    });
  }
}
