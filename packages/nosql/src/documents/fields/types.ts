import type { Field } from '.';
import type { AcceptedColumnTypes } from './constants';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AcceptedColumnTypeMap<T = any> = {
  [K in AcceptedColumnTypes]: K extends typeof AcceptedColumnTypes.NUMBER
    ? number
    : K extends typeof AcceptedColumnTypes.STRING
      ? string
      : K extends typeof AcceptedColumnTypes.BOOLEAN
        ? boolean
        : K extends typeof AcceptedColumnTypes.TIMESTAMP
          ? number
          : K extends typeof AcceptedColumnTypes.DATE
            ? Date
            : K extends typeof AcceptedColumnTypes.ENUM
              ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                T[number]
              : K extends typeof AcceptedColumnTypes.JSON
                ? T
                : K extends typeof AcceptedColumnTypes.ARRAY
                  ? T
                  : never;
};

export type NumberOptions = {
  type: typeof AcceptedColumnTypes.NUMBER;
};

export type StringOptions = {
  type: typeof AcceptedColumnTypes.STRING;
};

export type BooleanOptions = {
  type: typeof AcceptedColumnTypes.BOOLEAN;
};

export type TimestampOptions = {
  type: typeof AcceptedColumnTypes.TIMESTAMP;
};

export type DateOptions = {
  type: typeof AcceptedColumnTypes.DATE;
};

export type EnumOptions<Values extends readonly string[]> = {
  type: typeof AcceptedColumnTypes.ENUM;
  values: Values;
};

export type JsonOptions<Fields extends Record<string, Field>> = {
  type: typeof AcceptedColumnTypes.JSON;
  fields: Fields;
};

export type ArrayOptions<Fields extends readonly Field[]> = {
  type: typeof AcceptedColumnTypes.ARRAY;
  fields: Fields;
};

export type FieldOptions<
  Type extends AcceptedColumnTypes,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  U = any,
> = Type extends typeof AcceptedColumnTypes.NUMBER
  ? NumberOptions
  : Type extends typeof AcceptedColumnTypes.STRING
    ? StringOptions
    : Type extends typeof AcceptedColumnTypes.BOOLEAN
      ? BooleanOptions
      : Type extends typeof AcceptedColumnTypes.TIMESTAMP
        ? TimestampOptions
        : Type extends typeof AcceptedColumnTypes.DATE
          ? DateOptions
          : Type extends typeof AcceptedColumnTypes.ENUM
            ? U extends readonly string[]
              ? EnumOptions<U>
              : never
            : Type extends typeof AcceptedColumnTypes.JSON
              ? U extends Record<string, Field>
                ? JsonOptions<U>
                : never
              : Type extends typeof AcceptedColumnTypes.ARRAY
                ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-expect-error
                  U extends readonly Field[]
                  ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    ArrayOptions<U>
                  : ArrayOptions<readonly Field[]>
                : never;
