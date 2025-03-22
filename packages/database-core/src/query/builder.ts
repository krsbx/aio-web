import type { QueryBuilder } from '.';
import type { Column } from '../column';
import type { Table } from '../table';
import type { ColumnSelector, QueryDefinition } from './types';

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
  let from = q.table.name;

  if (q.definition.baseAlias) {
    from = `${q.table.name} AS ${q.definition.baseAlias}`;
  }

  if (q.definition?.aggregate) {
    return `SELECT ${q.definition.aggregate.fn}(${q.definition.aggregate.column}) FROM ${from}`;
  }

  let columns = '*';

  if (q.definition?.select?.length) {
    columns = q.definition.select
      .map((col) => {
        if (typeof col === 'object') {
          return `${col.column} AS ${col.as}`;
        }

        return col;
      })
      .join(', ');
  }

  const distinct = q.definition.distinct ? 'DISTINCT ' : '';

  return `SELECT ${distinct}${columns} FROM ${from}`;
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
