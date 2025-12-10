import type { Column } from '../column';
import type { DatabaseDialect } from '../database/types';
import { QueryBuilder } from '../query';
import type { Dialect } from './constants';
import type {
  ExecOptions,
  TableOptions,
  TableOutput,
  TimestampOptions,
} from './types';
import { defineColumns } from './utilities';

export class Table<
  TableName extends string,
  Columns extends Record<string, Column>,
  DbDialect extends Dialect = Dialect,
  CreatedAt extends string | boolean = string | boolean,
  UpdatedAt extends string | boolean = string | boolean,
  Timestamp extends TimestampOptions<CreatedAt, UpdatedAt> | boolean =
    | TimestampOptions<CreatedAt, UpdatedAt>
    | boolean,
  Paranoid extends string | boolean = string | boolean,
> {
  public client: DatabaseDialect | null;
  private _dialect: DbDialect | null;
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
    this._dialect = options.dialect || null;
    this.name = options.name;
    this.columns = options.columns;
    this.paranoid = options.paranoid || null;
    this.timestamp = options.timestamp || null;
    this.client = null;

    if (!this._dialect) return;

    this.setColumnDialect(this._dialect);
  }

  public infer(): this['_output'] {
    return null as never;
  }

  public static define<
    TableName extends string,
    Columns extends Record<string, Column>,
    DbDialect extends Dialect,
    CreatedAt extends string | boolean,
    UpdatedAt extends string | boolean,
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

  public setColumnDialect<DbDialect extends Dialect>(dialect: DbDialect) {
    for (const column of Object.values(this.columns)) {
      // Set dialect for each column
      column.dialect(dialect);
    }
  }

  public get dialect() {
    return this._dialect;
  }

  public setDialect<DbDialect extends Dialect>(dialect: DbDialect) {
    this._dialect = dialect as never;

    this.setColumnDialect(dialect);

    return this as unknown as Table<
      TableName,
      Columns,
      DbDialect,
      CreatedAt,
      UpdatedAt,
      Timestamp,
      Paranoid
    >;
  }

  public async create(options: ExecOptions = {}) {
    const db = options.db || this.client;

    if (!db) throw new Error('Database client not defined');

    const sql = `CREATE TABLE IF NOT EXISTS ${this.name} (${Object.entries(
      this.columns
    )
      .map(([name, column]) => `${name} ${column.toQuery().query}`)
      .join(', ')});`;

    await db.exec({
      sql,
      tx: options.tx,
    });

    return this;
  }

  public async drop(options: ExecOptions = {}) {
    const db = options.db || this.client;

    if (!db) throw new Error('Database client not defined');

    const sql = `DROP TABLE IF EXISTS ${this.name};`;

    await db.exec({
      sql,
      tx: options.tx,
    });

    return this;
  }

  public query() {
    return new QueryBuilder(this);
  }
}
