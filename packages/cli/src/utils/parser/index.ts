import { CommandLineParameterType } from '../../parameters/constants';
import type { ParameterDefinition } from '../../parameters/types';

export function parseArgsValues<Output extends Record<string, unknown>>(
  parameters: Record<string, ParameterDefinition<unknown>>,
  values: Record<string, string | boolean | (string | boolean)[] | undefined>,
  commandName?: string
) {
  const finalValues: Output = {} as Output;

  for (const [name, params] of Object.entries(parameters)) {
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
      let errorMessage = `Parameter '--${name}' is required.`;

      if (commandName) {
        errorMessage = `Parameter '--${name}' is required for command '${commandName}'.`;
      }

      throw new Error(errorMessage);
    }

    switch (params.type) {
      case CommandLineParameterType.NUMBER:
        value = Number(value);
        break;

      case CommandLineParameterType.ENUM:
        if (!(params.enums as string[]).includes(String(value))) {
          throw new Error(
            `Parameter '--${name}' must be one of: ${(
              params.enums as string[]
            ).join(', ')}.`
          );
        }

        break;

      case CommandLineParameterType.ARRAY: {
        if (params.allowedValue === CommandLineParameterType.NUMBER) {
          value = (Array.isArray(value) ? value : [value]).map((v) =>
            Number(v)
          );
        }

        if (params.allowedValue === CommandLineParameterType.ENUM) {
          if (
            !(
              Array.isArray(value) &&
              value.every((v) => (params.enums as string[]).includes(v))
            )
          ) {
            throw new Error(
              `Parameter '--${name}' must be one of: ${(
                params.enums as string[]
              ).join(', ')}.`
            );
          }
        }

        break;
      }

      case CommandLineParameterType.STRING:
      case CommandLineParameterType.BOOLEAN:
      default:
        break;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    finalValues[name] = value;
  }

  return finalValues;
}

export function findPotentialCommand(args: string[]) {
  let commandIndex = -1;
  let commandName: string | null = null;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg && !arg.startsWith('-')) {
      // Found a positional argument
      commandIndex = i;
      commandName = arg;
      break;
    }
  }

  return {
    commandIndex,
    commandName,
  };
}
