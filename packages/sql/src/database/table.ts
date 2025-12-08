import type { Database } from '.';
import type { Column } from '../column';
import { Table } from '../table';
import type { Dialect } from '../table/constants';
import type { MergeTimestampParanoid, TimestampOptions } from '../table/types';
import type { DatabaseDefinition } from './types';

export async function createTable<
  DbDialect extends Dialect,
  Tables extends Record<string, Table<string, Record<string, Column>>>,
  Definition extends Partial<DatabaseDefinition<DbDialect>>,
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

  table.client = this.client;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (this.tables as any)[tableName] = table;

  // Create the table
  if (!this?.client) {
    throw new Error('Database not connected');
  }

  while (this.client.status === 'connecting') {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  await table.create({
    db: this.client,
  });

  return this as unknown as Database<DbDialect, NewTables, Definition>;
}

export async function renameTable<
  DbDialect extends Dialect,
  Tables extends Record<string, Table<string, Record<string, Column>>>,
  Definition extends Partial<DatabaseDefinition<DbDialect>>,
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
  await this.client.exec({
    sql: `ALTER TABLE ${oldName} RENAME TO ${newName};`,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (this.tables as any)[newName] = this.tables[oldName];

  delete this.tables[oldName];

  return this as unknown as Database<DbDialect, NewTables, Definition>;
}

export async function dropTable<
  DbDialect extends Dialect,
  Tables extends Record<string, Table<string, Record<string, Column>>>,
  Definition extends Partial<DatabaseDefinition<DbDialect>>,
  TableName extends (keyof Tables & string) | (string & {}),
>(this: Database<DbDialect, Tables, Definition>, tableName: TableName) {
  if (!this.tables[tableName]) {
    await this.client.exec({
      sql: `DROP TABLE IF EXISTS ${tableName as string};`,
    });

    return this;
  }

  await this.tables[tableName].drop({
    db: this.client,
  });

  delete this.tables[tableName];

  return this as Database<DbDialect, Omit<Tables, TableName>, Definition>;
}
