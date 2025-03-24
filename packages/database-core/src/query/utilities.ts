import type { QueryBuilder } from '.';
import type { Column } from '../column';
import type { Table } from '../table';
import { Dialect } from '../table/constants';
import { quoteIdentifier } from '../utilities';
import { AcceptedOperator, QueryType } from './constants';
import type {
  ColumnSelector,
  QueryDefinition,
  StrictColumnSelector,
  WhereValue,
} from './types';

export function getTableColumnNames<
  ColName extends string,
  BaseAlias extends string,
  BaseTable extends Table<string, Record<string, Column>>,
  JoinedTables extends Record<string, Table<string, Record<string, Column>>>,
>(
  column: ColName,
  baseAlias: BaseAlias,
  baseTable: BaseTable,
  joinedTables: JoinedTables
) {
  const [tableAlias] = column.split('.');

  const isOnBase = tableAlias === baseAlias;
  const from = isOnBase ? baseAlias : tableAlias;
  const columns = isOnBase
    ? Object.keys(baseTable.columns)
    : Object.keys(joinedTables?.[from]?.columns ?? {});

  return {
    from,
    columns,
  };
}

export function getCondition<
  DbDialect extends Dialect,
  ColName extends string,
  Operator extends AcceptedOperator,
  Value extends WhereValue<Column>[Operator],
>(dialect: DbDialect, column: ColName, operator: Operator, value: Value) {
  switch (operator) {
    case AcceptedOperator.EQ:
      return `${column as string} = ?`;

    case AcceptedOperator.NE:
      return `${column as string} != ?`;

    case AcceptedOperator.GT:
      return `${column as string} > ?`;

    case AcceptedOperator.LT:
      return `${column as string} < ?`;

    case AcceptedOperator.GTE:
      return `${column as string} >= ?`;

    case AcceptedOperator.LTE:
      return `${column as string} <= ?`;

    case AcceptedOperator.IN:
      return `${column as string} IN (${(value as never[]).map(() => '?').join(', ')})`;

    case AcceptedOperator.NOT_IN:
      return `${column as string} NOT IN (${(value as never[]).map(() => '?').join(', ')})`;

    case AcceptedOperator.LIKE:
      return `${column as string} LIKE ?`;

    case AcceptedOperator.NOT_LIKE:
      return `${column as string} NOT LIKE ?`;

    case AcceptedOperator.ILIKE:
      if (dialect === Dialect.POSTGRES) {
        return `${column as string} ILIKE ?`;
      }

      return `LOWER(${column as string}) LIKE LOWER(?)`;

    case AcceptedOperator.NOT_ILIKE:
      if (dialect === Dialect.POSTGRES) {
        return `${column as string} NOT ILIKE ?`;
      }

      return `LOWER(${column as string}) NOT LIKE LOWER(?)`;

    case AcceptedOperator.IS_NULL:
      return `${column as string} IS NULL`;

    case AcceptedOperator.IS_NOT_NULL:
      return `${column as string} IS NOT NULL`;

    case AcceptedOperator.BETWEEN:
      return `${column as string} BETWEEN ? AND ?`;

    case AcceptedOperator.NOT_BETWEEN:
      return `${column as string} NOT BETWEEN ? AND ?`;

    default:
      throw new Error('Invalid operator');
  }
}

export function getTimestamp<
  TableRef extends Table<string, Record<string, Column>>,
>(table: TableRef) {
  const isWithTimestamp = !!table.timestamp;
  const timestamp = new Date();
  let createdAt = 'createdAt';
  let updatedAt = 'updatedAt';

  if (isWithTimestamp) {
    const isCustomTimestamp = typeof table.timestamp === 'object';

    if (isCustomTimestamp && table.timestamp.createdAt) {
      createdAt = table.timestamp.createdAt;
    }

    if (isCustomTimestamp && table.timestamp.updatedAt) {
      updatedAt = table.timestamp.updatedAt;
    }
  }

  return {
    isWithTimestamp,
    timestamp,
    createdAt,
    updatedAt,
  };
}

export function getParanoid<
  TableRef extends Table<string, Record<string, Column>>,
>(table: TableRef) {
  const isWithParanoid = !!table.paranoid;
  const timestamp = new Date();
  let deletedAt = 'deletedAt';

  if (isWithParanoid) {
    if (typeof table.paranoid === 'string') {
      deletedAt = table.paranoid;
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
>(q: Query) {
  if (q.definition.queryType === QueryType.INSERT) return [];

  const conditions: string[] = [];

  const base = q.definition.baseAlias ?? q.table.name;
  const { isWithParanoid, deletedAt } = getParanoid(q.table);
  const withDeleted = !!q.definition.withDeleted;
  const isHasConditions = !!q.definition.where?.length;

  if (!withDeleted && isWithParanoid) {
    const suffix = isHasConditions ? ' AND' : '';
    const column = `${base}.${quoteIdentifier(deletedAt)}`;

    conditions.unshift(`${column} IS NULL${suffix}`);
  }

  if (q.definition.where?.length) {
    conditions.push(...q.definition.where);
  }

  return conditions;
}

export function getGroupByConditions<
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
>(q: Query) {
  if (q.definition.queryType !== QueryType.SELECT) return [];

  if (q.definition.groupBy?.length) return q.definition.groupBy;

  if (q.definition.aggregates?.length) {
    if (q.definition.select?.length)
      return q.definition.select.map((col) => {
        if (typeof col === 'string' && col.endsWith('*')) {
          const { from, columns } = getTableColumnNames(
            col,
            q.definition.baseAlias ?? q.table.name,
            q.table,
            q.definition.joinedTables ?? {}
          );

          return columns
            .map((column) => `${from}.${quoteIdentifier(column)}`)
            .join(' ');
        }

        return col;
      });

    const from = q.definition.baseAlias ?? q.table.name;

    return Object.keys(q.table.columns).map(
      (col) => `${from}.${quoteIdentifier(col)}`
    );
  }

  return [];
}

export function getTableSelectName<
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
>(q: Query) {
  if (!q.definition.baseAlias) return q.table.name;

  return `${q.table.name} AS ${q.definition.baseAlias}`;
}
