import type { Column } from '../column';
import type { Table } from '../table';
import type {
  AcceptedOperator,
  AggregationFunction,
  OrderBy,
  QueryType,
} from './constants';

export type ColumnSelector<
  Alias extends string,
  TableRef extends Table<string, Record<string, Column>>,
  JoinedTables extends Record<string, Table<string, Record<string, Column>>>,
> =
  | `${Alias}.${keyof TableRef['columns'] & string}`
  | {
      [A in keyof JoinedTables]: `${A & string}.${keyof JoinedTables[A]['columns'] &
        string}`;
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

export type RawColumn<AllowedColumn extends string> = AllowedColumn;

export type AliasedColumn<
  Allowed extends string,
  Alias extends string = string,
> = {
  column: Allowed;
  as: Alias;
};

export type SelectableColumn<Allowed extends string> =
  | RawColumn<Allowed>
  | AliasedColumn<Allowed>;

export interface QueryDefinition<
  Alias extends string,
  TableRef extends Table<string, Record<string, Column>>,
  JoinedTables extends Record<
    string,
    Table<string, Record<string, Column>>
  > = NonNullable<unknown>,
  AllowedColumn extends ColumnSelector<
    Alias,
    TableRef,
    JoinedTables
  > = ColumnSelector<Alias, TableRef, JoinedTables>,
> {
  queryType: QueryType | null;
  select: SelectableColumn<AllowedColumn>[] | null;
  where: string[] | null;
  having: string[] | null;
  params: unknown[] | null;
  limit: number | null;
  offset: number | null;
  groupBy: AllowedColumn[] | null;
  insertValues: AcceptedInsertValues<TableRef['columns']> | null;
  updateValues: AcceptedUpdateValues<TableRef['columns']> | null;
  orderBy: AcceptedOrderBy<AllowedColumn>[] | null;
  aggregate: {
    column: AllowedColumn;
    fn: AggregationFunction;
  } | null;
  distinct: boolean | null;
  joins: string[] | null;
  baseAlias: Alias | null;
  joinedTables: JoinedTables | null;
}
