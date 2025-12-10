import type { TransactionSQL } from 'bun';
import type { Table } from '.';
import type { Column } from '../column';
import type { DatabaseDialect } from '../database/types';
import type { Dialect } from './constants';
import type { createdAt, deletedAt, updatedAt } from './utilities';

export interface TimestampOptions<
  CreatedAt extends string | boolean,
  UpdatedAt extends string | boolean,
> {
  createdAt?: CreatedAt;
  updatedAt?: UpdatedAt;
}

export interface TableOptions<
  TableName extends string,
  Columns extends Record<string, Column>,
  DbDialect extends Dialect,
  CreatedAt extends string | boolean,
  UpdatedAt extends string | boolean,
  Timestamp extends TimestampOptions<CreatedAt, UpdatedAt> | boolean,
  Paranoid extends string | boolean,
> {
  dialect?: DbDialect;
  name: TableName;
  columns: Columns;
  paranoid?: Paranoid;
  timestamp?: Timestamp;
}

export type MergeTimestampParanoid<
  Columns extends Record<string, Column>,
  CreatedAt extends string | boolean,
  UpdatedAt extends string | boolean,
  Timestamp extends TimestampOptions<CreatedAt, UpdatedAt> | boolean,
  Paranoid extends string | boolean,
> = Columns &
  (Timestamp extends true
    ? {
        createdAt: typeof createdAt;
        updatedAt: typeof updatedAt;
      }
    : Timestamp extends TimestampOptions<CreatedAt, UpdatedAt>
      ? (Timestamp['createdAt'] extends CreatedAt
          ? Timestamp['createdAt'] extends true
            ? {
                createdAt: typeof createdAt;
              }
            : Timestamp['createdAt'] extends string
              ? {
                  [K in Timestamp['createdAt']]: typeof createdAt;
                }
              : NonNullable<unknown>
          : {
              createdAt: typeof createdAt;
            }) &
          (Timestamp['updatedAt'] extends UpdatedAt
            ? Timestamp['updatedAt'] extends true
              ? {
                  updatedAt: typeof updatedAt;
                }
              : Timestamp['updatedAt'] extends string
                ? {
                    [K in Timestamp['updatedAt']]: typeof updatedAt;
                  }
                : NonNullable<unknown>
            : {
                updatedAt: typeof updatedAt;
              })
      : NonNullable<unknown>) &
  (Paranoid extends true
    ? {
        deletedAt: typeof deletedAt;
      }
    : Paranoid extends string
      ? {
          [K in Paranoid]: typeof deletedAt;
        }
      : NonNullable<unknown>);

export type TableOutput<
  TableName extends string,
  Columns extends Record<string, Column>,
  DbDialect extends Dialect,
  CreatedAt extends string | boolean,
  UpdatedAt extends string | boolean,
  Timestamp extends TimestampOptions<CreatedAt, UpdatedAt> | boolean,
  Paranoid extends string | boolean,
  TableRef extends Table<
    TableName,
    Columns,
    DbDialect,
    CreatedAt,
    UpdatedAt,
    Timestamp,
    Paranoid
  > = Table<
    TableName,
    Columns,
    DbDialect,
    CreatedAt,
    UpdatedAt,
    Timestamp,
    Paranoid
  >,
> = {
  [K in keyof TableRef['columns'] & string]: TableRef['columns'][K]['_output'];
};

export interface ExecOptions {
  tx?: TransactionSQL | null;
  db?: DatabaseDialect | null;
}
