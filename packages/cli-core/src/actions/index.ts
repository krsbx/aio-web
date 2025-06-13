import { parseArgs } from 'node:util';
import { CommandLineParameter } from '../parameters';
import { CommandLineParameterType } from '../parameters/constants';
import type {
  EnumParameter,
  MultipleParameterDefinition,
  ParameterDefinition,
} from '../parameters/types';
import { buildCommandLineParameters } from '../utils/builder';
import { parseArgsValues } from '../utils/parser';
import type { CommandLineActionOptions } from './types';

export abstract class CommandLineAction<
  Values extends Record<string, unknown> = Record<string, unknown>,
  Parameters extends Record<string, ParameterDefinition<unknown>> = Record<
    string,
    ParameterDefinition<unknown>
  >,
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
    const parameters = buildCommandLineParameters(this.parameters);

    const { values } = parseArgs({
      args: args,
      options: parameters,
      allowNegative: true,
      allowPositionals: true,
    });

    this.values = parseArgsValues(this.parameters, values, this.name);

    await this.onExecute();
  }

  public generateHelp(): string {
    let help = `\n  ${this.name}: ${this.summary}\n`;
    help += `\n    ${this.description}\n`;
    help += `\n    Parameters:\n`;

    for (const [name, params] of Object.entries(this.parameters)) {
      const alias = params.alias ? `-${params.alias}, ` : '    ';
      let typeDisplay: string = params.type;

      if (params.type === CommandLineParameterType.ARRAY) {
        const arrayParam = params as MultipleParameterDefinition<never[]>;

        typeDisplay = `${arrayParam.allowedValue}[]`;

        if (arrayParam.allowedValue === CommandLineParameterType.ENUM) {
          typeDisplay += `<${arrayParam.enums.join('|')}>`;
        }
      } else if (params.type === CommandLineParameterType.ENUM) {
        const enumParam = params as EnumParameter<never[]>;

        typeDisplay = `${params.type}<${enumParam.enums.join('|')}>`;
      }

      const defaultValue =
        'default' in params && params.default !== undefined
          ? ` (default: ${JSON.stringify(params.default)})`
          : '';

      const required = params.required ? ` (required)` : '';

      help += `      ${alias}--${name} (${typeDisplay})${required}${defaultValue}\n`;
      help += `        ${params.description}\n`;
    }

    return help;
  }

  public abstract onExecute(): Promise<void>;
}
