import { ActionParameterType } from './constants';

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
export type ActionParameterTypeMap<T = any> = {
  [K in ActionParameterType]: K extends typeof ActionParameterType.STRING
    ? string
    : K extends typeof ActionParameterType.BOOLEAN
      ? boolean
      : K extends typeof ActionParameterType.NUMBER
        ? number
        : K extends typeof ActionParameterType.ENUM
          ? T extends readonly string[]
            ? T[number]
            : never
          : K extends typeof ActionParameterType.ARRAY
            ? never
            : never;
};

export interface FlagParameter extends BaseParameter<boolean> {
  type: typeof ActionParameterType.BOOLEAN;
}

export interface StringParamter extends BaseParameter<string> {
  type: typeof ActionParameterType.STRING;
}

export interface NumberParameter extends BaseParameter<number> {
  type: typeof ActionParameterType.NUMBER;
}

export interface EnumParameter<T extends readonly string[]>
  extends BaseParameter<T[number]> {
  type: typeof ActionParameterType.ENUM;
  enums: T;
}

export interface BaseArrayParameter<
  T extends Exclude<ActionParameterType, typeof ActionParameterType.ARRAY>,
  U,
> extends BaseParameter<U[]> {
  type: typeof ActionParameterType.ARRAY;
  allowedValue: T;
}

export type ArrayParameterFlags<
  T extends Exclude<ActionParameterType, typeof ActionParameterType.ARRAY>,
  U extends T extends typeof ActionParameterType.ENUM
    ? readonly string[]
    : never,
> = T extends typeof ActionParameterType.ENUM
  ? {
      enums: U;
    }
  : NonNullable<unknown>;

export type ArrayParameter<
  T extends Exclude<ActionParameterType, typeof ActionParameterType.ARRAY>,
  U extends T extends typeof ActionParameterType.ENUM
    ? readonly string[]
    : never = T extends typeof ActionParameterType.ENUM
    ? readonly string[]
    : never,
  V extends T extends typeof ActionParameterType.ENUM
    ? U[number]
    : ActionParameterTypeMap<U>[T] = T extends typeof ActionParameterType.ENUM
    ? U[number]
    : ActionParameterTypeMap<U>[T],
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

export interface CommandLineActionOptions {
  name: string;
  summary?: string;
  description?: string;
}
