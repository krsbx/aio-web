import type { Database } from '.';
import type { Column } from '../column';
import type { AcceptedColumnTypes } from '../column/constants';
import type { Table } from '../table';
import type { Dialect } from '../table/constants';
import type { MergeTimestampParanoid, TimestampOptions } from '../table/types';
import type { DatabaseDefinition } from './types';

export interface TableAlterationContract<
  DbDialect extends Dialect,
  Tables extends Record<string, Table<string, Record<string, Column>>>,
  Definition extends Partial<
    DatabaseDefinition<DbDialect>
  > = DatabaseDefinition<DbDialect>,
> {
  createTable<
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
    tableName: TableName,
    columns: Columns,
    options?: {
      paranoid?: Paranoid;
      timestamp?: Timestamp;
    }
  ): Promise<Database<DbDialect, NewTables, Definition>>;

  renameTable<
    OldName extends (keyof Tables & string) | (string & {}),
    NewName extends string,
    NewTables extends Omit<Tables, OldName> & {
      [K in NewName]: Tables[OldName];
    },
  >(
    oldName: OldName,
    newName: NewName
  ): Promise<
    Database<
      DbDialect,
      NewTables,
      Omit<Definition, 'tables'> & { tables: NewTables }
    >
  >;

  dropTable<TableName extends (keyof Tables & string) | (string & {})>(
    tableName: TableName
  ): Promise<Database<DbDialect, Omit<Tables, TableName>, Definition>>;
}

export interface ColumnAlterationContract<
  DbDialect extends Dialect,
  Tables extends Record<string, Table<string, Record<string, Column>>>,
  Definition extends Partial<
    DatabaseDefinition<DbDialect>
  > = DatabaseDefinition<DbDialect>,
> {
  addColumn<
    TableName extends (keyof Tables & string) | (string & {}),
    ColName extends
      | (keyof Tables[TableName]['columns'] & string)
      | (string & {}),
    NewTables extends Omit<Tables, TableName> & {
      [K in TableName]: Table<
        TableName,
        Tables[TableName]['columns'] & {
          [K in ColName]: Column;
        }
      >;
    },
  >(
    tableName: TableName,
    columnName: ColName,
    column: Column
  ): Promise<Database<DbDialect, NewTables, Definition>>;

  renameColumn<
    TableName extends (keyof Tables & string) | (string & {}),
    OldName extends
      | (keyof Tables[TableName]['columns'] & string)
      | (string & {}),
    NewName extends
      | (keyof Tables[TableName]['columns'] & string)
      | (string & {}),
    NewTables extends Omit<Tables, TableName> & {
      [K in TableName]: Table<
        TableName,
        Omit<Tables[TableName]['columns'], OldName> & {
          [K in NewName]: Tables[TableName]['columns'][OldName];
        }
      >;
    },
  >(
    tableName: TableName,
    oldName: OldName,
    newName: NewName
  ): Promise<Database<DbDialect, NewTables, Definition>>;

  dropColumn<
    TableName extends (keyof Tables & string) | (string & {}),
    ColName extends
      | (keyof Tables[TableName]['columns'] & string)
      | (string & {}),
    NewTables extends Omit<Tables, TableName> & {
      [K in TableName]: Table<
        TableName,
        Omit<Tables[TableName]['columns'], ColName>
      >;
    },
  >(
    tableName: TableName,
    columnName: ColName
  ): Promise<Database<DbDialect, NewTables, Definition>>;

  alterColumnType<
    TableName extends (keyof Tables & string) | (string & {}),
    ColName extends
      | (keyof Tables[TableName]['columns'] & string)
      | (string & {}),
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
    tableName: TableName,
    columnName: ColName,
    newType: Type
  ): Promise<Database<DbDialect, NewTables, Definition>>;

  setColumnDefault<
    TableName extends (keyof Tables & string) | (string & {}),
    ColName extends
      | (keyof Tables[TableName]['columns'] & string)
      | (string & {}),
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
    tableName: TableName,
    columnName: ColName,
    value: DefaultValue
  ): Promise<Database<DbDialect, NewTables, Definition>>;

  dropColumnDefault<
    TableName extends (keyof Tables & string) | (string & {}),
    ColName extends
      | (keyof Tables[TableName]['columns'] & string)
      | (string & {}),
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
    tableName: TableName,
    columnName: ColName
  ): Promise<Database<DbDialect, NewTables, Definition>>;

  setColumnNotNull<
    TableName extends (keyof Tables & string) | (string & {}),
    ColName extends
      | (keyof Tables[TableName]['columns'] & string)
      | (string & {}),
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
    tableName: TableName,
    columnName: ColName
  ): Promise<Database<DbDialect, NewTables, Definition>>;

  dropColumnNotNull<
    TableName extends (keyof Tables & string) | (string & {}),
    ColName extends
      | (keyof Tables[TableName]['columns'] & string)
      | (string & {}),
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
    tableName: TableName,
    columnName: ColName
  ): Promise<Database<DbDialect, NewTables, Definition>>;
}
