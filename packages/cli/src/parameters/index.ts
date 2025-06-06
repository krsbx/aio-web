import { CommandLineParameterType } from './constants';
import type {
  ArrayEnumParameter,
  ArrayFlagParameter,
  ArrayNumberParameter,
  ArrayStringParameter,
  CommandLineParameterTypeMap,
  EnumParameter,
  FlagParameter,
  MultipleParameterDefinition,
  NumberParameter,
  ParameterDefinition,
  SingleParameterDefinition,
  StringParamter,
} from './types';

export abstract class CommandLineParameter<
  Parameters extends Record<string, ParameterDefinition<unknown>> = Record<
    string,
    ParameterDefinition<unknown>
  >,
  Values extends Record<string, unknown> = Record<string, unknown>,
> {
  public values: Values;
  public parameters: Parameters;

  constructor() {
    this.parameters = {} as Parameters;
    this.values = {} as Values;
  }

  private addParameter<
    Name extends (string & {}) | keyof Values,
    Type extends Omit<
      CommandLineParameterTypeMap,
      | typeof CommandLineParameterType.ARRAY
      | typeof CommandLineParameterType.ENUM
    >,
    Definition extends SingleParameterDefinition<Type>,
    Value extends CommandLineParameterTypeMap[Definition['type']],
  >(name: Name, definition: Definition) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    this.parameters[name] = definition;

    return this as unknown as CommandLineParameter<
      Parameters & { [K in Name]: Definition },
      Values & { [K in Name]: Value }
    >;
  }

  protected addFlagParameter<Name extends (string & {}) | keyof Values>(
    name: Name,
    definition: Omit<FlagParameter, 'type'>
  ) {
    return this.addParameter(name, {
      ...definition,
      type: CommandLineParameterType.BOOLEAN,
    });
  }

  protected addStringParameter<Name extends (string & {}) | keyof Values>(
    name: Name,
    definition: Omit<StringParamter, 'type'>
  ) {
    return this.addParameter(name, {
      ...definition,
      type: CommandLineParameterType.STRING,
    });
  }

  protected addNumberParameter<Name extends (string & {}) | keyof Values>(
    name: Name,
    definition: Omit<NumberParameter, 'type'>
  ) {
    return this.addParameter(name, {
      ...definition,
      type: CommandLineParameterType.NUMBER,
    });
  }

  protected addEnumParameter<
    Name extends (string & {}) | keyof Values,
    Enum extends readonly string[],
  >(name: Name, definition: Omit<EnumParameter<Enum>, 'type'>) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    this.parameters[name] = {
      ...definition,
      type: CommandLineParameterType.ENUM,
    };

    return this as unknown as CommandLineParameter<
      Parameters & {
        [K in Name]: typeof definition & {
          type: typeof CommandLineParameterType.ENUM;
        };
      },
      Values & { [K in Name]: Enum[number] }
    >;
  }

  private addArrayParameter<
    Name extends (string & {}) | keyof Values,
    Type extends Omit<
      CommandLineParameterTypeMap,
      | typeof CommandLineParameterType.ARRAY
      | typeof CommandLineParameterType.ENUM
    >,
    Definition extends Omit<MultipleParameterDefinition<Type>, 'type'>,
    Value extends CommandLineParameterTypeMap[Definition['allowedValue']],
  >(name: Name, definition: Definition) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    this.parameters[name] = {
      ...definition,
      type: CommandLineParameterType.ARRAY,
    };

    return this as unknown as CommandLineParameter<
      Parameters & { [K in Name]: Definition },
      Values & { [K in Name]: Value[] }
    >;
  }

  protected addArrayFlagParameters<Name extends (string & {}) | keyof Values>(
    name: Name,
    definition: Omit<ArrayFlagParameter, 'type' | 'allowedValue'>
  ) {
    return this.addArrayParameter(name, {
      ...definition,
      allowedValue: CommandLineParameterType.BOOLEAN,
    });
  }

  protected addArrayStringParameters<Name extends (string & {}) | keyof Values>(
    name: Name,
    definition: Omit<ArrayStringParameter, 'type' | 'allowedValue'>
  ) {
    return this.addArrayParameter(name, {
      ...definition,
      allowedValue: CommandLineParameterType.STRING,
    });
  }

  protected addArrayNumberParameters<Name extends (string & {}) | keyof Values>(
    name: Name,
    definition: Omit<ArrayNumberParameter, 'type' | 'allowedValue'>
  ) {
    return this.addArrayParameter(name, {
      ...definition,
      allowedValue: CommandLineParameterType.NUMBER,
    });
  }

  protected addArrayEnumParameters<
    Name extends (string & {}) | keyof Values,
    Enum extends readonly string[],
  >(
    name: Name,
    definition: Omit<ArrayEnumParameter<Enum>, 'type' | 'allowedValue'>
  ) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    this.parameters[name] = {
      ...definition,
      allowedValue: CommandLineParameterType.ENUM,
      type: CommandLineParameterType.ARRAY,
    };

    return this as unknown as CommandLineParameter<
      Parameters & {
        [K in Name]: typeof definition & {
          allowedValue: typeof CommandLineParameterType.ENUM;
          type: typeof CommandLineParameterType.ARRAY;
        };
      },
      Values & { [K in Name]: Enum[number][] }
    >;
  }
}
