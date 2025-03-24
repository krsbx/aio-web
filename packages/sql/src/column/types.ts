import type { Dialect } from '../table/constants';
import type { AcceptedColumnTypes } from './constants';

export interface ColumnDefinition<T, U extends Dialect | null = null> {
  primaryKey: boolean;
  autoIncrement: boolean;
  notNull: boolean;
  unique: boolean;
  comment: string | null;
  default: T | undefined;
  dialect: U | null;
}

export type ValueSelector<
  Definition extends
    | Partial<ColumnDefinition<Value, Dialect>>
    | ColumnDefinition<Value, Dialect>,
  Value,
> = Definition['notNull'] extends true ? Value | string : Value | string | null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AcceptedColumnTypeMap<T = any> = {
  [K in AcceptedColumnTypes]: K extends
    | typeof AcceptedColumnTypes.INTEGER
    | typeof AcceptedColumnTypes.BIGINT
    | typeof AcceptedColumnTypes.FLOAT
    | typeof AcceptedColumnTypes.DOUBLE
    | typeof AcceptedColumnTypes.DECIMAL
    | typeof AcceptedColumnTypes.SERIAL
    ? number
    : K extends
          | typeof AcceptedColumnTypes.STRING
          | typeof AcceptedColumnTypes.TEXT
          | typeof AcceptedColumnTypes.VARCHAR
      ? string
      : K extends typeof AcceptedColumnTypes.BOOLEAN
        ? boolean
        : K extends
              | typeof AcceptedColumnTypes.DATE
              | typeof AcceptedColumnTypes.TIME
              | typeof AcceptedColumnTypes.TIMESTAMP
              | typeof AcceptedColumnTypes.DATETIME
              | typeof AcceptedColumnTypes.DATEONLY
          ? Date // Corrected to `Date` type
          : K extends typeof AcceptedColumnTypes.JSON
            ? object
            : K extends typeof AcceptedColumnTypes.BLOB
              ? Buffer
              : K extends typeof AcceptedColumnTypes.ENUM
                ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-expect-error
                  T[number][]
                : never;
};

export type DateOptions = {
  type:
    | typeof AcceptedColumnTypes.DATE
    | typeof AcceptedColumnTypes.TIME
    | typeof AcceptedColumnTypes.TIMESTAMP
    | typeof AcceptedColumnTypes.DATETIME
    | typeof AcceptedColumnTypes.DATEONLY;
};

export type NumberOptions<Length extends number = number> = {
  type:
    | typeof AcceptedColumnTypes.INTEGER
    | typeof AcceptedColumnTypes.BIGINT
    | typeof AcceptedColumnTypes.FLOAT
    | typeof AcceptedColumnTypes.DECIMAL
    | typeof AcceptedColumnTypes.DOUBLE
    | typeof AcceptedColumnTypes.SERIAL;
  length?: Length;
};

export type StringOptions<Length extends number = number> = {
  type:
    | typeof AcceptedColumnTypes.STRING
    | typeof AcceptedColumnTypes.VARCHAR
    | typeof AcceptedColumnTypes.TEXT;
  length?: Length;
};

export type EnumOptions<Values extends readonly string[]> = {
  type: typeof AcceptedColumnTypes.ENUM;
  values: Values;
};

export type BooleanOptions = {
  type: typeof AcceptedColumnTypes.BOOLEAN;
};

export type JsonOptions = {
  type: typeof AcceptedColumnTypes.JSON;
};

export type BlobOptions = {
  type: typeof AcceptedColumnTypes.BLOB;
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
