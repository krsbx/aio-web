export type ParsedFormValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | File;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ParsedForm<T extends Record<string, any> = Record<string, any>> = {
  [K in keyof T]: T[K] extends ParsedFormValue[]
    ? T[K][]
    : T[K] extends object
      ? ParsedForm<T[K]>
      : T[K];
};

export type ParsedQueryValue = string | number | boolean | null | undefined;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ParsedQuery<T extends Record<string, any> = Record<string, any>> = {
  [K in keyof T]: T[K] extends ParsedQueryValue[]
    ? T[K][]
    : T[K] extends object
      ? ParsedQuery<T[K]>
      : T[K];
};

export type ExtractPathParams<Path extends string> =
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Path extends `${infer Start}:${infer Param}/${infer Rest}`
    ? {
        [K in Param | keyof ExtractPathParams<`/${Rest}`>]: string;
      }
    : // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Path extends `${infer Start}:${infer Param}`
      ? {
          [K in Param]: string;
        }
      : NonNullable<unknown>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ContextCache<T = any> = {
  text: string;
  json: T;
  arrayBuffer: ArrayBuffer;
  formData: FormData;
  blob: Blob;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parsedForm: T extends Record<string, any> ? ParsedForm<T> : never;
};
