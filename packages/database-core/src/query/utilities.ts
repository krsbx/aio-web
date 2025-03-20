import type { Column } from '../column';
import type { Table } from '../table';
import { AcceptedOperator as AcceptedOperatorValue } from './constants';
import type { AcceptedOperator, WhereValue } from './types';

export function getCondition<
  TableRef extends Table<string, Record<string, Column>>,
  ColName extends keyof TableRef['columns'],
  Operator extends AcceptedOperator,
  Value extends WhereValue<Column>[Operator],
>(column: ColName, operator: Operator, value: Value) {
  switch (operator) {
    case AcceptedOperatorValue.EQ:
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      return `${column} = ?`;

    case AcceptedOperatorValue.NE:
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      return `${column} != ?`;

    case AcceptedOperatorValue.GT:
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      return `${column} > ?`;

    case AcceptedOperatorValue.LT:
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      return `${column} < ?`;

    case AcceptedOperatorValue.GTE:
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      return `${column} >= ?`;

    case AcceptedOperatorValue.LTE:
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      return `${column} <= ?`;

    case AcceptedOperatorValue.IN:
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      return `${column} IN (${(value as never[]).map(() => '?').join(', ')})`;

    case AcceptedOperatorValue.NOT_IN:
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      return `${column} NOT IN (${(value as never[]).map(() => '?').join(', ')})`;

    case AcceptedOperatorValue.LIKE:
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      return `${column} LIKE ?`;

    case AcceptedOperatorValue.IS_NULL:
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      return `${column} IS NULL`;

    case AcceptedOperatorValue.IS_NOT_NULL:
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      return `${column} IS NOT NULL`;

    case AcceptedOperatorValue.BETWEEN:
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      return `${column} BETWEEN ? AND ?`;

    case AcceptedOperatorValue.NOT_BETWEEN:
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      return `${column} NOT BETWEEN ? AND ?`;

    default:
      throw new Error('Invalid operator');
  }
}
