import type { QueryBuilder } from '.';
import type { Column } from '../column';
import type { Table } from '../table';
import {
  buildDeleteQuery,
  buildInsertQuery,
  buildSelectQuery,
  buildUpdateQuery,
} from './builder';
import { QueryHooksType, QueryType } from './constants';
import type {
  ColumnSelector,
  QueryDefinition,
  StrictColumnSelector,
} from './types';
import {
  getGroupByConditions,
  getWhereConditions,
  parseAliasedRow,
} from './utilities';

export function buildQuery(query: string) {
  let index = 0;

  return query.replace(/\?/g, () => {
    index++;

    return `$${index}`;
  });
}

export function toQuery<
  Alias extends string,
  TableRef extends Table<string, Record<string, Column>>,
  JoinedTables extends Record<string, Table<string, Record<string, Column>>>,
  Definition extends Partial<QueryDefinition<Alias, TableRef, JoinedTables>>,
  AllowedColumn extends ColumnSelector<Alias, TableRef, JoinedTables>,
  StrictAllowedColumn extends StrictColumnSelector<
    Alias,
    TableRef,
    JoinedTables
  >,
  Query extends QueryBuilder<
    Alias,
    TableRef,
    JoinedTables,
    Definition,
    AllowedColumn,
    StrictAllowedColumn
  >,
>(this: Query) {
  let sql = '';

  switch (this.definition.queryType) {
    case QueryType.SELECT:
      sql = buildSelectQuery(this);
      break;

    case QueryType.INSERT:
      sql = buildInsertQuery(this);
      break;

    case QueryType.UPDATE:
      sql = buildUpdateQuery(this);
      break;

    case QueryType.DELETE:
      sql = buildDeleteQuery(this);
      break;

    default:
      throw new Error('No query type defined');
  }

  if (this.definition?.joins?.length) {
    sql += ` ${this.definition.joins.join(' ')}`;
  }

  const whereConditions = getWhereConditions(this);

  if (whereConditions.length) {
    sql += ` WHERE ${whereConditions.join(' ')}`;
  }

  const groupByConditions = getGroupByConditions(this);

  if (groupByConditions.length) {
    sql += ` GROUP BY ${groupByConditions.join(', ')}`;
  }

  if (this.definition?.having?.length) {
    sql += ` HAVING ${this.definition.having.join(' ')}`;
  }

  if (this.definition?.orderBy?.length) {
    sql += ` ORDER BY ${this.definition.orderBy
      .map((order) => [order.column, order.direction].join(' '))
      .join(', ')}`;
  }

  if (this.definition?.limit !== null) {
    sql += ` LIMIT ?`;

    if (!this.definition.params) this.definition.params = [];

    this.definition.params.push(this.definition.limit);
  }

  if (this.definition?.offset !== null) {
    sql += ` OFFSET ?`;

    if (!this.definition.params) this.definition.params = [];

    this.definition.params.push(this.definition.offset);
  }

  if (
    this.definition.queryType === QueryType.UPDATE ||
    this.definition.queryType === QueryType.DELETE
  ) {
    sql += ` RETURNING *`;
  }

  sql = buildQuery(sql);

  return { query: sql + ';', params: this.definition.params };
}

export function toString<
  Alias extends string,
  TableRef extends Table<string, Record<string, Column>>,
  JoinedTables extends Record<string, Table<string, Record<string, Column>>>,
  Definition extends Partial<QueryDefinition<Alias, TableRef, JoinedTables>>,
  AllowedColumn extends ColumnSelector<Alias, TableRef, JoinedTables>,
  StrictAllowedColumn extends StrictColumnSelector<
    Alias,
    TableRef,
    JoinedTables
  >,
  Query extends QueryBuilder<
    Alias,
    TableRef,
    JoinedTables,
    Definition,
    AllowedColumn,
    StrictAllowedColumn
  >,
>(this: Query) {
  return this.toQuery().query;
}

export async function exec<
  Alias extends string,
  TableRef extends Table<string, Record<string, Column>>,
  JoinedTables extends Record<string, Table<string, Record<string, Column>>>,
  Definition extends Partial<QueryDefinition<Alias, TableRef, JoinedTables>>,
  AllowedColumn extends ColumnSelector<Alias, TableRef, JoinedTables>,
  StrictAllowedColumn extends StrictColumnSelector<
    Alias,
    TableRef,
    JoinedTables
  >,
  Query extends QueryBuilder<
    Alias,
    TableRef,
    JoinedTables,
    Definition,
    AllowedColumn,
    StrictAllowedColumn
  >,
  Output extends Query['_output'] = Query['_output'],
>(this: Query) {
  if (!this.table.client) throw new Error('Database client not defined');

  const { query, params } = this.toQuery();

  if (this.hooks.before.size) {
    for (const hook of this.hooks.before.values()) {
      hook({
        query,
        params,
        type: this.definition.queryType!,
        hook: QueryHooksType.BEFORE,
      });
    }
  }

  const result = await this.table.client.exec<never[]>(query, params);

  if (this.hooks.after.size) {
    for (const hook of this.hooks.after.values()) {
      hook({
        query,
        params,
        type: this.definition.queryType!,
        hook: QueryHooksType.AFTER,
      });
    }
  }

  return result.map((r) =>
    parseAliasedRow({
      row: r,
      selects: this.definition.select ?? [],
      root: this.definition?.baseAlias ?? this.table.name,
    })
  ) as Output;
}
