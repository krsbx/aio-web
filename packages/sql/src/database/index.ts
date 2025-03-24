import type { Column } from '../column';
import type { QueryBuilder } from '../query';
import { Table } from '../table';
import { Dialect } from '../table/constants';
import type { MergeTimestampParanoid, TimestampOptions } from '../table/types';
import type {
  DatabaseDefinition,
  DatabaseDialect,
  DatabaseOptions,
  PostgresConfig,
  SqliteConfig,
} from './types';
import { DatabasePsql, DatabaseSqlite } from './wrapper';

export class Database<
  DbDialect extends Dialect,
  Tables extends Record<string, Table<string, Record<string, Column>>>,
  Definition extends Partial<
    DatabaseDefinition<DbDialect, Tables>
  > = DatabaseDefinition<DbDialect, Tables>,
> {
  public readonly dialect: DbDialect;
  public readonly defintion: Definition;
  public readonly client: DatabaseDialect;

  private constructor(options: DatabaseOptions<DbDialect, Tables>) {
    this.dialect = options.dialect;
    this.defintion = {
      dialect: options.dialect,
      config: options.config,
      tables: options.tables,
    } as unknown as Definition;
    this.client =
      options.dialect === Dialect.POSTGRES
        ? new DatabasePsql(options.config as PostgresConfig)
        : new DatabaseSqlite(options.config as SqliteConfig);

    if (options.tables) {
      for (const tableName in options.tables) {
        options.tables[tableName].database = this.client;
      }
    }
  }

  public table<TableName extends keyof Tables>(tableName: TableName) {
    if (!this.defintion.tables || !this.defintion.tables[tableName]) {
      throw new Error(`Table ${tableName as string} does not exist`);
    }

    const table = this.defintion.tables[tableName];

    // Fix the type
    return table.query() as QueryBuilder<TableName & string, typeof table>;
  }

  public async createTable<
    TableName extends string,
    Columns extends Record<string, Column>,
    CreatedAt extends string,
    UpdatedAt extends string,
    Timestamp extends TimestampOptions<CreatedAt, UpdatedAt> | boolean,
    Paranoid extends string | boolean,
    FinalColumns extends MergeTimestampParanoid<
      Columns,
      CreatedAt,
      UpdatedAt,
      Timestamp,
      Paranoid
    >,
  >(
    tableName: TableName,
    columns: Columns,
    options?: {
      paranoid?: Paranoid;
      timestamp?: Timestamp;
    }
  ) {
    const table = Table.define({
      name: tableName,
      dialect: this.dialect,
      columns,
      ...options,
    });

    table.database = this.client;

    if (!this.defintion.tables) {
      this.defintion.tables = {} as Tables;
    }

    this.defintion.tables = {
      ...this.defintion.tables,
      [tableName]: table,
    };

    // Create the table
    if (!this?.client) {
      throw new Error('Database not connected');
    }

    while (this.client.status === 'connecting') {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    await table.create(this.client);

    return this as unknown as Database<
      DbDialect,
      Tables & {
        [K in TableName]: Table<
          TableName,
          FinalColumns,
          DbDialect,
          CreatedAt,
          UpdatedAt,
          Timestamp,
          Paranoid
        >;
      },
      Definition & {
        tables: {
          [K in TableName]: Table<
            TableName,
            FinalColumns,
            DbDialect,
            CreatedAt,
            UpdatedAt,
            Timestamp,
            Paranoid
          >;
        };
      }
    >;
  }

  public async dropTable<TableName extends keyof Tables | (string & {})>(
    tableName: TableName
  ) {
    if (!this.defintion.tables) this.defintion.tables = {} as Tables;

    if (this.defintion.tables[tableName]) {
      await this.defintion.tables[tableName].drop(this.client);

      delete this.defintion.tables[tableName];

      return this as unknown as Database<
        DbDialect,
        Omit<Tables, TableName>,
        Definition & {
          tables: Omit<Tables, TableName>;
        }
      >;
    }

    await this.client.exec(`DROP TABLE IF EXISTS ${tableName as string};`);

    return this;
  }

  public async transaction<T, U extends () => Promise<T>>(fn: U) {
    return this.client.transaction(fn);
  }

  public static define<
    DbDialect extends Dialect,
    Tables extends Record<string, Table<string, Record<string, Column>>>,
  >(options: DatabaseOptions<DbDialect, Tables>) {
    return new Database(options);
  }
}
