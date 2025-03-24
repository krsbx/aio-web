import { SQL } from 'bun';
import { Database as Sqlite } from 'bun:sqlite';
import { Dialect } from '../table/constants';
import type { DatabaseDialect, PostgresConfig, SqliteConfig } from './types';

export class DatabasePsql implements DatabaseDialect {
  public readonly dialect: typeof Dialect.POSTGRES;
  public readonly options: PostgresConfig;
  public client: SQL;
  public status: 'connecting' | 'connected' | 'disconnected';

  constructor(options: PostgresConfig) {
    this.dialect = Dialect.POSTGRES;
    this.options = options;

    this.status = 'connecting';
    this.client = new SQL({
      ...options,
      onconnect: () => {
        this.status = 'connected';
      },
      onclose: () => {
        this.status = 'disconnected';
      },
    });
    this.connect();
  }

  public async connect() {
    await this.client.connect();

    return this;
  }

  public async disconnect() {
    await this.client.close();

    return this;
  }

  public async exec<T>(sql: string): Promise<T>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async exec<T>(sql: string, values: any[]): Promise<T>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async exec<T>(sql: string, values?: any[]): Promise<T> {
    if (!values) {
      return this.client.unsafe(sql) as T;
    }

    return this.client.unsafe(sql, values) as T;
  }

  public async transaction<T, U extends () => Promise<T>>(fn: U): Promise<T> {
    try {
      await this.exec('BEGIN');

      const result = await fn();

      await this.exec('COMMIT');

      return result;
    } catch (err) {
      await this.exec('ROLLBACK');

      throw err;
    }
  }
}

export class DatabaseSqlite implements DatabaseDialect {
  public readonly dialect: typeof Dialect.SQLITE;
  public readonly options: SqliteConfig;
  public client: Sqlite;
  public status: 'connecting' | 'connected' | 'disconnected';

  constructor(options: SqliteConfig) {
    this.dialect = Dialect.SQLITE;
    this.options = options;

    this.status = 'connecting';
    this.client = new Sqlite(options.filename);
    this.status = 'connected';
  }

  public async connect() {
    this.client = new Sqlite(this.options.filename);
    this.status = 'connected';

    return this;
  }

  public async disconnect() {
    this.client.close();
    this.status = 'disconnected';

    return this;
  }

  public async exec<T>(sql: string): Promise<T>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async exec<T>(sql: string, params: any): Promise<T>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async exec<T>(sql: string, params?: any): Promise<T> {
    const query = this.client.prepare(sql, params);

    return query.all() as T;
  }

  public async transaction<T, U extends () => Promise<T>>(fn: U): Promise<T> {
    try {
      await this.exec('BEGIN');

      const result = await fn();

      await this.exec('COMMIT');

      return result;
    } catch (err) {
      await this.exec('ROLLBACK');

      throw err;
    }
  }
}
