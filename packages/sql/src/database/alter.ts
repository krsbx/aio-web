import type { Database } from '.';
import type { Column } from '../column';
import type { AcceptedColumnTypes } from '../column/constants';
import type { Table } from '../table';
import { Dialect } from '../table/constants';
import type { DatabaseDefinition } from './types';

export async function alterColumnType<
  DbDialect extends Dialect,
  Tables extends Record<string, Table<string, Record<string, Column>>>,
  Definition extends Partial<DatabaseDefinition<DbDialect, Tables>>,
  TableName extends (keyof Tables & string) | (string & {}),
  ColName extends (keyof Tables[TableName]['columns'] & string) | (string & {}),
  Type extends Omit<AcceptedColumnTypes, typeof AcceptedColumnTypes.ENUM>,
  NewTables extends Omit<Tables, TableName> & {
    [K in TableName]: Table<
      TableName,
      Omit<Tables[TableName]['columns'], ColName> & {
        [K in ColName]: Tables[TableName]['columns'][ColName] & {
          type: Type;
        };
      }
    >;
  },
>(
  this: Database<DbDialect, Tables, Definition>,
  tableName: TableName,
  columnName: ColName,
  newType: Type
) {
  if (this.dialect === Dialect.SQLITE) {
    throw new Error('SQLite does not support ALTER COLUMN TYPE directly.');
  }

  await this.client.exec(
    `ALTER TABLE ${tableName} ALTER COLUMN ${columnName} TYPE ${newType}`
  );

  if (!this.defintion.tables) this.defintion.tables = {} as Tables;

  if (!this.defintion.tables[tableName]) return this;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (this.defintion.tables as any)[tableName].columns[columnName].type = newType;

  return this as unknown as Database<
    DbDialect,
    NewTables,
    Omit<Definition, 'tables'> & {
      tables: NewTables;
    }
  >;
}

export async function setColumnDefault<
  DbDialect extends Dialect,
  Tables extends Record<string, Table<string, Record<string, Column>>>,
  Definition extends Partial<DatabaseDefinition<DbDialect, Tables>>,
  TableName extends (keyof Tables & string) | (string & {}),
  ColName extends (keyof Tables[TableName]['columns'] & string) | (string & {}),
  DefaultValue extends string | number | boolean | null,
  NewTables extends Omit<Tables, TableName> & {
    [K in TableName]: Table<
      TableName,
      Omit<Tables[TableName]['columns'], ColName> & {
        [K in ColName]: Omit<
          Tables[TableName]['columns'][ColName],
          'definition'
        > & {
          definition: Omit<
            Tables[TableName]['columns'][ColName]['definition'],
            'default'
          > & {
            default: DefaultValue;
          };
        };
      }
    >;
  },
>(
  this: Database<DbDialect, Tables, Definition>,
  tableName: TableName,
  columnName: ColName,
  value: DefaultValue
) {
  if (this.dialect === Dialect.SQLITE) {
    throw new Error('SQLite does not support ALTER COLUMN DEFAULT directly.');
  }

  await this.client.exec(
    `ALTER TABLE ${tableName} ALTER COLUMN ${columnName} SET DEFAULT ${value}`
  );

  if (!this.defintion.tables) this.defintion.tables = {} as Tables;

  if (!this.defintion.tables[tableName]) return this;

  if (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    !(this.defintion.tables as any)[tableName].columns[columnName].definition
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.defintion.tables as any)[tableName].columns[columnName].definition =
      {};
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (this.defintion.tables as any)[tableName].columns[
    columnName
  ].definition.default = value;

  return this as unknown as Database<
    DbDialect,
    NewTables,
    Omit<Definition, 'tables'> & {
      tables: NewTables;
    }
  >;
}

export async function dropColumnDefault<
  DbDialect extends Dialect,
  Tables extends Record<string, Table<string, Record<string, Column>>>,
  Definition extends Partial<DatabaseDefinition<DbDialect, Tables>>,
  TableName extends (keyof Tables & string) | (string & {}),
  ColName extends (keyof Tables[TableName]['columns'] & string) | (string & {}),
  NewTables extends Omit<Tables, TableName> & {
    [K in TableName]: Table<
      TableName,
      Omit<Tables[TableName]['columns'], ColName> & {
        [K in ColName]: Omit<
          Tables[TableName]['columns'][ColName],
          'definition'
        > & {
          definition: Omit<
            Tables[TableName]['columns'][ColName]['definition'],
            'default'
          > & {
            default: undefined;
          };
        };
      }
    >;
  },
