import { parseArgs, type ParseArgsOptionDescriptor } from 'node:util';
import { CommandLineParameter } from '../parameters';
import { CommandLineParameterType } from '../parameters/constants';
import type { ParameterDefinition } from '../parameters/types';
import type { CommandLineActionOptions } from './types';

export abstract class CommandLineAction<
  Values extends Record<string, unknown> = Record<string, unknown>,
  Parameters extends Record<
    string,
    ParameterDefinition<unknown, unknown>
  > = Record<string, ParameterDefinition<unknown, unknown>>,
> extends CommandLineParameter<Parameters, Values> {
  public name: string;
  public summary: string;
  public description: string;

  constructor(options: CommandLineActionOptions) {
    super();

    this.name = options.name;
    this.summary = options.summary || '';
    this.description = options.description || '';
  }

  public async parseAndExecute(args: string[]) {
    const parameters: Record<string, ParseArgsOptionDescriptor> = {};

    for (const [name, params] of Object.entries(this.parameters)) {
      const parameter: ParseArgsOptionDescriptor = {
        short: params.alias,
        multiple: params.type === CommandLineParameterType.ARRAY,
        default: params.default
          ? Array.isArray(params.default)
            ? params.default.map((d) => String(d))
            : String(params.default)
          : undefined,
        type:
          params.type === CommandLineParameterType.BOOLEAN
            ? 'boolean'
            : 'string',
      };

      if (typeof params.default !== 'undefined') {
        if (params.type === CommandLineParameterType.BOOLEAN) {
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
        } else if (params.type === CommandLineParameterType.ARRAY) {
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
