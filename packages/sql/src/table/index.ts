import type { Column } from '../column';
import type { DatabaseDialect } from '../database/types';
import { QueryBuilder } from '../query';
import type { Dialect } from './constants';
import type { TableOptions, TableOutput, TimestampOptions } from './types';
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
  public readonly _output!: TableOutput<
    TableName,
    Columns,
    DbDialect,
    CreatedAt,
    UpdatedAt,
    Timestamp,
    Paranoid
  >;

  protected constructor(
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

  public infer(): this['_output'] {
    return null as never;
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

  public async create(db: DatabaseDialect | null = this.database) {
    if (!db) throw new Error('Database client not defined');

    const sql = `CREATE TABLE IF NOT EXISTS ${this.name} (${Object.entries(
      this.columns
    )
      .map(([name, column]) => `${name} ${column.toQuery().query}`)
      .join(', ')});`;

    await db.exec(sql);

    return this;
  }

  public async drop(db: DatabaseDialect | null = this.database) {
    if (!db) throw new Error('Database client not defined');

    const sql = `DROP TABLE IF EXISTS ${this.name};`;

    await db.exec(sql);

    return this;
  }

  public query() {
    return new QueryBuilder(this).alias(this.name);
  }
}
