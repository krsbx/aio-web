import type { Document } from '.';
import type { Field } from '../field';
import type { _id, createdAt, deletedAt, updatedAt } from './utilities';

export interface TimestampOptions<
  CreatedAt extends string | boolean,
  UpdatedAt extends string | boolean,
> {
  createdAt?: CreatedAt;
  updatedAt?: UpdatedAt;
}

export interface DocumentOptions<
  DocName extends string,
  Fields extends Record<string, Field>,
  CreatedAt extends string | boolean,
  UpdatedAt extends string | boolean,
  Timestamp extends TimestampOptions<CreatedAt, UpdatedAt> | boolean,
  Paranoid extends string | boolean,
> {
  name: DocName;
  fields: Fields;
  paranoid?: Paranoid;
  timestamp?: Timestamp;
}

export type MergeTimestampParanoid<
  Fields extends Record<string, Field>,
  CreatedAt extends string | boolean,
  UpdatedAt extends string | boolean,
  Timestamp extends TimestampOptions<CreatedAt, UpdatedAt> | boolean,
  Paranoid extends string | boolean,
> = Fields & { _id: typeof _id } & (Timestamp extends true
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

export type DocumentOutput<
  DocName extends string,
  Fields extends Record<string, Field>,
  CreatedAt extends string | boolean,
  UpdatedAt extends string | boolean,
  Timestamp extends TimestampOptions<CreatedAt, UpdatedAt> | boolean,
  Paranoid extends string | boolean,
  Doc extends Document<
    DocName,
    Fields,
    CreatedAt,
    UpdatedAt,
    Timestamp,
    Paranoid
  > = Document<DocName, Fields, CreatedAt, UpdatedAt, Timestamp, Paranoid>,
> = {
  [K in keyof Doc['fields'] & string]: Doc['fields'][K]['_output'];
};
