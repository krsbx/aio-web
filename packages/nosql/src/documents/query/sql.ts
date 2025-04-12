import type { QueryBuilder } from '.';
import type { Documents } from '../documents';
import type { Field } from '../fields';
import {
  buildDeleteQuery,
  buildInsertQuery,
  buildSelectQuery,
  buildUpdateQuery,
} from './builder';
import { QueryType } from './constants';
import type {
  FieldSelector,
  QueryDefinition,
  StrictFieldSelector,
} from './types';
import { getWhereConditions, parseAliasedRow } from './utilities';

export function buildQuery(query: string) {
  let index = 0;

  return query.replace(/\?/g, () => {
    index++;

    return `$${index}`;
  });
}

export function toQuery<
  Alias extends string,
  DocRef extends Documents<string, Record<string, Field>>,
  JoinedDocs extends Record<string, Documents<string, Record<string, Field>>>,
  Definition extends Partial<QueryDefinition<Alias, DocRef, JoinedDocs>>,
  AllowedField extends FieldSelector<Alias, DocRef, JoinedDocs>,
  StrictAllowedField extends StrictFieldSelector<Alias, DocRef, JoinedDocs>,
  Query extends QueryBuilder<
    Alias,
    DocRef,
    JoinedDocs,
    Definition,
    AllowedField,
    StrictAllowedField
  >,
>(this: Query) {
  let sql = '';

  switch (this.definition.queryType) {
    case QueryType.SELECT:
      sql = buildSelectQuery(this);
      break;

    case QueryType.INSERT:
      return {
        query: buildQuery(buildInsertQuery(this) + ';'),
        params: this.definition.params ?? [],
      };

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

  sql += ` WHERE ${this.definition.baseAlias ?? this.doc.name}.collection = '${this.doc.name}'`;

  const whereConditions = getWhereConditions(this);

  if (whereConditions.length) {
    sql += ` AND (${whereConditions.join(' ')})`;
  }

  if (this.definition?.groupBy?.length) {
    sql += ` GROUP BY ${this.definition.groupBy.join(', ')}`;
  }

  if (this.definition?.having?.length) {
    sql += ` HAVING ${this.definition.having.join(' ')}`;
  }

  if (this.definition?.orderBy?.length) {
    sql += ` ORDER BY ${this.definition.orderBy
      .map((order) => {
        const [collection, field] = order.field.split('.');

        return `JSON_EXTRACT(${collection}.data, '$.${field}') ${
          order.direction
        }`;
      })
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
  DocRef extends Documents<string, Record<string, Field>>,
  JoinedDocs extends Record<string, Documents<string, Record<string, Field>>>,
  Definition extends Partial<QueryDefinition<Alias, DocRef, JoinedDocs>>,
  AllowedField extends FieldSelector<Alias, DocRef, JoinedDocs>,
  StrictAllowedField extends StrictFieldSelector<Alias, DocRef, JoinedDocs>,
  Query extends QueryBuilder<
    Alias,
    DocRef,
    JoinedDocs,
    Definition,
    AllowedField,
    StrictAllowedField
  >,
>(this: Query) {
  return this.toQuery().query;
}

export async function exec<
  Alias extends string,
  DocRef extends Documents<string, Record<string, Field>>,
  JoinedDocs extends Record<string, Documents<string, Record<string, Field>>>,
  Definition extends Partial<QueryDefinition<Alias, DocRef, JoinedDocs>>,
  AllowedField extends FieldSelector<Alias, DocRef, JoinedDocs>,
  StrictAllowedField extends StrictFieldSelector<Alias, DocRef, JoinedDocs>,
  Query extends QueryBuilder<
    Alias,
    DocRef,
    JoinedDocs,
    Definition,
    AllowedField,
    StrictAllowedField
  >,
  Output extends Query['_output'] = Query['_output'],
>(this: Query) {
  if (!this.doc.database) throw new Error('Database client not defined');

  const { query, params } = this.toQuery();

  const result = await this.doc.database.exec<never[]>(query, params);

  return result.map((r) =>
    parseAliasedRow({
      row: r,
      selects: this.definition.select ?? [],
      root: this.definition?.baseAlias ?? this.doc.name,
    })
  ) as Output;
}
