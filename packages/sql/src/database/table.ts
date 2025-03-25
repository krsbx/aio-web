import type { Database } from '.';
import type { Column } from '../column';
import { Table } from '../table';
import type { Dialect } from '../table/constants';
import type { MergeTimestampParanoid, TimestampOptions } from '../table/types';
import type { DatabaseDefinition } from './types';

export async function createTable<
  DbDialect extends Dialect,
  Tables extends Record<string, Table<string, Record<string, Column>>>,
  Definition extends Partial<DatabaseDefinition<DbDialect, Tables>>,
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
  NewTables extends Tables & {
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
>(
  this: Database<DbDialect, Tables, Definition>,
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
    NewTables,
    Definition & {
      tables: NewTables;
    }
  >;
}

export async function renameTable<
  DbDialect extends Dialect,
  Tables extends Record<string, Table<string, Record<string, Column>>>,
  Definition extends Partial<DatabaseDefinition<DbDialect, Tables>>,
  OldName extends (keyof Tables & string) | (string & {}),
  NewName extends string,
  NewTables extends Omit<Tables, OldName> & {
    [K in NewName]: Tables[OldName];
  },
>(
  this: Database<DbDialect, Tables, Definition>,
  oldName: OldName,
  newName: NewName
) {
  await this.client.exec(`ALTER TABLE ${oldName} RENAME TO ${newName};`);

  if (!this.defintion.tables) this.defintion.tables = {} as Tables;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (this.defintion.tables as any)[newName] = this.defintion.tables[oldName];

  delete this.defintion.tables[oldName];

  return this as unknown as Database<
    DbDialect,
    NewTables,
    Omit<Definition, 'tables'> & {
      tables: NewTables;
    }
  >;
}

export async function dropTable<
  DbDialect extends Dialect,
  Tables extends Record<string, Table<string, Record<string, Column>>>,
  Definition extends Partial<DatabaseDefinition<DbDialect, Tables>>,
  TableName extends (keyof Tables & string) | (string & {}),
>(this: Database<DbDialect, Tables, Definition>, tableName: TableName) {
  if (!this.defintion.tables) this.defintion.tables = {} as Tables;

  if (!this.defintion.tables[tableName]) {
    await this.client.exec(`DROP TABLE IF EXISTS ${tableName as string};`);

    return this;
  }

  await this.defintion.tables[tableName].drop(this.client);

  delete this.defintion.tables[tableName];

  return this as Database<
    DbDialect,
    Omit<Tables, TableName>,
    Definition & {
      tables: Omit<Tables, TableName>;
    }
  >;
}
