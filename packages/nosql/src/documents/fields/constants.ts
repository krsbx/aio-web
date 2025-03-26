export const AcceptedColumnTypes = {
  NUMBER: 'NUMBER',
  STRING: 'STRING',
  BOOLEAN: 'BOOLEAN',
  TIMESTAMP: 'TIMESTAMP',
  DATE: 'DATE',
  ENUM: 'ENUM',
  JSON: 'JSON',
  ARRAY: 'ARRAY',
} as const;

export type AcceptedColumnTypes =
  (typeof AcceptedColumnTypes)[keyof typeof AcceptedColumnTypes];
