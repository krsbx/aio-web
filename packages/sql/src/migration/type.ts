import type { Column } from '../column';
import type { Database } from '../database';
import type { Table } from '../table';
import type { Dialect } from '../table/constants';

export interface MigrationOptions<
  DbDialect extends Dialect,
  Tables extends Record<string, Table<string, Record<string, Column>>>,
> {
  db: Database<DbDialect, Tables>;
  up: (() => Promise<void>) | null;
  down: (() => Promise<void>) | null;
}

export interface MigrationFn<
  DbDialect extends Dialect,
  Tables extends Record<string, Table<string, Record<string, Column>>>,
> {
  (db: Database<DbDialect, Tables>): Promise<void>;
}
