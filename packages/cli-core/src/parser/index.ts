import { parseArgs } from 'node:util';
import type { CommandLineAction } from '../actions';
import { CommandLineParameter } from '../parameters';
import { CommandLineParameterType } from '../parameters/constants';
import type {
  EnumParameter,
  MultipleParameterDefinition,
  ParameterDefinition,
} from '../parameters/types';
import { buildCommandLineParameters } from '../utils/builder';
import { findPotentialCommand, parseArgsValues } from '../utils/parser';

export abstract class CommandLineParser<
  Values extends Record<string, unknown> = Record<string, unknown> & {
    help?: boolean;
    verbose?: boolean;
  },
  Parameters extends Record<string, ParameterDefinition<unknown>> = Record<
    string,
    ParameterDefinition<unknown>
  >,
> extends CommandLineParameter<Parameters, Values> {
  private toolName: string;
  private toolDescription: string;
  private actions: Map<string, CommandLineAction>;

  constructor(toolName: string, toolDescription: string) {
    super();

    this.toolName = toolName;
    this.toolDescription = toolDescription;
    this.actions = new Map();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    this.addFlagParameter('help', {
      alias: 'h',
      description: 'Show help information.',
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    this.addFlagParameter('verbose', {
      alias: 'v',
      description: 'Enable verbose logging.',
    });
  }

  public addAction(action: CommandLineAction): void {
    if (this.actions.has(action.name)) {
      throw new Error(`Action '${action.name}' already registered.`);
    }
    this.actions.set(action.name, action);
  }

  public async execute(args: string[] = process.argv): Promise<void> {
    const parameters = buildCommandLineParameters(this.parameters);

    const cliArgs = args.slice(2);

    const { commandIndex, commandName } = findPotentialCommand(cliArgs);
    let commandArgs: string[] = [];

    if (commandIndex !== -1) {
      // Extract global args that came before the command
      const preCommandArgs = cliArgs.slice(0, commandIndex);

      const { values: preValues } = parseArgs({
        args: preCommandArgs,
        options: parameters,
        strict: false,
      });

      this.values = parseArgsValues(this.parameters, preValues);

      // Remaining args are for the command
      commandArgs = cliArgs.slice(commandIndex + 1);
    } else {
      // No command specified, treat all as global args
      const { values } = parseArgs({
        args: cliArgs,
        options: parameters,
        strict: false,
      });

      this.values = parseArgsValues(this.parameters, values);
    }

    if (this.values.help) {
      this.generateFullHelp();
      return;
    }

    if (!commandName) {
      console.error(`Error: No command specified.\n`);
      this.generateFullHelp();
      process.exit(1);
    }

    const selectedAction = this.actions.get(commandName);

    if (!selectedAction) {
      console.error(`Error: Unknown command '${commandName}'.\n`);
      this.generateFullHelp();

      process.exit(1);
    }

    if (this.values.verbose) {
      console.log(
        `[VERBOSE] Executing command '${commandName}' with args: ${JSON.stringify(commandArgs)}`
      );
    }

    try {
      await selectedAction.parseAndExecute(commandArgs);
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          `\nError executing command '${commandName}': ${error.message}`
        );

        console.log(selectedAction.generateHelp());
      }

      process.exit(1);
    }
  }

  private generateFullHelp(): void {
    console.log(
      `\nUsage: ${this.toolName} [global options] <command> [command options]\n`
    );
    console.log(`${this.toolDescription}\n`);

    console.log(`Global Options:`);

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

      console.log(
        `  ${alias}--${name} (${typeDisplay})${required}${defaultValue}`
      );
      console.log(`    ${params.description}`);
    }

    if (this.actions.size > 0) {
      console.log(`\nCommands:`);

      this.actions.forEach((action) => {
        console.log(`  ${action.name}: ${action.summary}`);
        console.log(`    ${action.description}`);
      });
    }
  }
}
