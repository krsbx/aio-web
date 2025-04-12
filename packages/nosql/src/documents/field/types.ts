import type { Field } from '.';
import type { AcceptedFieldTypes } from './constants';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AcceptedColumnTypeMap<T = any> = {
  [K in AcceptedFieldTypes]: K extends typeof AcceptedFieldTypes.NUMBER
    ? number
    : K extends typeof AcceptedFieldTypes.STRING
      ? string
      : K extends typeof AcceptedFieldTypes.BOOLEAN
        ? boolean
        : K extends typeof AcceptedFieldTypes.TIMESTAMP
          ? number
          : K extends typeof AcceptedFieldTypes.DATE
            ? Date
            : K extends typeof AcceptedFieldTypes.ENUM
              ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                T[number]
              : K extends typeof AcceptedFieldTypes.JSON
                ? T
                : K extends typeof AcceptedFieldTypes.ARRAY
                  ? T
                  : never;
};

export type NumberOptions = {
  type: typeof AcceptedFieldTypes.NUMBER;
};

export type StringOptions = {
  type: typeof AcceptedFieldTypes.STRING;
};

export type BooleanOptions = {
  type: typeof AcceptedFieldTypes.BOOLEAN;
};

export type TimestampOptions = {
  type: typeof AcceptedFieldTypes.TIMESTAMP;
};

export type DateOptions = {
  type: typeof AcceptedFieldTypes.DATE;
};

export type EnumOptions<Values extends readonly string[]> = {
  type: typeof AcceptedFieldTypes.ENUM;
  values: Values;
};

export type JsonOptions<Fields extends Record<string, Field>> = {
  type: typeof AcceptedFieldTypes.JSON;
  fields: Fields;
};

export type ArrayOptions<Fields extends readonly Field[]> = {
  type: typeof AcceptedFieldTypes.ARRAY;
  fields: Fields;
};

export type FieldOptions<
  Type extends AcceptedFieldTypes,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  U = any,
> = Type extends typeof AcceptedFieldTypes.NUMBER
  ? NumberOptions
  : Type extends typeof AcceptedFieldTypes.STRING
    ? StringOptions
    : Type extends typeof AcceptedFieldTypes.BOOLEAN
      ? BooleanOptions
      : Type extends typeof AcceptedFieldTypes.TIMESTAMP
        ? TimestampOptions
        : Type extends typeof AcceptedFieldTypes.DATE
          ? DateOptions
          : Type extends typeof AcceptedFieldTypes.ENUM
            ? U extends readonly string[]
              ? EnumOptions<U>
              : never
            : Type extends typeof AcceptedFieldTypes.JSON
              ? U extends Record<string, Field>
                ? JsonOptions<U>
                : never
              : Type extends typeof AcceptedFieldTypes.ARRAY
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
  Type extends AcceptedFieldTypes,
  NotNull extends boolean,
> = NotNull extends true
  ? AcceptedColumnTypeMap[Type]
  : AcceptedColumnTypeMap[Type] | null;

export type ValueSelector<
  Type extends AcceptedFieldTypes,
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
  | typeof AcceptedFieldTypes.NUMBER
  | typeof AcceptedFieldTypes.STRING
  | typeof AcceptedFieldTypes.BOOLEAN
  | typeof AcceptedFieldTypes.TIMESTAMP
  | typeof AcceptedFieldTypes.DATE
  ? PremitiveValueSelector<
      Type,
      Definition['notNull'] extends true ? true : false
    >
  : Type extends typeof AcceptedFieldTypes.JSON
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
    : Type extends typeof AcceptedFieldTypes.ARRAY
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
      : Type extends typeof AcceptedFieldTypes.ENUM
        ? Options extends EnumOptions<infer Value>
          ? Value[number]
          : never
        : never;
