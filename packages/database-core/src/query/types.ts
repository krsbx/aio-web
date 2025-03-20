import type { Column } from '../column';
import type {
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

export type AcceptedOrderBy<Columns extends Record<string, Column>> = {
  [ColName in keyof Columns]?: OrderBy;
};

export type AcceptedInsertValues<Columns extends Record<string, Column>> = {
  [ColName in keyof Columns]?: ReturnType<Columns[ColName]['infer']>;
}[];

export type AcceptedUpdateValues<Columns extends Record<string, Column>> = {
  [ColName in keyof Columns]?: ReturnType<Columns[ColName]['infer']>;
};

export type AggregationFunction =
  (typeof AggregationFunction)[keyof typeof AggregationFunction];
