import type { Table } from '.';
import type { Column } from '../column';
import type { Dialect } from './constants';
import type { createdAt, deletedAt, updatedAt } from './utilities';

export interface TimestampOptions<
  CreatedAt extends string,
  UpdatedAt extends string,
> {
  createdAt?: CreatedAt;
  updatedAt?: UpdatedAt;
}

export interface TableOptions<
  TableName extends string,
  Columns extends Record<string, Column>,
  DbDialect extends Dialect,
  CreatedAt extends string,
  UpdatedAt extends string,
  Timestamp extends TimestampOptions<CreatedAt, UpdatedAt> | boolean,
  Paranoid extends string | boolean,
> {
  dialect: DbDialect;
  name: TableName;
  columns: Columns;
  paranoid?: Paranoid;
  timestamp?: Timestamp;
}

export type MergeTimestampParanoid<
  Columns extends Record<string, Column>,
  CreatedAt extends string,
  UpdatedAt extends string,
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
          ? {
              [K in Timestamp['createdAt']]: typeof createdAt;
            }
          : {
              createdAt: typeof createdAt;
            }) &
          (Timestamp['updatedAt'] extends UpdatedAt
            ? {
                [K in Timestamp['updatedAt']]: typeof updatedAt;
              }
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
  CreatedAt extends string,
  UpdatedAt extends string,
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
