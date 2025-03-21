import { Dialect } from '../table/constants';

export const AcceptedColumnTypes = {
  INTEGER: 'INTEGER',
  STRING: 'STRING',
  BOOLEAN: 'BOOLEAN',
  DATE: 'DATE',
  FLOAT: 'FLOAT',
  DECIMAL: 'DECIMAL',
  BIGINT: 'BIGINT',
  TEXT: 'TEXT',
  BLOB: 'BLOB',
  JSON: 'JSON',
  VARCHAR: 'VARCHAR',
  TIME: 'TIME',
  TIMESTAMP: 'TIMESTAMP',
  DOUBLE: 'DOUBLE',
  DATETIME: 'DATETIME',
  DATEONLY: 'DATEONLY',
  ENUM: 'ENUM',
} as const;

export type AcceptedColumnTypes =
  (typeof AcceptedColumnTypes)[keyof typeof AcceptedColumnTypes];

export const ColumnTypeMapping = {
  [AcceptedColumnTypes.INTEGER]: {
    [Dialect.SQLITE]: 'INTEGER',
    [Dialect.POSTGRES]: 'INTEGER',
  },
  [AcceptedColumnTypes.STRING]: {
    [Dialect.SQLITE]: 'TEXT',
    [Dialect.POSTGRES]: 'VARCHAR',
  },
  [AcceptedColumnTypes.BOOLEAN]: {
    [Dialect.SQLITE]: 'INTEGER',
    [Dialect.POSTGRES]: 'BOOLEAN',
  },
  [AcceptedColumnTypes.DATE]: {
    [Dialect.SQLITE]: 'TEXT',
    [Dialect.POSTGRES]: 'DATE',
  },
  [AcceptedColumnTypes.FLOAT]: {
    [Dialect.SQLITE]: 'REAL',
    [Dialect.POSTGRES]: 'FLOAT',
  },
  [AcceptedColumnTypes.DECIMAL]: {
    [Dialect.SQLITE]: 'TEXT',
    [Dialect.POSTGRES]: 'DECIMAL',
  },
  [AcceptedColumnTypes.BIGINT]: {
    [Dialect.SQLITE]: 'TEXT',
    [Dialect.POSTGRES]: 'BIGINT',
  },
  [AcceptedColumnTypes.TEXT]: {
    [Dialect.SQLITE]: 'TEXT',
    [Dialect.POSTGRES]: 'TEXT',
  },
  [AcceptedColumnTypes.BLOB]: {
    [Dialect.SQLITE]: 'BLOB',
    [Dialect.POSTGRES]: 'BYTEA',
  },
  [AcceptedColumnTypes.JSON]: {
    [Dialect.SQLITE]: 'TEXT',
    [Dialect.POSTGRES]: 'JSONB',
  },
  [AcceptedColumnTypes.VARCHAR]: {
    [Dialect.SQLITE]: 'TEXT',
    [Dialect.POSTGRES]: 'VARCHAR',
  },
  [AcceptedColumnTypes.TIME]: {
    [Dialect.SQLITE]: 'TEXT',
    [Dialect.POSTGRES]: 'TIME',
  },
  [AcceptedColumnTypes.TIMESTAMP]: {
    [Dialect.SQLITE]: 'TEXT',
    [Dialect.POSTGRES]: 'TIMESTAMP',
  },
  [AcceptedColumnTypes.DOUBLE]: {
    [Dialect.SQLITE]: 'REAL',
    [Dialect.POSTGRES]: 'DOUBLE PRECISION',
  },
  [AcceptedColumnTypes.DATETIME]: {
    [Dialect.SQLITE]: 'TEXT',
    [Dialect.POSTGRES]: 'TIMESTAMP',
  },
  [AcceptedColumnTypes.DATEONLY]: {
    [Dialect.SQLITE]: 'TEXT',
    [Dialect.POSTGRES]: 'DATE',
  },
  [AcceptedColumnTypes.ENUM]: {
    [Dialect.SQLITE]: 'TEXT',
    [Dialect.POSTGRES]: 'TEXT',
  },
} as const;
