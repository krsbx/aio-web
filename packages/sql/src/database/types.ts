import type { TransactionSQL } from 'bun';
import type { Column } from '../column';
import type { Table } from '../table';
import type { Dialect } from '../table/constants';

export type SqlConfigMapping = {
  [Dialect.POSTGRES]: PostgresConfig;
  [Dialect.MYSQL]: MysqlConfig;
  [Dialect.SQLITE]: SqliteConfig;
};

export interface SqliteConfig {
  filename: string;
}

export interface SqlConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PostgresConfig extends SqlConfig {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface MysqlConfig extends SqlConfig {}

export interface DatabaseOptions<
  DbDialect extends Dialect,
  Tables extends Record<string, Table<string, Record<string, Column>>>,
> {
  dialect: DbDialect;
  config: SqlConfigMapping[DbDialect];
  tables?: Tables;
}

export interface DatabaseExecOptions {
  sql: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: any;
  tx?: TransactionSQL | null;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface DatabaseDefinition<
  DbDialect extends Dialect,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
> extends Omit<DatabaseOptions<DbDialect, any>, 'tables'> {}

export interface DatabaseDialect {
  status: 'connecting' | 'connected' | 'disconnected';

  connect(): Promise<this>;
  disconnect(): Promise<this>;

  exec<T>(options: DatabaseExecOptions): Promise<T>;

  transaction<T, U extends (tx: TransactionSQL) => Promise<T>>(
    fn: U
  ): Promise<T>;
}
