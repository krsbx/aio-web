import type { CommandLineParameterType } from './constants';

export interface BaseParameter<Default = unknown> {
  /** Description of the parameter */
  description?: string;
  /** Flag to indicate if the parameter is required */
  required?: boolean;
  /** Alias of the parameter */
  alias?: string;
  /** Default value of the parameter */
  default?: Default;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CommandLineParameterTypeMap<T = any> = {
  [K in CommandLineParameterType]: K extends typeof CommandLineParameterType.STRING
    ? string
    : K extends typeof CommandLineParameterType.BOOLEAN
      ? boolean
      : K extends typeof CommandLineParameterType.NUMBER
        ? number
        : K extends typeof CommandLineParameterType.ENUM
          ? T extends readonly string[]
            ? T[number]
            : never
          : K extends typeof CommandLineParameterType.ARRAY
            ? never
            : never;
};

export interface FlagParameter extends BaseParameter<boolean> {
  type: typeof CommandLineParameterType.BOOLEAN;
}

export interface StringParamter extends BaseParameter<string> {
  type: typeof CommandLineParameterType.STRING;
}

export interface NumberParameter extends BaseParameter<number> {
  type: typeof CommandLineParameterType.NUMBER;
}

export interface EnumParameter<T extends readonly string[]>
  extends BaseParameter<T[number]> {
  type: typeof CommandLineParameterType.ENUM;
  enums: T;
}

export interface BaseArrayParameter<
  T extends Exclude<
    CommandLineParameterType,
    typeof CommandLineParameterType.ARRAY
  >,
  U,
> extends BaseParameter<U[]> {
  type: typeof CommandLineParameterType.ARRAY;
  allowedValue: T;
}

export type ArrayParameterFlags<
  T extends Exclude<
    CommandLineParameterType,
    typeof CommandLineParameterType.ARRAY
  >,
  U extends T extends typeof CommandLineParameterType.ENUM
    ? readonly string[]
    : never,
> = T extends typeof CommandLineParameterType.ENUM
  ? {
      enums: U;
    }
  : NonNullable<unknown>;

export type ArrayParameter<
  T extends Exclude<
    CommandLineParameterType,
    typeof CommandLineParameterType.ARRAY
  >,
  U extends T extends typeof CommandLineParameterType.ENUM
    ? readonly string[]
    : never = T extends typeof CommandLineParameterType.ENUM
    ? readonly string[]
    : never,
  V extends T extends typeof CommandLineParameterType.ENUM
    ? U[number]
    : CommandLineParameterTypeMap<U>[T] = T extends typeof CommandLineParameterType.ENUM
    ? U[number]
    : CommandLineParameterTypeMap<U>[T],
> = ArrayParameterFlags<T, U> & BaseArrayParameter<T, V>;

export type ParameterDefinition<T, U> =
  | FlagParameter
  | StringParamter
  | NumberParameter
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  | EnumParameter<T>
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  | ArrayParameter<T, U>;
