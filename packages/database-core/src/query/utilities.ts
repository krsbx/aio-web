import type { Column } from '../column';
import type { Table } from '../table';
import { AcceptedOperator } from './constants';
import type { WhereValue } from './types';

export function getCondition<
  TableRef extends Table<string, Record<string, Column>>,
  ColName extends keyof TableRef['columns'],
  Operator extends AcceptedOperator,
  Value extends WhereValue<Column>[Operator],
>(column: ColName, operator: Operator, value: Value) {
  switch (operator) {
    case AcceptedOperator.EQ:
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      return `${column} = ?`;

    case AcceptedOperator.NE:
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      return `${column} != ?`;

    case AcceptedOperator.GT:
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      return `${column} > ?`;

    case AcceptedOperator.LT:
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      return `${column} < ?`;

    case AcceptedOperator.GTE:
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      return `${column} >= ?`;

    case AcceptedOperator.LTE:
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      return `${column} <= ?`;

    case AcceptedOperator.IN:
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      return `${column} IN (${(value as never[]).map(() => '?').join(', ')})`;

    case AcceptedOperator.NOT_IN:
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      return `${column} NOT IN (${(value as never[]).map(() => '?').join(', ')})`;

    case AcceptedOperator.LIKE:
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      return `${column} LIKE ?`;

    case AcceptedOperator.IS_NULL:
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      return `${column} IS NULL`;

    case AcceptedOperator.IS_NOT_NULL:
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      return `${column} IS NOT NULL`;

    case AcceptedOperator.BETWEEN:
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      return `${column} BETWEEN ? AND ?`;

    case AcceptedOperator.NOT_BETWEEN:
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      return `${column} NOT BETWEEN ? AND ?`;

    default:
      throw new Error('Invalid operator');
  }
}
