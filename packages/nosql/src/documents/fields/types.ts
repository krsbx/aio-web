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

export interface FieldDefinition<T> {
  notNull: boolean;
  default: T;
}

export type PremitiveValueSelector<
  Type extends AcceptedColumnTypes,
  NotNull extends boolean,
> = NotNull extends true
  ? AcceptedColumnTypeMap[Type]
  : AcceptedColumnTypeMap[Type] | null;

export type ValueSelector<
  Type extends AcceptedColumnTypes,
  Values extends Record<string, Field> | readonly string[],
  Options extends FieldOptions<Type, Values>,
  ColValue extends AcceptedColumnTypeMap[Type],
  Value extends Options extends EnumOptions<infer Value>
    ? Value[number]
    : ColValue,
  Fields extends Options extends JsonOptions<infer Fields>
    ? Fields
    : Options extends ArrayOptions<infer Fields>
      ? Fields
      : never,
  Definition extends Partial<FieldDefinition<Value>> | FieldDefinition<Value>,
> = Type extends
  | typeof AcceptedColumnTypes.NUMBER
  | typeof AcceptedColumnTypes.STRING
  | typeof AcceptedColumnTypes.BOOLEAN
  | typeof AcceptedColumnTypes.TIMESTAMP
  | typeof AcceptedColumnTypes.DATE
  ? PremitiveValueSelector<
      Type,
      Definition['notNull'] extends true ? true : false
    >
  : Type extends typeof AcceptedColumnTypes.JSON
    ? Fields extends Record<string, Field>
      ? {
          [K in keyof Fields]: Fields[K] extends Field<
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            infer CT,
            infer VS,
            infer O,
            infer CV,
            infer V,
            infer F,
            infer D
          >
            ? ValueSelector<O['type'], VS, O, CV, V, F, D>
            : never;
        }
      : NonNullable<unknown>
    : Type extends typeof AcceptedColumnTypes.ARRAY
      ? Fields extends readonly Field<
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          infer CT,
          infer VS,
          infer O,
          infer CV,
          infer V,
          infer F,
          infer D
        >[]
        ? ValueSelector<O['type'], VS, O, CV, V, F, D>[]
        : unknown[]
      : Type extends typeof AcceptedColumnTypes.ENUM
        ? Options extends EnumOptions<infer Value>
          ? Value[number]
          : never
        : never;
