import { Column } from '../column';
import { QueryBuilder } from '../query';
import type { TableOptions, TimestampOptions } from './types';

type Columns = Record<string, Column>;

const defaultCreatedAt = new Column({
  type: 'DATETIME',
}).default('CURRENT_TIMESTAMP');

const defaultUpdatedAt = new Column({
  type: 'DATETIME',
});

const defaultDeletedAt = new Column({
  type: 'DATETIME',
});

export class Table<T extends string, U extends Columns> {
  public readonly name: T;
  public readonly columns: U;
  public readonly paranoid: string | null;
  public readonly timestamp: TimestampOptions | null;

  constructor(options: TableOptions<T, U>) {
    this.name = options.name;
    this.columns = options.columns;

    if (!options.paranoid) {
      // Hard delete by default
      this.paranoid = null;
    } else {
      this.paranoid =
        typeof options.paranoid === 'boolean' ? 'deletedAt' : options.paranoid;

      if (this.paranoid && !this.columns[this.paranoid]) {
        (this.columns as Columns)[this.paranoid] = defaultDeletedAt;
      }
    }

    // No timestamp by default
    if (!options.timestamp) {
      this.timestamp = null;
    } else {
      if (typeof options.timestamp !== 'boolean') {
        this.timestamp = {
          createdAt: options.timestamp?.createdAt ?? 'createdAt',
          updatedAt: options.timestamp?.updatedAt ?? 'updatedAt',
        };
      } else {
        this.timestamp = {
          createdAt: 'createdAt',
          updatedAt: 'updatedAt',
        };
      }

      if (this.timestamp.createdAt && !this.columns[this.timestamp.createdAt]) {
        (this.columns as Columns)[this.timestamp.createdAt] = defaultCreatedAt;
      }

      if (this.timestamp.updatedAt && !this.columns[this.timestamp.updatedAt]) {
        (this.columns as Columns)[this.timestamp.updatedAt] = defaultUpdatedAt;
      }
    }

    for (const column of Object.values(this.columns)) {
      // Set dialect for each column
      column.dialect(options.dialect);
    }
  }

  public query() {
    return new QueryBuilder(this);
  }
}
