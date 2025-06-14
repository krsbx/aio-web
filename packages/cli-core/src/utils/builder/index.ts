import { CommandLineParameterType } from '../../parameters/constants';
import type { ParameterDefinition } from '../../parameters/types';
import type { ParseArgsOptionConfig } from './types';

export function buildCommandLineParameters(
  parameters: Record<string, ParameterDefinition<unknown>>
) {
  const finalParameters: Record<string, ParseArgsOptionConfig> = {};

  for (const [name, params] of Object.entries(parameters)) {
    const parameter: ParseArgsOptionConfig = {
      short: params.alias,
      multiple: params.type === CommandLineParameterType.ARRAY,
      default: params.default
        ? Array.isArray(params.default)
          ? params.default.map((d) => String(d))
          : String(params.default)
        : undefined,
      type:
        params.type === CommandLineParameterType.BOOLEAN ? 'boolean' : 'string',
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

    finalParameters[name] = parameter;
  }

  return finalParameters;
}
