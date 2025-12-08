import type { Database } from '.';
import type { Column } from '../column';
import type { Table } from '../table';
import { Dialect } from '../table/constants';
import type { DatabaseDefinition } from './types';

export async function addColumn<
  DbDialect extends Dialect,
  Tables extends Record<string, Table<string, Record<string, Column>>>,
  Definition extends Partial<DatabaseDefinition<DbDialect>>,
  TableName extends (keyof Tables & string) | (string & {}),
  ColName extends (keyof Tables[TableName]['columns'] & string) | (string & {}),
  NewTables extends Omit<Tables, TableName> & {
    [K in TableName]: Table<
      TableName,
      Tables[TableName]['columns'] & {
        [K in ColName]: Column;
      }
    >;
  },
>(
  this: Database<DbDialect, Tables, Definition>,
  tableName: TableName,
  columnName: ColName,
  column: Column
) {
  await this.client.exec({
    sql: `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${column.toString()};`,
  });

  if (!this.tables[tableName]) return this;

  this.tables[tableName].columns[columnName] = column;

  return this as unknown as Database<DbDialect, NewTables, Definition>;
}

export async function renameColumn<
  DbDialect extends Dialect,
  Tables extends Record<string, Table<string, Record<string, Column>>>,
  Definition extends Partial<DatabaseDefinition<DbDialect>>,
  TableName extends (keyof Tables & string) | (string & {}),
  OldName extends (keyof Tables[TableName]['columns'] & string) | (string & {}),
  NewName extends (keyof Tables[TableName]['columns'] & string) | (string & {}),
  NewTables extends Omit<Tables, TableName> & {
    [K in TableName]: Table<
      TableName,
      Omit<Tables[TableName]['columns'], OldName> & {
        [K in NewName]: Tables[TableName]['columns'][OldName];
      }
    >;
  },
>(
  this: Database<DbDialect, Tables, Definition>,
  tableName: TableName,
  oldName: OldName,
  newName: NewName
) {
  if (this.dialect === Dialect.SQLITE) {
    throw new Error('SQLite does not support RENAME COLUMN natively.');
  }

  await this.client.exec({
    sql: `ALTER TABLE ${tableName} RENAME COLUMN ${oldName} TO ${newName};`,
  });

  if (!this.tables[tableName]) return this;

  this.tables[tableName].columns[newName] =
    this.tables[tableName].columns[oldName];

  delete this.tables[tableName].columns[oldName];

  return this as unknown as Database<DbDialect, NewTables, Definition>;
}

export async function dropColumn<
  DbDialect extends Dialect,
  Tables extends Record<string, Table<string, Record<string, Column>>>,
  Definition extends Partial<DatabaseDefinition<DbDialect>>,
  TableName extends (keyof Tables & string) | (string & {}),
  ColName extends (keyof Tables[TableName]['columns'] & string) | (string & {}),
  NewTables extends Omit<Tables, TableName> & {
    [K in TableName]: Table<
      TableName,
      Omit<Tables[TableName]['columns'], ColName>
    >;
  },
>(
  this: Database<DbDialect, Tables, Definition>,
  tableName: TableName,
  columnName: ColName
) {
  if (this.dialect === Dialect.SQLITE) {
    throw new Error('SQLite does not support DROP COLUMN natively.');
  }

  await this.client.exec({
    sql: `ALTER TABLE ${tableName} DROP COLUMN ${columnName};`,
  });

  if (!this.tables[tableName]) return this;

  delete this.tables[tableName].columns[columnName];

  return this as unknown as Database<DbDialect, NewTables, Definition>;
}
