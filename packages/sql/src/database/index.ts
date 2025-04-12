import type { Column } from '../column';
import type { QueryBuilder } from '../query';
import { Table } from '../table';
import { Dialect } from '../table/constants';
import {
  alterColumnType,
  dropColumnDefault,
  dropColumnNotNull,
  setColumnDefault,
} from './alter';
import { addColumn, dropColumn, renameColumn } from './column';
import type {
  ColumnAlterationContract,
  TableAlterationContract,
} from './contract';
import { createTable, dropTable, renameTable } from './table';
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
    DatabaseDefinition<DbDialect>
  > = DatabaseDefinition<DbDialect>,
> {
  public readonly dialect: DbDialect;
  public readonly defintion: Definition;
  public readonly tables: Tables;
  public readonly client: DatabaseDialect;

  public createTable: TableAlterationContract<
    DbDialect,
    Tables,
    Definition
  >['createTable'];
  public renameTable: TableAlterationContract<
    DbDialect,
    Tables,
    Definition
  >['renameTable'];
  public dropTable: TableAlterationContract<
    DbDialect,
    Tables,
    Definition
  >['dropTable'];

  public addColumn: ColumnAlterationContract<
    DbDialect,
    Tables,
    Definition
  >['addColumn'];
  public renameColumn: ColumnAlterationContract<
    DbDialect,
    Tables,
    Definition
  >['renameColumn'];
  public dropColumn: ColumnAlterationContract<
    DbDialect,
    Tables,
    Definition
  >['dropColumn'];

  public alterColumnType: ColumnAlterationContract<
    DbDialect,
    Tables,
    Definition
  >['alterColumnType'];

  public setColumnDefault: ColumnAlterationContract<
    DbDialect,
    Tables,
    Definition
  >['setColumnDefault'];
  public dropColumnDefault: ColumnAlterationContract<
    DbDialect,
    Tables,
    Definition
  >['dropColumnDefault'];

  public setColumnNotNull: ColumnAlterationContract<
    DbDialect,
    Tables,
    Definition
  >['setColumnNotNull'];
  public dropColumnNotNull: ColumnAlterationContract<
    DbDialect,
    Tables,
    Definition
  >['dropColumnNotNull'];

  protected constructor(options: DatabaseOptions<DbDialect, Tables>) {
    this.dialect = options.dialect;
    this.tables = options.tables ?? ({} as Tables);
    this.defintion = {
      dialect: options.dialect,
      config: options.config,
    } as unknown as Definition;

    this.client =
      options.dialect === Dialect.POSTGRES
        ? new DatabasePsql(options.config as PostgresConfig)
        : new DatabaseSqlite(options.config as SqliteConfig);

    if (options.tables) {
      for (const tableName in options.tables) {
        options.tables[tableName].client = this.client;
      }
    }

    this.createTable = createTable.bind(this) as this['createTable'];
    this.renameTable = renameTable.bind(this) as this['renameTable'];
    this.dropTable = dropTable.bind(this) as this['dropTable'];

    this.addColumn = addColumn.bind(this) as this['addColumn'];
    this.renameColumn = renameColumn.bind(this) as this['renameColumn'];
    this.dropColumn = dropColumn.bind(this) as this['dropColumn'];

    this.alterColumnType = alterColumnType.bind(
      this
    ) as this['alterColumnType'];

    this.setColumnDefault = setColumnDefault.bind(
      this
    ) as this['setColumnDefault'];
    this.dropColumnDefault = dropColumnDefault.bind(
      this
    ) as this['dropColumnDefault'];

    this.setColumnNotNull = setColumnDefault.bind(
      this
    ) as this['setColumnNotNull'];
    this.dropColumnNotNull = dropColumnNotNull.bind(
      this
    ) as this['dropColumnNotNull'];
  }

  public table<
    TableName extends keyof Tables & string,
    Table extends Tables[TableName],
  >(tableName: TableName) {
    if (!this.tables[tableName]) {
      throw new Error(`Table ${tableName as string} does not exist`);
    }

    const table = this.tables[tableName];

    // Fix the type
    return table.query() as unknown as QueryBuilder<TableName, Table>;
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
