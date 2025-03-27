import { Field } from '../fields';
import type {
  DocumentOptions,
  MergeTimestampParanoid,
  TimestampOptions,
} from './types';

export const _id = Field.define({
  type: 'STRING',
});

export const createdAt = Field.define({
  type: 'TIMESTAMP',
});

export const updatedAt = Field.define({
  type: 'TIMESTAMP',
});

export const deletedAt = Field.define({
  type: 'TIMESTAMP',
});

export function defineFields<
  DocName extends string,
  Fields extends Record<string, Field>,
  CreatedAt extends string,
  UpdatedAt extends string,
  Timestamp extends TimestampOptions<CreatedAt, UpdatedAt> | boolean,
  Paranoid extends string | boolean,
  FinalFields extends MergeTimestampParanoid<
    Fields,
    CreatedAt,
    UpdatedAt,
    Timestamp,
    Paranoid
  >,
>(
  options: DocumentOptions<
    DocName,
    Fields,
    CreatedAt,
    UpdatedAt,
    Timestamp,
    Paranoid
  >
) {
  const fields: Record<string, Field> = {
    _id,
    ...options.fields,
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

    if (!fields[timestamp.createdAt]) {
      fields[timestamp.createdAt] = createdAt;
    }

    if (!fields[timestamp.updatedAt]) {
      fields[timestamp.updatedAt] = updatedAt;
    }
  }

  if (options.paranoid) {
    if (typeof options.paranoid !== 'boolean') {
      tracker.deletedAt = options.paranoid as string;
    }

    if (!fields[tracker.deletedAt]) {
      fields[tracker.deletedAt] = deletedAt;
    }
  }

  return fields as FinalFields;
}
