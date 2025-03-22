import type { Column } from '../column';
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

    for (const column of Object.values(this.columns)) {
      // Set dialect for each column
      column.dialect(options.dialect);
    }
  }

  public query() {
    return new QueryBuilder(this).alias(this.name);
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
}
