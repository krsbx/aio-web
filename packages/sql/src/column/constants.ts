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
  SERIAL: 'SERIAL',
} as const;

export type AcceptedColumnTypes =
  (typeof AcceptedColumnTypes)[keyof typeof AcceptedColumnTypes];

export const ColumnTypeMapping = {
  [AcceptedColumnTypes.INTEGER]: {
    [Dialect.SQLITE]: 'INTEGER',
    [Dialect.POSTGRES]: 'INTEGER',
    [Dialect.MYSQL]: 'INT',
  },
  [AcceptedColumnTypes.STRING]: {
    [Dialect.SQLITE]: 'TEXT',
    [Dialect.POSTGRES]: 'VARCHAR',
    [Dialect.MYSQL]: 'VARCHAR',
  },
  [AcceptedColumnTypes.BOOLEAN]: {
    [Dialect.SQLITE]: 'INTEGER',
    [Dialect.POSTGRES]: 'BOOLEAN',
    [Dialect.MYSQL]: 'TINYINT',
  },
  [AcceptedColumnTypes.DATE]: {
    [Dialect.SQLITE]: 'TEXT',
    [Dialect.POSTGRES]: 'DATE',
    [Dialect.MYSQL]: 'DATE',
  },
  [AcceptedColumnTypes.FLOAT]: {
    [Dialect.SQLITE]: 'REAL',
    [Dialect.POSTGRES]: 'FLOAT',
    [Dialect.MYSQL]: 'FLOAT PRECISION',
  },
  [AcceptedColumnTypes.DECIMAL]: {
    [Dialect.SQLITE]: 'NUMERIC',
    [Dialect.POSTGRES]: 'DECIMAL',
    [Dialect.MYSQL]: 'DECIMAL',
  },
  [AcceptedColumnTypes.BIGINT]: {
    [Dialect.SQLITE]: 'INTEGER',
    [Dialect.POSTGRES]: 'BIGINT',
    [Dialect.MYSQL]: 'BIGINT',
  },
  [AcceptedColumnTypes.TEXT]: {
    [Dialect.SQLITE]: 'TEXT',
    [Dialect.POSTGRES]: 'TEXT',
    [Dialect.MYSQL]: 'TEXT',
  },
  [AcceptedColumnTypes.BLOB]: {
    [Dialect.SQLITE]: 'BLOB',
    [Dialect.POSTGRES]: 'BYTEA',
    [Dialect.MYSQL]: 'BLOB',
  },
  [AcceptedColumnTypes.JSON]: {
    [Dialect.SQLITE]: 'TEXT',
    [Dialect.POSTGRES]: 'JSONB',
    [Dialect.MYSQL]: 'JSON',
  },
  [AcceptedColumnTypes.VARCHAR]: {
    [Dialect.SQLITE]: 'VARCHAR',
    [Dialect.POSTGRES]: 'VARCHAR',
    [Dialect.MYSQL]: 'VARCHAR',
  },
  [AcceptedColumnTypes.TIME]: {
    [Dialect.SQLITE]: 'TEXT',
    [Dialect.POSTGRES]: 'TIME',
    [Dialect.MYSQL]: 'TIME',
  },
  [AcceptedColumnTypes.TIMESTAMP]: {
    [Dialect.SQLITE]: 'TEXT',
    [Dialect.POSTGRES]: 'TIMESTAMP',
    [Dialect.MYSQL]: 'DATETIME',
  },
  [AcceptedColumnTypes.DOUBLE]: {
    [Dialect.SQLITE]: 'REAL',
    [Dialect.POSTGRES]: 'DOUBLE PRECISION',
    [Dialect.MYSQL]: 'DOUBLE PRECISION',
  },
  [AcceptedColumnTypes.DATETIME]: {
    [Dialect.SQLITE]: 'TEXT',
    [Dialect.POSTGRES]: 'TIMESTAMP',
    [Dialect.MYSQL]: 'DATETIME',
  },
  [AcceptedColumnTypes.DATEONLY]: {
    [Dialect.SQLITE]: 'TEXT',
    [Dialect.POSTGRES]: 'DATE',
    [Dialect.MYSQL]: 'DATE',
  },
  [AcceptedColumnTypes.ENUM]: {
    [Dialect.SQLITE]: 'TEXT',
    [Dialect.POSTGRES]: 'TEXT',
    [Dialect.MYSQL]: 'TEXT',
  },
  [AcceptedColumnTypes.SERIAL]: {
    [Dialect.SQLITE]: 'INTEGER',
    [Dialect.POSTGRES]: 'SERIAL',
    [Dialect.MYSQL]: 'INT',
  },
} as const;