>(
  this: Database<DbDialect, Tables, Definition>,
  tableName: TableName,
  columnName: ColName
) {
  if (this.dialect === Dialect.SQLITE) {
    throw new Error('SQLite does not support DROP DEFAULT directly.');
  }

  await this.client.exec(
    `ALTER TABLE ${tableName} ALTER COLUMN ${columnName} DROP DEFAULT`
  );

  if (!this.defintion.tables) this.defintion.tables = {} as Tables;

  if (!this.defintion.tables[tableName]) return this;

  if (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    !(this.defintion.tables as any)[tableName].columns[columnName].definition
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.defintion.tables as any)[tableName].columns[columnName].definition =
      {};
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (this.defintion.tables as any)[tableName].columns[columnName]
    .definition.default;

  return this as unknown as Database<
    DbDialect,
    NewTables,
    Omit<Definition, 'tables'> & {
      tables: NewTables;
    }
  >;
}

export async function setColumnNotNull<
  DbDialect extends Dialect,
  Tables extends Record<string, Table<string, Record<string, Column>>>,
  Definition extends Partial<DatabaseDefinition<DbDialect, Tables>>,
  TableName extends (keyof Tables & string) | (string & {}),
  ColName extends (keyof Tables[TableName]['columns'] & string) | (string & {}),
  NewTables extends Omit<Tables, TableName> & {
    [K in TableName]: Table<
      TableName,
      Omit<Tables[TableName]['columns'], ColName> & {
        [K in ColName]: Omit<
          Tables[TableName]['columns'][ColName],
          'definition'
        > & {
          definition: Omit<
            Tables[TableName]['columns'][ColName]['definition'],
            'notNull'
          > & {
            notNull: true;
          };
        };
      }
    >;
  },
>(
  this: Database<DbDialect, Tables, Definition>,
  tableName: TableName,
  columnName: ColName
) {
  if (this.dialect === Dialect.SQLITE) {
    throw new Error(
      'SQLite does not support SET NOT NULL (requires table rebuild)'
    );
  }

  await this.client.exec(
    `ALTER TABLE ${tableName} ALTER COLUMN ${columnName} SET NOT NULL`
  );

  if (!this.defintion.tables) this.defintion.tables = {} as Tables;

  if (!this.defintion.tables[tableName]) return this;

  if (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    !(this.defintion.tables as any)[tableName].columns[columnName].definition
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.defintion.tables as any)[tableName].columns[columnName].definition =
      {};
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (this.defintion.tables as any)[tableName].columns[
    columnName
  ].definition.notNull = true;

  return this as unknown as Database<
    DbDialect,
    NewTables,
    Omit<Definition, 'tables'> & {
      tables: NewTables;
    }
  >;
}

export async function dropColumnNotNull<
  DbDialect extends Dialect,
  Tables extends Record<string, Table<string, Record<string, Column>>>,
  Definition extends Partial<DatabaseDefinition<DbDialect, Tables>>,
  TableName extends (keyof Tables & string) | (string & {}),
  ColName extends (keyof Tables[TableName]['columns'] & string) | (string & {}),
  NewTables extends Omit<Tables, TableName> & {
    [K in TableName]: Table<
      TableName,
      Omit<Tables[TableName]['columns'], ColName> & {
        [K in ColName]: Omit<
          Tables[TableName]['columns'][ColName],
          'definition'
        > & {
          definition: Omit<
            Tables[TableName]['columns'][ColName]['definition'],
            'notNull'
          >;
        };
      }
    >;
  },
>(
  this: Database<DbDialect, Tables, Definition>,
  tableName: TableName,
  columnName: ColName
) {
  if (this.dialect === Dialect.SQLITE) {
    throw new Error(
      'SQLite does not support DROP NOT NULL (requires table rebuild)'
    );
  }

  await this.client.exec(
    `ALTER TABLE ${tableName} ALTER COLUMN ${columnName} DROP NOT NULL`
  );

  if (!this.defintion.tables) this.defintion.tables = {} as Tables;

  if (!this.defintion.tables[tableName]) return this;

  if (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    !(this.defintion.tables as any)[tableName].columns[columnName].definition
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.defintion.tables as any)[tableName].columns[columnName].definition =
      {};
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (this.defintion.tables as any)[tableName].columns[
    columnName
  ].definition.notNull = null;

  return this as unknown as Database<
    DbDialect,
    NewTables,
    Omit<Definition, 'tables'> & {
      tables: NewTables;
    }
  >;
}
