import type { Column } from '../column';
import type { Database } from '../database';
import type { DatabaseDialect } from '../database/types';
import { QueryBuilder } from '../query';
import type { Dialect } from './constants';
import type { TableOptions, TimestampOptions } from './types';
import { defineColumns } from './utilities';

export class Table<
  TableName extends string,
  Columns extends Record<string, Column>,
  DbDialect extends Dialect = Dialect,
  CreatedAt extends string = string,
  UpdatedAt extends string = string,
  Timestamp extends TimestampOptions<CreatedAt, UpdatedAt> | boolean =
    | TimestampOptions<CreatedAt, UpdatedAt>
    | boolean,
  Paranoid extends string | boolean = string | boolean,
> {
  public database: DatabaseDialect | null;
  public readonly dialect: DbDialect;
  public readonly name: TableName;
  public readonly columns: Columns;
  public readonly timestamp: Timestamp | null;
  public readonly paranoid: Paranoid | null;

  private constructor(
    options: TableOptions<
      TableName,
      Columns,
      DbDialect,
      CreatedAt,
      UpdatedAt,
      Timestamp,
      Paranoid
    >
  ) {
    this.dialect = options.dialect;
    this.name = options.name;
    this.columns = options.columns;
    this.paranoid = options.paranoid || null;
    this.timestamp = options.timestamp || null;
    this.database = null;

    for (const column of Object.values(this.columns)) {
      // Set dialect for each column
      column.dialect(options.dialect);
    }
  }

  public static define<
    TableName extends string,
    Columns extends Record<string, Column>,
    DbDialect extends Dialect,
    CreatedAt extends string,
    UpdatedAt extends string,
    Timestamp extends TimestampOptions<CreatedAt, UpdatedAt> | boolean,
    Paranoid extends string | boolean,
  >(
    options: TableOptions<
      TableName,
      Columns,
      DbDialect,
      CreatedAt,
      UpdatedAt,
      Timestamp,
      Paranoid
    >
  ) {
    const columns = defineColumns(options);

    return new Table({
      ...options,
      columns,
    });
  }

  public async create<
    DbDialect extends Dialect,
    Tables extends Record<string, Table<string, Record<string, Column>>>,
    Db extends Database<DbDialect, Tables>,
  >(db: Db) {
    const sql = `CREATE TABLE IF NOT EXISTS ${this.name} (${Object.entries(
      this.columns
    )
      .map(([name, column]) => `${name} ${column.toQuery().query}`)
      .join(', ')});`;

    await db.client.exec(sql);

    return this;
  }

  public async drop<
    DbDialect extends Dialect,
    Tables extends Record<string, Table<string, Record<string, Column>>>,
    Db extends Database<DbDialect, Tables>,
  >(db: Db) {
    const sql = `DROP TABLE IF EXISTS ${this.name};`;

    await db.client.exec(sql);

    return this;
  }

  public query() {
    return new QueryBuilder(this).alias(this.name);
  }
}
