import { CommandLineParameterType } from './constants';
import type {
  ArrayParameter,
  CommandLineParameterTypeMap,
  EnumParameter,
  FlagParameter,
  NumberParameter,
  ParameterDefinition,
  StringParamter,
} from './types';

export abstract class CommandLineParameter<
  Parameters extends Record<
    string,
    ParameterDefinition<unknown, unknown>
  > = Record<string, ParameterDefinition<unknown, unknown>>,
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
    Type extends Exclude<
      CommandLineParameterTypeMap,
      | typeof CommandLineParameterType.ARRAY
      | typeof CommandLineParameterType.ENUM
    >,
    Definition extends ParameterDefinition<Type, unknown>,
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

  protected addFlagParameter<
    Name extends (string & {}) | keyof Values,
    Definition extends FlagParameter,
  >(name: Name, definition: Omit<Definition, 'type'>) {
    return this.addParameter(name, {
      ...definition,
      type: CommandLineParameterType.BOOLEAN,
    });
  }

  protected addStringParameter<
    Name extends (string & {}) | keyof Values,
    Definition extends StringParamter,
  >(name: Name, definition: Omit<Definition, 'type'>) {
    return this.addParameter(name, {
      ...definition,
      type: CommandLineParameterType.STRING,
    });
  }

  protected addNumberParameter<
    Name extends (string & {}) | keyof Values,
    Definition extends NumberParameter,
  >(name: Name, definition: Omit<Definition, 'type'>) {
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

  protected addArrayParameter<
    Name extends (string & {}) | keyof Values,
    Allowed extends Exclude<
      CommandLineParameterType,
      typeof CommandLineParameterType.ARRAY
    >,
    Enum extends Allowed extends typeof CommandLineParameterType.ENUM
      ? readonly string[]
      : never,
    Default extends Allowed extends typeof CommandLineParameterType.ENUM
      ? Enum[number]
      : CommandLineParameterTypeMap<Enum>[Allowed],
    Value extends CommandLineParameterTypeMap<Enum>[Allowed],
  >(
    name: Name,
    definition: Omit<ArrayParameter<Allowed, Enum, Default>, 'type'>
  ) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    this.parameters[name] = {
      ...definition,
      type: CommandLineParameterType.ARRAY,
    };

    return this as unknown as CommandLineParameter<
      Parameters & {
        [K in Name]: typeof definition & {
          type: typeof CommandLineParameterType.ARRAY;
        };
      },
      Values & { [K in Name]: Value[] }
    >;
  }
}
