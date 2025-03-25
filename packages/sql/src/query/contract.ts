import type { QueryBuilder } from '.';
import type { Column } from '../column';
import type { Table } from '../table';
import type { addCondition, addRawCondition } from './condition';
import type {
  AcceptedOperator,
  ConditionClause,
  LogicalOperator,
} from './constants';
import type { rawCol } from './helper';
import type {
  ColumnSelector,
  QueryDefinition,
  StrictColumnSelector,
  WhereValue,
} from './types';

export interface QueryTransformerContract<
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
> {
  toQuery(
    this: QueryBuilder<
      Alias,
      TableRef,
      JoinedTables,
      Definition,
      AllowedColumn,
      StrictAllowedColumn
    >
  ): {
    query: string;
    params: unknown[] | null | undefined;
  };

  toString(
    this: QueryBuilder<
      Alias,
      TableRef,
      JoinedTables,
      Definition,
      AllowedColumn,
      StrictAllowedColumn
    >
  ): string;

  exec<
    This extends QueryBuilder<
      Alias,
      TableRef,
      JoinedTables,
      Definition,
      AllowedColumn,
      StrictAllowedColumn
    > = QueryBuilder<
      Alias,
      TableRef,
      JoinedTables,
      Definition,
      AllowedColumn,
      StrictAllowedColumn
    >,
    Output extends This['_output'] extends void
      ? void
      : This['_output'][] = This['_output'] extends void
      ? void
      : This['_output'][],
  >(
    this: This
  ): Promise<Output>;

  clone(
    this: QueryBuilder<
      Alias,
      TableRef,
      JoinedTables,
      Definition,
      AllowedColumn,
      StrictAllowedColumn
    >
  ): typeof this;

  alias<NewAlias extends string>(
    alias: NewAlias
  ): QueryBuilder<
    NewAlias,
    TableRef,
    JoinedTables,
    Omit<Definition, 'baseAlias'> & { baseAlias: NewAlias }
  >;
}

export interface QueryConditionContract<
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
> {
  rawWhere(
    this: QueryBuilder<
      Alias,
      TableRef,
      JoinedTables,
      Definition,
      AllowedColumn,
      StrictAllowedColumn
    >,
    column: (c: typeof rawCol) => string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params?: any
  ): ReturnType<
    typeof addRawCondition<
      Alias,
      TableRef,
      JoinedTables,
      Definition,
      AllowedColumn,
      StrictAllowedColumn,
      typeof ConditionClause.WHERE,
      typeof LogicalOperator.AND,
      Lowercase<typeof ConditionClause.WHERE>
    >
  >;

  rawOr(
    this: QueryBuilder<
      Alias,
      TableRef,
      JoinedTables,
      Definition,
      AllowedColumn,
      StrictAllowedColumn
    >,
    column: (c: typeof rawCol) => string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params?: any
  ): ReturnType<
    typeof addRawCondition<
      Alias,
      TableRef,
      JoinedTables,
      Definition,
      AllowedColumn,
      StrictAllowedColumn,
      typeof ConditionClause.WHERE,
      typeof LogicalOperator.OR,
      Lowercase<typeof ConditionClause.WHERE>
    >
  >;

  rawHaving(
    this: QueryBuilder<
      Alias,
      TableRef,
      JoinedTables,
      Definition,
      AllowedColumn,
      StrictAllowedColumn
    >,
    column: (c: typeof rawCol) => string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params?: any
  ): ReturnType<
    typeof addRawCondition<
      Alias,
      TableRef,
      JoinedTables,
      Definition,
      AllowedColumn,
      StrictAllowedColumn,
      typeof ConditionClause.HAVING,
      typeof LogicalOperator.AND,
      Lowercase<typeof ConditionClause.HAVING>
    >
  >;

  where<
    ColName extends StrictAllowedColumn,
    Col extends ColName extends `${infer TableAlias}.${infer TableColumn}`
      ? TableAlias extends Alias
        ? TableRef['columns'][TableColumn]
        : JoinedTables[TableAlias]['columns'][TableColumn]
      : never,
    Operator extends AcceptedOperator,
    Value extends WhereValue<Col>[Operator],
  >(
    this: QueryBuilder<
      Alias,
      TableRef,
      JoinedTables,
      Definition,
      AllowedColumn,
      StrictAllowedColumn
    >,
    column: ColName,
    operator: Operator,
    value: Value
  ): ReturnType<
    typeof addCondition<
      Alias,
      TableRef,
      JoinedTables,
      Definition,
      AllowedColumn,
      StrictAllowedColumn,
      typeof ConditionClause.WHERE,
      ColName,
      ColName extends `${infer TableAlias}.${infer TableColumn}`
        ? TableAlias extends Alias
          ? TableRef['columns'][TableColumn]
          : JoinedTables[TableAlias]['columns'][TableColumn]
        : never,
      Operator,
      Value,
      typeof LogicalOperator.AND,
      Lowercase<typeof ConditionClause.WHERE>
    >
  >;

  or<
    ColName extends StrictAllowedColumn,
    Col extends ColName extends `${infer TableAlias}.${infer TableColumn}`
      ? TableAlias extends Alias
        ? TableRef['columns'][TableColumn]
        : JoinedTables[TableAlias]['columns'][TableColumn]
      : never,
    Operator extends AcceptedOperator,
    Value extends WhereValue<Col>[Operator],
  >(
    this: QueryBuilder<
      Alias,
      TableRef,
      JoinedTables,
      Definition,
      AllowedColumn,
      StrictAllowedColumn
    >,
    column: ColName,
    operator: Operator,
    value: Value
  ): ReturnType<
    typeof addCondition<
      Alias,
      TableRef,
      JoinedTables,
      Definition,
      AllowedColumn,
      StrictAllowedColumn,
      typeof ConditionClause.WHERE,
      ColName,
      ColName extends `${infer TableAlias}.${infer TableColumn}`
        ? TableAlias extends Alias
          ? TableRef['columns'][TableColumn]
          : JoinedTables[TableAlias]['columns'][TableColumn]
        : never,
      Operator,
      Value,
      typeof LogicalOperator.OR,
      Lowercase<typeof ConditionClause.WHERE>
    >
  >;

  having<
    ColName extends StrictAllowedColumn,
    Col extends ColName extends `${infer TableAlias}.${infer TableColumn}`
      ? TableAlias extends Alias
        ? TableRef['columns'][TableColumn]
        : JoinedTables[TableAlias]['columns'][TableColumn]
      : never,
    Operator extends AcceptedOperator,
    Value extends WhereValue<Col>[Operator],
  >(
    this: QueryBuilder<
      Alias,
      TableRef,
      JoinedTables,
      Definition,
      AllowedColumn,
      StrictAllowedColumn
    >,
    column: ColName,
    operator: Operator,
    value: Value
  ): ReturnType<
    typeof addCondition<
      Alias,
      TableRef,
      JoinedTables,
      Definition,
      AllowedColumn,
      StrictAllowedColumn,
      typeof ConditionClause.HAVING,
      ColName,
      ColName extends `${infer TableAlias}.${infer TableColumn}`
        ? TableAlias extends Alias
          ? TableRef['columns'][TableColumn]
          : JoinedTables[TableAlias]['columns'][TableColumn]
        : never,
      Operator,
      Value,
      typeof LogicalOperator.AND,
      Lowercase<typeof ConditionClause.HAVING>
    >
  >;
}
