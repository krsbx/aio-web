import { generateHeaderEntries } from '../../utilities';
import { StatusCode } from '../constants';
import { createContextCookie } from './cookie';
import { createContextRequest } from './request';

export interface Context<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unnecessary-type-constraint
  Values extends any = any,
  Params extends Record<string, string> = NonNullable<unknown>,
  Query extends Record<string, string> = NonNullable<unknown>,
  State extends Record<string, unknown> = NonNullable<unknown>,
> {
  get req(): ReturnType<typeof createContextRequest<Values, Params, Query>>;
  get cookie(): ReturnType<typeof createContextCookie>;
  get res(): Response | null;
  set res(newRes: Response | null);
  get<Key extends keyof State, Value extends State[Key]>(key: Key): Value;
  set<Key extends string, Value>(key: Key, value: Value): this;
  /**
   * Append response headers by default
   */
  header(key: string, value: string): this;
  /**
   * Specify to append the response headers
   */
  header(key: string, value: string, append: true): this;
  /**
   * Prevent appending the response headers
   */
  header(key: string, value: string, append: false): this;
  status(newStatus: StatusCode): this;

  body(value: BodyInit | null): Response;
  body(value: BodyInit | null, contentType: string): Response;

  text(value: string): Response;
  json<Value>(value: Value): Response;
  html(value: string): Response;
  noContent(): Response;

  notFound(): Response;
  notFound(message: string): Response;

  redirect(url: string): Response;
  redirect(url: string, statusCode: StatusCode): Response;
}

export function createContext<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unnecessary-type-constraint
  Values extends any = any,
  Params extends Record<string, string> = NonNullable<unknown>,
  Query extends Record<string, string> = NonNullable<unknown>,
  State extends Record<string, unknown> = NonNullable<unknown>,
>(request: Request, params: Params) {
  let state = {} as State;
  let status: StatusCode = StatusCode.OK;
  let headers: Record<string, string[]> | null = null;
  let cookie: ReturnType<typeof createContextCookie> | null = null;
  let req: ReturnType<
    typeof createContextRequest<Values, Params, Query>
  > | null = null;
  let res: Response | null = null;

  const ctx: Context<Values, Params, Query, State> = {
    get req() {
      if (!req) {
        req = createContextRequest<Values, Params, Query>(request, params);
      }

      return req;
    },
    get cookie() {
      if (!cookie) {
        cookie = createContextCookie(this);
      }

      return cookie;
    },
    set res(newRes) {
      res = newRes;
    },
    get res() {
      if (!res) {
        res = new Response('404 Not Found', {
          status: StatusCode.NOT_FOUND,
        });
      }

      return res;
    },
    header(key, value, append: boolean = true) {
      if (!headers) headers = {};

      if (append) {
        if (!headers[key]) headers[key] = [];

        headers[key].push(value);
      } else {
        headers[key] = [value];
      }

      return this;
    },
    status(newStatus) {
      status = newStatus;

      return this;
    },
    set(key, value) {
      state = {
        ...state,
        [key]: value,
      };

      return this;
    },
    get<Key extends keyof State, Value extends State[Key]>(key: Key) {
      return state[key] as Value;
    },
    body(value, contentType?: string) {
      if (contentType) {
        this.header('Content-Type', contentType, false);
      }

      return new Response(value, {
        status,
        headers: headers ? generateHeaderEntries(headers) : undefined,
      });
    },
    text(value) {
      return this.body(value, 'text/plain');
    },
    json(value) {
      return this.body(JSON.stringify(value), 'application/json');
    },
    html(value) {
      return this.body(value, 'text/html');
    },
    noContent() {
      this.status(StatusCode.NO_CONTENT);

      return this.body(null);
    },
    notFound(message?: string) {
      this.status(StatusCode.NOT_FOUND);

      return this.text(message ?? '404 Not Found');
    },
    redirect(url, statusCode?: StatusCode) {
      this.status(statusCode ?? StatusCode.MOVED_PERMANENTLY);
      this.header('Location', url);

      return this.body(null);
    },
  };

  return ctx;
}
