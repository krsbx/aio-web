import type { ACCEPTED_COLUMN_TYPE } from './constants';

// Extract allowed column types from ACCEPTED_COLUMN_TYPE
export type AcceptedColumnTypes =
  (typeof ACCEPTED_COLUMN_TYPE)[keyof typeof ACCEPTED_COLUMN_TYPE];

// Define TypeScript equivalent types for each SQL column type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AcceptedColumnTypeMap<T = any> = {
  [K in AcceptedColumnTypes]: K extends
    | typeof ACCEPTED_COLUMN_TYPE.INTEGER
    | typeof ACCEPTED_COLUMN_TYPE.BIGINT
    | typeof ACCEPTED_COLUMN_TYPE.FLOAT
    | typeof ACCEPTED_COLUMN_TYPE.DOUBLE
    | typeof ACCEPTED_COLUMN_TYPE.DECIMAL
    ? number
    : K extends
          | typeof ACCEPTED_COLUMN_TYPE.STRING
          | typeof ACCEPTED_COLUMN_TYPE.TEXT
          | typeof ACCEPTED_COLUMN_TYPE.VARCHAR
      ? string
      : K extends typeof ACCEPTED_COLUMN_TYPE.BOOLEAN
        ? boolean
        : K extends
              | typeof ACCEPTED_COLUMN_TYPE.DATE
              | typeof ACCEPTED_COLUMN_TYPE.TIME
              | typeof ACCEPTED_COLUMN_TYPE.TIMESTAMP
              | typeof ACCEPTED_COLUMN_TYPE.DATETIME
              | typeof ACCEPTED_COLUMN_TYPE.DATEONLY
          ? Date // Corrected to `Date` type
          : K extends typeof ACCEPTED_COLUMN_TYPE.JSON
            ? object
            : K extends typeof ACCEPTED_COLUMN_TYPE.BLOB
              ? Buffer
              : K extends typeof ACCEPTED_COLUMN_TYPE.ENUM
                ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-expect-error
                  T[number][]
                : never;
};

export type DateOptions = {
  type:
    | typeof ACCEPTED_COLUMN_TYPE.DATE
    | typeof ACCEPTED_COLUMN_TYPE.TIME
    | typeof ACCEPTED_COLUMN_TYPE.TIMESTAMP
    | typeof ACCEPTED_COLUMN_TYPE.DATETIME
    | typeof ACCEPTED_COLUMN_TYPE.DATEONLY;
};

export type NumberOptions<Length extends number = number> = {
  type:
    | typeof ACCEPTED_COLUMN_TYPE.INTEGER
    | typeof ACCEPTED_COLUMN_TYPE.BIGINT
    | typeof ACCEPTED_COLUMN_TYPE.FLOAT
    | typeof ACCEPTED_COLUMN_TYPE.DECIMAL
    | typeof ACCEPTED_COLUMN_TYPE.DOUBLE;
  length?: Length;
};

export type StringOptions<Length extends number = number> = {
  type:
    | typeof ACCEPTED_COLUMN_TYPE.STRING
    | typeof ACCEPTED_COLUMN_TYPE.VARCHAR
    | typeof ACCEPTED_COLUMN_TYPE.TEXT;
  length?: Length;
};

export type EnumOptions<Values extends readonly string[]> = {
  type: typeof ACCEPTED_COLUMN_TYPE.ENUM;
  values: Values;
};

export type BooleanOptions = {
  type: typeof ACCEPTED_COLUMN_TYPE.BOOLEAN;
};

export type JsonOptions = {
  type: typeof ACCEPTED_COLUMN_TYPE.JSON;
};

export type BlobOptions = {
  type: typeof ACCEPTED_COLUMN_TYPE.BLOB;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ColumnOptions<T = any> =
  | DateOptions
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  | NumberOptions<T>
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  | StringOptions<T>
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  | EnumOptions<T>
  | BooleanOptions
  | JsonOptions
  | BlobOptions;
