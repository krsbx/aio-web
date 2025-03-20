import type { Column } from '../column';
import type { Table } from '../table';
import type {
  AcceptedJoin,
  AcceptedOperator,
  AggregationFunction,
  ConditionClause,
  LogicalOperator,
  OrderBy,
  QueryType,
} from './constants';

export type AcceptedOperator =
  (typeof AcceptedOperator)[keyof typeof AcceptedOperator];

export type LogicalOperator =
  (typeof LogicalOperator)[keyof typeof LogicalOperator];

export type ConditionClause =
  (typeof ConditionClause)[keyof typeof ConditionClause];

export type QueryType = (typeof QueryType)[keyof typeof QueryType];

export type OrderBy = (typeof OrderBy)[keyof typeof OrderBy];

export type AcceptedJoin = (typeof AcceptedJoin)[keyof typeof AcceptedJoin];

export type ColumnSelector<
  Alias extends string,
  TableRef extends Table<string, Record<string, Column>>,
  JoinedTables extends Record<string, Table<string, Record<string, Column>>>,
> =
  | `${Alias}.${Extract<keyof TableRef['columns'], string>}`
  | {
      [A in keyof JoinedTables]: `${A & string}.${Extract<
        keyof JoinedTables[A]['columns'],
        string
      >}`;
    }[keyof JoinedTables];

export type WhereValue<T extends Column> = {
  [K in AcceptedOperator]: K extends
    | typeof AcceptedOperator.BETWEEN
    | typeof AcceptedOperator.NOT_BETWEEN
    ? [ReturnType<T['infer']>, ReturnType<T['infer']>]
    : K extends typeof AcceptedOperator.IN | typeof AcceptedOperator.NOT_IN
      ? ReturnType<T['infer']>[]
      : K extends
            | typeof AcceptedOperator.IS_NULL
            | typeof AcceptedOperator.IS_NOT_NULL
        ? never
        : ReturnType<T['infer']>;
};

export type AcceptedOrderBy<Columns extends string> = {
  column: Columns;
  direction: OrderBy;
};

export type AcceptedInsertValues<Columns extends Record<string, Column>> = {
  [ColName in keyof Columns]?: ReturnType<Columns[ColName]['infer']>;
}[];

export type AcceptedUpdateValues<Columns extends Record<string, Column>> = {
  [ColName in keyof Columns]?: ReturnType<Columns[ColName]['infer']>;
};

export type AggregationFunction =
  (typeof AggregationFunction)[keyof typeof AggregationFunction];
