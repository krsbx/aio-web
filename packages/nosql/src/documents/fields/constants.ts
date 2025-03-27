export const AcceptedFieldTypes = {
  NUMBER: 'NUMBER',
  STRING: 'STRING',
  BOOLEAN: 'BOOLEAN',
  TIMESTAMP: 'TIMESTAMP',
  DATE: 'DATE',
  ENUM: 'ENUM',
  JSON: 'JSON',
  ARRAY: 'ARRAY',
} as const;

export type AcceptedFieldTypes =
  (typeof AcceptedFieldTypes)[keyof typeof AcceptedFieldTypes];
