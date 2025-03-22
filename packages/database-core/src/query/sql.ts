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
import type { ColumnSelector, QueryDefinition } from './types';
import { getWhereConditions } from './utilities';

export function toQuery<
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

  if (this.definition?.groupBy?.length) {
    sql += ' GROUP BY';

    const placeholders = this.definition.groupBy.map(() => '?').join(', ');

    const params = this.definition.groupBy.map((group) => group);

    sql += ` ${placeholders}`;

    if (!this.definition.params) this.definition.params = [];

    this.definition.params.push(...params);
  }

  if (this.definition?.having?.length) {
    sql += ` HAVING ${this.definition.having.join(' ')}`;
  }

  if (this.definition?.orderBy?.length) {
    sql += ' ORDER BY';

    const placeholders = this.definition.orderBy.map(() => '? ?').join(', ');

    const params = this.definition.orderBy
      .map((order) => [order.column, order.direction])
      .flat(1);

    sql += ` ${placeholders}`;

    if (!this.definition.params) this.definition.params = [];

    this.definition.params.push(...params);
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
  Query extends QueryBuilder<
    Alias,
    TableRef,
    JoinedTables,
    Definition,
    AllowedColumn
  >,
>(this: Query) {
  return this.toQuery().query;
}
