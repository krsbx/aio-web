export const ActionParameterType = {
  STRING: 'string',
  BOOLEAN: 'boolean',
  NUMBER: 'number',
  ARRAY: 'array',
  ENUM: 'enum',
} as const;

export type ActionParameterType =
  (typeof ActionParameterType)[keyof typeof ActionParameterType];
