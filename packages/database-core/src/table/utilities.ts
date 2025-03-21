import { Column } from '../column';
import type { Dialect } from './constants';
import type {
  MergeTimestampParanoid,
  TableOptions,
  TimestampOptions,
} from './types';

export const defaultCreatedAt = new Column({
  type: 'DATETIME',
}).default('CURRENT_TIMESTAMP');

export const defaultUpdatedAt = new Column({
  type: 'DATETIME',
});

export const defaultDeletedAt = new Column({
  type: 'DATETIME',
});

export function defineColumns<
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
>(
  options: TableOptions<
    TableName,
    Columns,
    Dialect,
    CreatedAt,
    UpdatedAt,
    Timestamp,
    Paranoid
  >
) {
  const columns: Record<string, Column> = {
    ...options.columns,
  };

  const tracker = {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt',
  };

  if (options.timestamp) {
    const timestamp = {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    };

    if (typeof options.timestamp === 'object') {
      if (typeof options.timestamp.createdAt === 'string') {
        timestamp.createdAt = options.timestamp.createdAt;
      }

      if (typeof options.timestamp.updatedAt === 'string') {
        timestamp.updatedAt = options.timestamp.updatedAt;
      }
    }

    if (!columns[timestamp.createdAt]) {
      columns[timestamp.createdAt] = defaultCreatedAt;
    }

    if (!columns[timestamp.updatedAt]) {
      columns[timestamp.updatedAt] = defaultUpdatedAt;
    }
  }

  if (options.paranoid) {
    if (typeof options.paranoid !== 'boolean') {
      tracker.deletedAt = options.paranoid as string;
    }

    if (!columns[tracker.deletedAt]) {
      columns[tracker.deletedAt] = defaultDeletedAt;
    }
  }

  return columns as FinalColumns;
}
