import type {
  defaultCreatedAt,
  defaultDeletedAt,
  defaultUpdatedAt,
} from './utilities';
import type { Column } from '../column';
import type { Dialect } from './constants';

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
  createdAt?: CreatedAt;
  updatedAt?: UpdatedAt;
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
        createdAt: typeof defaultCreatedAt;
        updatedAt: typeof defaultUpdatedAt;
      }
    : Timestamp extends TimestampOptions<CreatedAt, UpdatedAt>
      ? (Timestamp['createdAt'] extends CreatedAt
          ? {
              [K in Timestamp['createdAt']]: typeof defaultCreatedAt;
            }
          : {
              createdAt: typeof defaultCreatedAt;
            }) &
          (Timestamp['updatedAt'] extends UpdatedAt
            ? {
                [K in Timestamp['updatedAt']]: typeof defaultUpdatedAt;
              }
            : {
                updatedAt: typeof defaultUpdatedAt;
              })
      : NonNullable<unknown>) &
  (Paranoid extends true
    ? {
        deletedAt: typeof defaultDeletedAt;
      }
    : Paranoid extends string
      ? {
          [K in Paranoid]: typeof defaultDeletedAt;
        }
      : NonNullable<unknown>);
