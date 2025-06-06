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

export interface BaseArrayNonEnumParameter<
  T extends Exclude<
    CommandLineParameterType,
    typeof CommandLineParameterType.ARRAY | typeof CommandLineParameterType.ENUM
  >,
> extends BaseParameter<CommandLineParameterTypeMap[T][]> {
  type: typeof CommandLineParameterType.ARRAY;
  allowedValue: T;
}

export type ArrayFlagParameter = BaseArrayNonEnumParameter<
  typeof CommandLineParameterType.BOOLEAN
>;

export type ArrayStringParameter = BaseArrayNonEnumParameter<
  typeof CommandLineParameterType.STRING
>;

export type ArrayNumberParameter = BaseArrayNonEnumParameter<
  typeof CommandLineParameterType.NUMBER
>;

export interface ArrayEnumParameter<T extends readonly string[]>
  extends BaseArrayParameter<typeof CommandLineParameterType.ENUM, T[number]> {
  enums: T;
}

export type SingleParameterDefinition<T> =
  | FlagParameter
  | StringParamter
  | NumberParameter
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  | EnumParameter<T>;

export type MultipleParameterDefinition<T> =
  | ArrayFlagParameter
  | ArrayStringParameter
  | ArrayNumberParameter
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  | ArrayEnumParameter<T>;

export type ParameterDefinition<T> =
  | SingleParameterDefinition<T>
  | MultipleParameterDefinition<T>;
