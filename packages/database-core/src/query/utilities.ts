import type { Column } from '../column';
import type { Table } from '../table';
import { Dialect } from '../table/constants';
import { AcceptedOperator } from './constants';
import type { WhereValue } from './types';

export function getCondition<
  DbDialect extends Dialect,
  TableRef extends Table<string, Record<string, Column>>,
  ColName extends keyof TableRef['columns'],
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
