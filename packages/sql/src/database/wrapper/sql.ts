import { SQL } from 'bun';
import { Dialect } from '../../table/constants';
import type { DatabaseDialect, PostgresConfig } from '../types';
import type { AcceptedSqlConfig, AcceptedSqlDialects } from './constants';

export class BaseSql<
  Dialect extends AcceptedSqlDialects,
  Options extends AcceptedSqlConfig[Dialect],
> implements DatabaseDialect
{
  public readonly dialect: Dialect;
  public readonly options: Options;
  public client: SQL;
  public status: 'connecting' | 'connected' | 'disconnected';

  constructor(dialect: Dialect, options: Options) {
    this.dialect = dialect;
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

export class DatabasePsql extends BaseSql<
  typeof Dialect.POSTGRES,
  PostgresConfig
> {
  constructor(options: PostgresConfig) {
    super(Dialect.POSTGRES, options);
  }
}

export class DatabaseMysql extends BaseSql<
  typeof Dialect.MYSQL,
  PostgresConfig
> {
  constructor(options: PostgresConfig) {
    super(Dialect.MYSQL, options);
  }
}
