import { parseArgs, type ParseArgsOptionDescriptor } from 'node:util';
import { ActionParameterType } from './constants';
import type {
  ActionParameterTypeMap,
  ArrayParameter,
  CommandLineActionOptions,
  EnumParameter,
  FlagParameter,
  NumberParameter,
  ParameterDefinition,
  StringParamter,
} from './types';

export abstract class CommandLineAction<
  Values extends Record<string, unknown> = Record<string, unknown>,
  Parameters extends Record<
    string,
    ParameterDefinition<unknown, unknown>
  > = Record<string, ParameterDefinition<unknown, unknown>>,
> {
  public name: string;
  public summary: string;
  public description: string;
  public parameters: Parameters;
  public values: Values;

  constructor(options: CommandLineActionOptions) {
    this.name = options.name;
    this.summary = options.summary || '';
    this.description = options.description || '';
    this.parameters = {} as Parameters;
    this.values = {} as Values;
  }

  private addParameter<
    Name extends (string & {}) | keyof Values,
    Type extends Exclude<
      ActionParameterType,
      typeof ActionParameterType.ARRAY | typeof ActionParameterType.ENUM
    >,
    Definition extends ParameterDefinition<Type, unknown>,
    Value extends ActionParameterTypeMap[Definition['type']],
  >(name: Name, definition: Definition) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    this.parameters[name] = definition;

    return this as unknown as CommandLineAction<
      Values & { [K in Name]: Value },
      Parameters & { [K in Name]: Definition }
    >;
  }

  protected addFlagParameter<
    Name extends (string & {}) | keyof Values,
    Definition extends FlagParameter,
  >(name: Name, definition: Omit<Definition, 'type'>) {
    return this.addParameter(name, {
      ...definition,
      type: 'boolean',
    });
  }

  protected addStringParameter<
    Name extends (string & {}) | keyof Values,
    Definition extends StringParamter,
  >(name: Name, definition: Omit<Definition, 'type'>) {
    return this.addParameter(name, {
      ...definition,
      type: 'string',
    });
  }

  protected addNumberParameter<
    Name extends (string & {}) | keyof Values,
    Definition extends NumberParameter,
  >(name: Name, definition: Omit<Definition, 'type'>) {
    return this.addParameter(name, {
      ...definition,
      type: 'number',
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
      type: 'enum',
    };

    return this as unknown as CommandLineAction<
      Values & {
        [K in Name]: Enum[number];
      },
      Parameters & {
        [K in Name]: typeof definition & {
          type: typeof ActionParameterType.ENUM;
        };
      }
    >;
  }

  protected addArrayParameter<
    Name extends (string & {}) | keyof Values,
    Allowed extends Exclude<
      ActionParameterType,
      typeof ActionParameterType.ARRAY
    >,
    Enum extends Allowed extends typeof ActionParameterType.ENUM
      ? readonly string[]
      : never,
    Default extends Allowed extends typeof ActionParameterType.ENUM
      ? Enum[number]
      : ActionParameterTypeMap<Enum>[Allowed],
    Value extends ActionParameterTypeMap<Enum>[Allowed],
  >(
    name: Name,
    definition: Omit<ArrayParameter<Allowed, Enum, Default>, 'type'>
  ) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    this.parameters[name] = {
      ...definition,
      type: 'array',
    };

    return this as unknown as CommandLineAction<
      Values & {
        [K in Name]: Value[];
      },
      Parameters & {
        [K in Name]: typeof definition & {
          type: typeof ActionParameterType.ARRAY;
        };
      }
    >;
  }

  public async parseAndExecute(args: string[]) {
    const parameters: Record<string, ParseArgsOptionDescriptor> = {};

    for (const [name, params] of Object.entries(this.parameters)) {
      const parameter: ParseArgsOptionDescriptor = {
        short: params.alias,
        multiple: params.type === ActionParameterType.ARRAY,
        default: params.default
          ? Array.isArray(params.default)
            ? params.default.map((d) => String(d))
            : String(params.default)
          : undefined,
        type:
          params.type === ActionParameterType.BOOLEAN ? 'boolean' : 'string',
      };

      if (typeof params.default !== 'undefined') {
        if (params.type === ActionParameterType.BOOLEAN) {
          parameter.default = params.default;
        } else {
          parameter.default = Array.isArray(params.default)
            ? params.default.map((d) => String(d))
            : String(params.default);
        }
      }

      parameters[name] = parameter;
    }

    const { values } = parseArgs({
      args: args,
      options: parameters,
      allowNegative: true,
      allowPositionals: true,
    });

    for (const [name, params] of Object.entries(this.parameters)) {
      let value: unknown = values[name];

      if (value === undefined) {
        if (typeof params.default !== 'undefined') {
          value = params.default;
        } else if (params.type === ActionParameterType.ARRAY) {
          value = [];
        }
      }

      if (
        params.required &&
        (value === undefined || (Array.isArray(value) && !value.length))
      ) {
        throw new Error(
          `Parameter '--${name}' is required for action '${this.name}'.`
        );
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      this.values[name] = value;

      await this.onExecute();
    }
  }

  public abstract onExecute(): Promise<void>;
}
