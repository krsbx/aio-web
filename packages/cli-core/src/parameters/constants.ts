export const CommandLineParameterType = {
  STRING: 'string',
  BOOLEAN: 'boolean',
  NUMBER: 'number',
  ARRAY: 'array',
  ENUM: 'enum',
} as const;

export type CommandLineParameterType =
  (typeof CommandLineParameterType)[keyof typeof CommandLineParameterType];
