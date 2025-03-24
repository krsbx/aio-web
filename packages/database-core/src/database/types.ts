import type { Column } from '../column';
import type { Table } from '../table';
import type { Dialect } from '../table/constants';

export interface SqliteConfig {
  filename: string;
}

export interface PostgresConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export interface DatabaseOptions<
  DbDialect extends Dialect,
  Tables extends Record<string, Table<string, Record<string, Column>>>,
> {
  dialect: DbDialect;
  config: DbDialect extends typeof Dialect.POSTGRES
    ? PostgresConfig
    : SqliteConfig;
  tables?: Tables;
}

export interface DatabaseDefinition<
  DbDialect extends Dialect,
  Tables extends Record<string, Table<string, Record<string, Column>>>,
> extends DatabaseOptions<DbDialect, Tables> {
  tables: Tables;
}

export interface DatabaseDialect {
  connect(): Promise<this>;
  disconnect(): Promise<this>;

  exec<T>(sql: string): Promise<T>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  exec<T>(sql: string, params: any): Promise<T>;

  status: 'connecting' | 'connected' | 'disconnected';
}
