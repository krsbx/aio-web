import type { QueryBuilder } from '.';
import type { Document } from '../document';
import type { Field } from '../field';
import { AcceptedOperator, QueryType } from './constants';
import type {
  AliasedField,
  FieldSelector,
  QueryDefinition,
  SelectableField,
  StrictFieldSelector,
  WhereValue,
} from './types';

export function getCondition<
  ColName extends string,
  Operator extends AcceptedOperator,
  Value extends WhereValue<Field>[Operator],
>(column: ColName, operator: Operator, value: Value) {
  const [docName, colName] = column.split('.') as [string, string];
  const finalColumn = `JSON_EXTRACT(${docName}.data, '$.${colName}')`;

  switch (operator) {
    case AcceptedOperator.EQ:
      return `${finalColumn} = ?`;

    case AcceptedOperator.NE:
      return `${finalColumn} != ?`;

    case AcceptedOperator.GT:
      return `${finalColumn} > ?`;

    case AcceptedOperator.LT:
      return `${finalColumn} < ?`;

    case AcceptedOperator.GTE:
      return `${finalColumn} >= ?`;

    case AcceptedOperator.LTE:
      return `${finalColumn} <= ?`;

    case AcceptedOperator.IN:
      return `${finalColumn} IN (${(value as never[]).map(() => '?').join(', ')})`;

    case AcceptedOperator.NOT_IN:
      return `${finalColumn} NOT IN (${(value as never[]).map(() => '?').join(', ')})`;

    case AcceptedOperator.LIKE:
      return `${finalColumn} LIKE ?`;

    case AcceptedOperator.NOT_LIKE:
      return `${finalColumn} NOT LIKE ?`;

    case AcceptedOperator.ILIKE:
      return `LOWER(${finalColumn}) LIKE LOWER(?)`;

    case AcceptedOperator.NOT_ILIKE:
      return `LOWER(${finalColumn}) NOT LIKE LOWER(?)`;

    case AcceptedOperator.IS_NULL:
      return `${finalColumn} IS NULL`;

    case AcceptedOperator.IS_NOT_NULL:
      return `${finalColumn} IS NOT NULL`;

    case AcceptedOperator.BETWEEN:
      return `${finalColumn} BETWEEN ? AND ?`;

    case AcceptedOperator.NOT_BETWEEN:
      return `${finalColumn} NOT BETWEEN ? AND ?`;

    default:
      throw new Error('Invalid operator');
  }
}

export function getTimestamp<
  DocRef extends Document<string, Record<string, Field>>,
>(doc: DocRef) {
  const isWithTimestamp = !!doc.timestamp;
  const timestamp = new Date();
  let isHasCreatedAt = true;
  let isHasUpdatedAt = true;
  let createdAt = 'createdAt';
  let updatedAt = 'updatedAt';

  if (isWithTimestamp) {
    const isCustomTimestamp = typeof doc.timestamp === 'object';

    if (isCustomTimestamp) {
      if (typeof doc.timestamp.createdAt === 'string') {
        createdAt = doc.timestamp.createdAt;
      }

      isHasCreatedAt = doc.timestamp.createdAt === false;
    }

    if (isCustomTimestamp) {
      if (typeof doc.timestamp.updatedAt === 'string') {
        updatedAt = doc.timestamp.updatedAt;
      }

      isHasUpdatedAt = doc.timestamp.updatedAt === false;
    }
  }

  return {
    isWithTimestamp,
    timestamp,
    createdAt,
    updatedAt,
    isHasCreatedAt,
    isHasUpdatedAt,
  };
}

export function getParanoid<
  DocRef extends Document<string, Record<string, Field>>,
>(doc: DocRef) {
  const isWithParanoid = !!doc.paranoid;
  const timestamp = new Date();
  let deletedAt = 'deletedAt';

  if (isWithParanoid) {
    if (typeof doc.paranoid === 'string') {
      deletedAt = doc.paranoid;
    }
  }

  return {
    isWithParanoid,
    timestamp,
    deletedAt,
  };
}

export function getWhereConditions<
  Alias extends string,
  DocRef extends Document<string, Record<string, Field>>,
  JoinedDocs extends Record<string, Document<string, Record<string, Field>>>,
  Definition extends Partial<QueryDefinition<Alias, DocRef, JoinedDocs>>,
  AllowedColumn extends FieldSelector<Alias, DocRef, JoinedDocs>,
  StrictAllowedColumn extends StrictFieldSelector<Alias, DocRef, JoinedDocs>,
  Query extends QueryBuilder<
    Alias,
    DocRef,
    JoinedDocs,
    Definition,
    AllowedColumn,
    StrictAllowedColumn
  >,
>(q: Query) {
  if (q.definition.queryType === QueryType.INSERT) return [];

  const conditions: string[] = [];

  const base = q.definition.baseAlias ?? q.doc.name;
  const { isWithParanoid, deletedAt } = getParanoid(q.doc);
  const withDeleted = !!q.definition.withDeleted;
  const isHasConditions = !!q.definition.where?.length;

  if (!withDeleted && isWithParanoid) {
    const suffix = isHasConditions ? ' AND' : '';
    const column = `JSON_EXTRACT(${base}.data, '$.${deletedAt}')`;

    conditions.unshift(`${column} IS NULL${suffix}`);
  }

  if (q.definition.where?.length) {
    conditions.push(...q.definition.where);
  }

  return conditions;
}

export function getTableSelectName<
  Alias extends string,
  DocRef extends Document<string, Record<string, Field>>,
  JoinedDocs extends Record<string, Document<string, Record<string, Field>>>,
  Definition extends Partial<QueryDefinition<Alias, DocRef, JoinedDocs>>,
  AllowedColumn extends FieldSelector<Alias, DocRef, JoinedDocs>,
  StrictAllowedColumn extends StrictFieldSelector<Alias, DocRef, JoinedDocs>,
  Query extends QueryBuilder<
    Alias,
    DocRef,
    JoinedDocs,
    Definition,
    AllowedColumn,
    StrictAllowedColumn
  >,
>(q: Query) {
  if (!q.definition.baseAlias) return `documents AS ${q.doc.name}`;

  return `documents AS ${q.definition.baseAlias}`;
}

export function parseAliasedRow({
  row,
  selects,
  root = null,
}: {
  row: Record<string, unknown>;
  selects: SelectableField<string>[];
  root?: string | null;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let result: Record<string, any> = {};

  for (const key in row) {
    const [table, column] = key.split('.');

    if (!column) {
      const alias = selects.find(
        (s) => typeof s === 'object' && s.as === table
      );

      if (alias) {
        const [oriTab] = (alias as AliasedField<string>).field.split('.');

        if (!result[oriTab]) result[oriTab] = {};

        result[oriTab][table] = row[key];
        continue;
      }

      result[key] = row[key];
      continue;
    }

    if (!result[table]) result[table] = {};

    result[table][column] = row[key];
  }

  if (root) {
    result = {
      ...result,
      ...result[root],
    };

    delete result[root];
  }

  return result;
}
