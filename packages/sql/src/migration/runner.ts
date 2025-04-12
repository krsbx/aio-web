import type { Migration } from '.';
import { Column } from '../column';
import { Table } from '../table';
import type { Dialect } from '../table/constants';

const nameColumn = Column.define({
  type: 'TEXT',
  length: 255,
})
  .primaryKey()
  .notNull();
const runAtColumn = Column.define({
  type: 'DATETIME',
}).notNull();

let migrationTable: Table<
  'ignisia_migration',
  {
    name: typeof nameColumn;
    runAt: typeof runAtColumn;
  }
> | null = null;

export async function runMigration(filePath: string, direction: 'up' | 'down') {
  const migrationFile = (await import(filePath)) as {
    migration: Migration<
      Dialect,
      Record<string, Table<string, Record<string, Column>>>
    >;
  };
  const fileName = filePath.split('/').pop()!;

  if (!migrationFile || !migrationFile.migration) {
    throw new Error(
      'Invalid migration file! A migration file must export a migration as "migration"'
    );
  }

  const { migration } = migrationFile;

  if (!migrationTable) {
    migrationTable = Table.define({
      name: 'ignisia_migration',
      columns: {
        name: nameColumn,
        runAt: runAtColumn,
      },
      dialect: migration.db.dialect,
    });

    migrationTable.client = migration.db.client;

    // Create the migration table
    await migrationTable.create();
  }

  const fn = migration[direction];

  if (!fn)
    throw new Error('No migration function found for direction: ' + direction);

  const [lastRun] = await migrationTable
    .query()
    .select('ignisia_migration.*')
    .limit(1)
    .where('ignisia_migration."name"', 'eq', fileName)
    .exec();

  if (lastRun) {
    console.log('Migration already run!');
    console.log('Run At\t: ' + new Date(lastRun.runAt).toDateString());
    console.log('Name\t: ' + fileName);
    return;
  }

  const query = migrationTable.query();

  await migration.db.client.transaction(async () => {
    // Call the migration
    await fn();

    if (direction === 'up') {
      return query
        .insert({
          name: fileName,
          runAt: new Date().toISOString(),
        })
        .exec();
    }

    return query
      .delete()
      .where('ignisia_migration."name"', 'eq', fileName)
      .exec();
  });
}
