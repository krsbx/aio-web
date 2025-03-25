import type { Column } from '../column';
import type { Database } from '../database';
import type { Table } from '../table';
import type { Dialect } from '../table/constants';
import type { MigrationFn, MigrationOptions } from './type';

export class Migration<
  DbDialect extends Dialect,
  Tables extends Record<string, Table<string, Record<string, Column>>>,
> {
  public readonly db: Database<DbDialect, Tables>;
  public useTransaction: boolean;
  private _up: (() => Promise<void>) | null;
  private _down: (() => Promise<void>) | null;

  private constructor(options: MigrationOptions<DbDialect, Tables>) {
    this.db = options.db;
    this.useTransaction = options.useTransaction ?? true;

    this._up = options.up;
    this._down = options.down;
  }

  public get up() {
    return this._up;
  }

  public get down() {
    return this._down;
  }

  public static setUp<
    DbDialect extends Dialect,
    Tables extends Record<string, Table<string, Record<string, Column>>>,
    Migrator extends Migration<DbDialect, Tables>,
    Fn extends MigrationFn<DbDialect, Tables>,
  >(migrator: Migrator, fn: Fn) {
    migrator._up = () => fn(migrator.db);

    return migrator;
  }

  public static setDown<
    DbDialect extends Dialect,
    Tables extends Record<string, Table<string, Record<string, Column>>>,
    Migrator extends Migration<DbDialect, Tables>,
    Fn extends MigrationFn<DbDialect, Tables>,
  >(migrator: Migrator, fn: Fn) {
    migrator._down = () => fn(migrator.db);

    return migrator;
  }

  public static define<
    DbDialect extends Dialect,
    Tables extends Record<string, Table<string, Record<string, Column>>>,
  >(
    db: Database<DbDialect, Tables>,
    options?: {
      up?: MigrationFn<DbDialect, Tables>;
      down?: MigrationFn<DbDialect, Tables>;
      useTransaction?: boolean;
    }
  ) {
    const migration = new Migration({
      db,
      up: options?.up ? () => options.up!(db) : null,
      down: options?.down ? () => options.down!(db) : null,
      useTransaction: options?.useTransaction ?? true,
    });

    return {
      migration,
      setUp<Fn extends MigrationFn<DbDialect, Tables>>(fn: Fn) {
        return Migration.setUp<DbDialect, Tables, typeof migration, Fn>(
          migration,
          fn
        );
      },
      setDown<Fn extends MigrationFn<DbDialect, Tables>>(fn: Fn) {
        return Migration.setDown<DbDialect, Tables, typeof migration, Fn>(
          migration,
          fn
        );
      },
    };
  }
}
