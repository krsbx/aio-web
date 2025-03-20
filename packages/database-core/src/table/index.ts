import { Column } from '../column';
import { QueryBuilder } from '../query';
import type { TableOptions, TimestampOptions } from './types';

const defaultCreatedAt = new Column({
  type: 'DATETIME',
}).default('CURRENT_TIMESTAMP');

const defaultUpdatedAt = new Column({
  type: 'DATETIME',
});

const defaultDeletedAt = new Column({
  type: 'DATETIME',
});

export class Table<
  TableName extends string,
  Columns extends Record<string, Column>,
> {
  public readonly name: TableName;
  public readonly columns: Columns;
  public readonly paranoid: string | null;
  public readonly timestamp: TimestampOptions | null;

  constructor(options: TableOptions<TableName, Columns>) {
    this.name = options.name;
    this.columns = options.columns;

    if (!options.paranoid) {
      // Hard delete by default
      this.paranoid = null;
    } else {
      this.paranoid =
        typeof options.paranoid === 'boolean' ? 'deletedAt' : options.paranoid;

      if (this.paranoid && !this.columns[this.paranoid]) {
        (this.columns as Record<string, Column>)[this.paranoid] =
          defaultDeletedAt;
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
        (this.columns as Record<string, Column>)[this.timestamp.createdAt] =
          defaultCreatedAt;
      }

      if (this.timestamp.updatedAt && !this.columns[this.timestamp.updatedAt]) {
        (this.columns as Record<string, Column>)[this.timestamp.updatedAt] =
          defaultUpdatedAt;
      }
    }

    for (const column of Object.values(this.columns)) {
      // Set dialect for each column
      column.dialect(options.dialect);
    }
  }

  public query() {
    return new QueryBuilder(this).alias(this.name);
  }
}
