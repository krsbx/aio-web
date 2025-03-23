import type { QueryBuilder } from '.';
import type { Column } from '../column';
import type { Table } from '../table';
import type { ColumnSelector, QueryDefinition } from './types';
import { getTableSelectName } from './utilities';

export function buildSelectQuery<
  Alias extends string,
  TableRef extends Table<string, Record<string, Column>>,
  JoinedTables extends Record<string, Table<string, Record<string, Column>>>,
  Definition extends Partial<QueryDefinition<Alias, TableRef, JoinedTables>>,
  AllowedColumn extends ColumnSelector<Alias, TableRef, JoinedTables>,
  Query extends QueryBuilder<
    Alias,
    TableRef,
    JoinedTables,
    Definition,
    AllowedColumn
  >,
>(q: Query) {
  const from = getTableSelectName(q);
  const columns: string[] = [];

  if (q.definition.select?.length) {
    for (const col of q.definition.select) {
      if (typeof col === 'object') {
        columns.push(`${col.column} AS ${col.as}`);
        continue;
      }

      columns.push(col);
    }
  }

  if (q.definition?.aggregates) {
    for (const aggregate of q.definition.aggregates) {
      columns.push(`${aggregate.fn}(${aggregate.column}) AS ${aggregate.as}`);
    }
  }

  if (!columns.length) {
    columns.push('*');
  }

  const distinct = q.definition.distinct ? 'DISTINCT ' : '';

  return `SELECT ${distinct}${columns.join(', ')} FROM ${from}`;
}

export function buildInsertQuery<
  Alias extends string,
  TableRef extends Table<string, Record<string, Column>>,
  JoinedTables extends Record<string, Table<string, Record<string, Column>>>,
  Definition extends Partial<QueryDefinition<Alias, TableRef, JoinedTables>>,
  AllowedColumn extends ColumnSelector<Alias, TableRef, JoinedTables>,
  Query extends QueryBuilder<
    Alias,
    TableRef,
    JoinedTables,
    Definition,
    AllowedColumn
  >,
>(q: Query) {
  const rows = q.definition?.insertValues;

  if (!rows?.length) {
    throw new Error(`INSERT requires values`);
  }

  const keys = Object.keys(rows[0]);

  const columns = keys.join(', ');
  const rowPlaceholders = `(${keys.map(() => '?').join(', ')})`;
  const placeholders = rows.map(() => rowPlaceholders).join(', ');

  q.definition.params = rows.flatMap((row) =>
    keys.map((key) => (row as TableRef['columns'])[key])
  );

  return `INSERT INTO ${q.table.name} (${columns}) VALUES ${placeholders}`;
}

export function buildUpdateQuery<
  Alias extends string,
  TableRef extends Table<string, Record<string, Column>>,
  JoinedTables extends Record<string, Table<string, Record<string, Column>>>,
  Definition extends Partial<QueryDefinition<Alias, TableRef, JoinedTables>>,
  AllowedColumn extends ColumnSelector<Alias, TableRef, JoinedTables>,
  Query extends QueryBuilder<
    Alias,
    TableRef,
    JoinedTables,
    Definition,
    AllowedColumn
  >,
>(q: Query) {
  if (!q.definition?.updateValues) {
    throw new Error(`UPDATE requires values`);
  }

  const keys = Object.keys(q.definition.updateValues);
  const updateParams = keys.map(
    (key) => q.definition.updateValues![key] as unknown
  );

  if (q.definition?.params) {
    q.definition.params = [...updateParams, ...q.definition.params];
  } else {
    q.definition.params = updateParams;
  }

  return `UPDATE ${q.table.name} SET ${keys.map((key) => `${key as string} = ?`.trim()).join(', ')}`;
}

export function buildDeleteQuery<
  Alias extends string,
  TableRef extends Table<string, Record<string, Column>>,
  JoinedTables extends Record<string, Table<string, Record<string, Column>>>,
  Definition extends Partial<QueryDefinition<Alias, TableRef, JoinedTables>>,
  AllowedColumn extends ColumnSelector<Alias, TableRef, JoinedTables>,
  Query extends QueryBuilder<
    Alias,
    TableRef,
    JoinedTables,
    Definition,
    AllowedColumn
  >,
>(q: Query) {
  return `DELETE FROM ${q.table.name}`;
}
