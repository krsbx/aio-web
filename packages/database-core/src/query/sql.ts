import type { QueryBuilder } from '.';
import type { Column } from '../column';
import type { Table } from '../table';
import {
  buildDeleteQuery,
  buildInsertQuery,
  buildSelectQuery,
  buildUpdateQuery,
} from './builder';
import { QueryType } from './constants';
import type {
  ColumnSelector,
  QueryDefinition,
  StrictColumnSelector,
} from './types';
import { getGroupByConditions, getWhereConditions } from './utilities';

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
