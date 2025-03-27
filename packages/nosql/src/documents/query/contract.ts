import type { QueryBuilder } from '.';
import type { Documents } from '../documents';
import type { Field } from '../fields';
import type { addCondition, addRawCondition } from './condition';
import type {
  AcceptedOperator,
  ConditionClause,
  LogicalOperator,
} from './constants';
import type { rawCol } from './helper';
import type {
  FieldSelector,
  QueryDefinition,
  StrictFieldSelector,
  WhereValue,
} from './types';

export interface QueryTransformerContract<
  Alias extends string,
  DocRef extends Documents<string, Record<string, Field>>,
  JoinedDocs extends Record<string, Documents<string, Record<string, Field>>>,
  Definition extends Partial<QueryDefinition<Alias, DocRef, JoinedDocs>>,
  AllowedField extends FieldSelector<Alias, DocRef, JoinedDocs>,
  StrictAllowedField extends StrictFieldSelector<Alias, DocRef, JoinedDocs>,
> {
  toQuery(
    this: QueryBuilder<
      Alias,
      DocRef,
      JoinedDocs,
      Definition,
      AllowedField,
      StrictAllowedField
    >
  ): {
    query: string;
    params: unknown[] | null | undefined;
  };

  toString(
    this: QueryBuilder<
      Alias,
      DocRef,
      JoinedDocs,
      Definition,
      AllowedField,
      StrictAllowedField
    >
  ): string;

  exec<
    This extends QueryBuilder<
      Alias,
      DocRef,
      JoinedDocs,
      Definition,
      AllowedField,
      StrictAllowedField
    > = QueryBuilder<
      Alias,
      DocRef,
      JoinedDocs,
      Definition,
      AllowedField,
      StrictAllowedField
    >,
  >(
    this: This
  ): Promise<This['_output']>;

  clone(
    this: QueryBuilder<
      Alias,
      DocRef,
      JoinedDocs,
      Definition,
      AllowedField,
      StrictAllowedField
    >
  ): typeof this;

  alias<NewAlias extends string>(
    alias: NewAlias
  ): QueryBuilder<
    NewAlias,
    DocRef,
    JoinedDocs,
    Omit<Definition, 'baseAlias'> & { baseAlias: NewAlias }
  >;
}

export interface QueryConditionContract<
  Alias extends string,
  DocRef extends Documents<string, Record<string, Field>>,
  JoinedDocs extends Record<string, Documents<string, Record<string, Field>>>,
  Definition extends Partial<QueryDefinition<Alias, DocRef, JoinedDocs>>,
  AllowedField extends FieldSelector<Alias, DocRef, JoinedDocs>,
  StrictAllowedField extends StrictFieldSelector<Alias, DocRef, JoinedDocs>,
> {
  rawWhere(
    this: QueryBuilder<
      Alias,
      DocRef,
      JoinedDocs,
      Definition,
      AllowedField,
      StrictAllowedField
    >,
    column: (c: typeof rawCol) => string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params?: any
  ): ReturnType<
    typeof addRawCondition<
      Alias,
      DocRef,
      JoinedDocs,
      Definition,
      AllowedField,
      StrictAllowedField,
      typeof ConditionClause.WHERE,
      typeof LogicalOperator.AND,
      Lowercase<typeof ConditionClause.WHERE>
    >
  >;

  rawOr(
    this: QueryBuilder<
      Alias,
      DocRef,
      JoinedDocs,
      Definition,
      AllowedField,
      StrictAllowedField
    >,
    column: (c: typeof rawCol) => string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params?: any
  ): ReturnType<
    typeof addRawCondition<
      Alias,
      DocRef,
      JoinedDocs,
      Definition,
      AllowedField,
      StrictAllowedField,
      typeof ConditionClause.WHERE,
      typeof LogicalOperator.OR,
      Lowercase<typeof ConditionClause.WHERE>
    >
  >;

  rawHaving(
    this: QueryBuilder<
      Alias,
      DocRef,
      JoinedDocs,
      Definition,
      AllowedField,
      StrictAllowedField
    >,
    column: (c: typeof rawCol) => string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params?: any
  ): ReturnType<
    typeof addRawCondition<
      Alias,
      DocRef,
      JoinedDocs,
      Definition,
      AllowedField,
      StrictAllowedField,
      typeof ConditionClause.HAVING,
      typeof LogicalOperator.AND,
      Lowercase<typeof ConditionClause.HAVING>
    >
  >;

  where<
    ColName extends StrictAllowedField,
    Col extends ColName extends `${infer TableAlias}.${infer TableColumn}`
      ? TableAlias extends Alias
        ? DocRef['fields'][TableColumn]
        : JoinedDocs[TableAlias]['fields'][TableColumn]
      : never,
    Operator extends AcceptedOperator,
    Value extends WhereValue<Col>[Operator],
  >(
    this: QueryBuilder<
      Alias,
      DocRef,
      JoinedDocs,
      Definition,
      AllowedField,
      StrictAllowedField
    >,
    column: ColName,
    operator: Operator,
    value: Value
  ): ReturnType<
    typeof addCondition<
      Alias,
      DocRef,
      JoinedDocs,
      Definition,
      AllowedField,
      StrictAllowedField,
      typeof ConditionClause.WHERE,
      ColName,
      ColName extends `${infer TableAlias}.${infer TableColumn}`
        ? TableAlias extends Alias
          ? DocRef['fields'][TableColumn]
          : JoinedDocs[TableAlias]['fields'][TableColumn]
        : never,
      Operator,
      Value,
      typeof LogicalOperator.AND,
      Lowercase<typeof ConditionClause.WHERE>
    >
  >;

  or<
    ColName extends StrictAllowedField,
    Col extends ColName extends `${infer TableAlias}.${infer TableColumn}`
      ? TableAlias extends Alias
        ? DocRef['fields'][TableColumn]
        : JoinedDocs[TableAlias]['fields'][TableColumn]
      : never,
    Operator extends AcceptedOperator,
    Value extends WhereValue<Col>[Operator],
  >(
    this: QueryBuilder<
      Alias,
      DocRef,
      JoinedDocs,
      Definition,
      AllowedField,
      StrictAllowedField
    >,
    column: ColName,
    operator: Operator,
    value: Value
  ): ReturnType<
    typeof addCondition<
      Alias,
      DocRef,
      JoinedDocs,
      Definition,
      AllowedField,
      StrictAllowedField,
      typeof ConditionClause.WHERE,
      ColName,
      ColName extends `${infer TableAlias}.${infer TableColumn}`
        ? TableAlias extends Alias
          ? DocRef['fields'][TableColumn]
          : JoinedDocs[TableAlias]['fields'][TableColumn]
        : never,
      Operator,
      Value,
      typeof LogicalOperator.OR,
      Lowercase<typeof ConditionClause.WHERE>
    >
  >;

  having<
    ColName extends StrictAllowedField,
    Col extends ColName extends `${infer TableAlias}.${infer TableColumn}`
      ? TableAlias extends Alias
        ? DocRef['fields'][TableColumn]
        : JoinedDocs[TableAlias]['fields'][TableColumn]
      : never,
    Operator extends AcceptedOperator,
    Value extends WhereValue<Col>[Operator],
  >(
    this: QueryBuilder<
      Alias,
      DocRef,
      JoinedDocs,
      Definition,
      AllowedField,
      StrictAllowedField
    >,
    column: ColName,
    operator: Operator,
    value: Value
  ): ReturnType<
    typeof addCondition<
      Alias,
      DocRef,
      JoinedDocs,
      Definition,
      AllowedField,
      StrictAllowedField,
      typeof ConditionClause.HAVING,
      ColName,
      ColName extends `${infer TableAlias}.${infer TableColumn}`
        ? TableAlias extends Alias
          ? DocRef['fields'][TableColumn]
          : JoinedDocs[TableAlias]['fields'][TableColumn]
        : never,
      Operator,
      Value,
      typeof LogicalOperator.AND,
      Lowercase<typeof ConditionClause.HAVING>
    >
  >;
}
