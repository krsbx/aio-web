import type { QueryBuilder } from '.';
import type { Field } from '../fields';
import type { Documents } from '../documents';
import {
  AcceptedOperator,
  ConditionClause,
  LogicalOperator,
} from './constants';
import { rawCol } from './helper';
import type {
  FieldSelector,
  QueryDefinition,
  StrictFieldSelector,
  WhereValue,
} from './types';
import { getCondition } from './utilities';

export function addRawCondition<
  Alias extends string,
  DocRef extends Documents<string, Record<string, Field>>,
  JoinedDocs extends Record<string, Documents<string, Record<string, Field>>>,
  Definition extends Partial<QueryDefinition<Alias, DocRef, JoinedDocs>>,
  AllowedField extends FieldSelector<Alias, DocRef, JoinedDocs>,
  StrictAllowedField extends StrictFieldSelector<Alias, DocRef, JoinedDocs>,
  Clause extends ConditionClause,
  Logical extends LogicalOperator,
  ValidClause extends Lowercase<Clause>,
>(
  query: QueryBuilder<
    Alias,
    DocRef,
    JoinedDocs,
    Definition,
    AllowedField,
    StrictAllowedField
  >,
  clause: Clause,
  column: (c: typeof rawCol) => string,
  logical: Logical,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: any
) {
  const validClause = clause.toLowerCase() as ValidClause;

  if (!query.definition[validClause]) query.definition[validClause] = [];

  const condition = column(rawCol);

  const logicalPrefix = query.definition[validClause].length > 0 ? logical : '';

  query.definition[validClause].push(`${logicalPrefix} ${condition}`.trim());

  if (!query.definition.params) query.definition.params = [];

  if (typeof params === 'undefined') {
    return query;
  }

  if (Array.isArray(params)) {
    query.definition.params.push(...params);
  } else {
    query.definition.params.push(params);
  }

  return query as unknown as QueryBuilder<
    Alias,
    DocRef,
    JoinedDocs,
    Omit<Definition, typeof validClause | 'params'> & {
      [Key in typeof validClause]: string[];
    } & {
      params: unknown[];
    }
  >;
}

export function rawWhere<
  Alias extends string,
  DocRef extends Documents<string, Record<string, Field>>,
  JoinedDocs extends Record<string, Documents<string, Record<string, Field>>>,
  Definition extends Partial<QueryDefinition<Alias, DocRef, JoinedDocs>>,
  AllowedField extends FieldSelector<Alias, DocRef, JoinedDocs>,
  StrictAllowedField extends StrictFieldSelector<Alias, DocRef, JoinedDocs>,
>(
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
) {
  return addRawCondition(
    this,
    ConditionClause.WHERE,
    column,
    LogicalOperator.AND,
    params
  );
}

export function rawOr<
  Alias extends string,
  DocRef extends Documents<string, Record<string, Field>>,
  JoinedDocs extends Record<string, Documents<string, Record<string, Field>>>,
  Definition extends Partial<QueryDefinition<Alias, DocRef, JoinedDocs>>,
  AllowedField extends FieldSelector<Alias, DocRef, JoinedDocs>,
  StrictAllowedField extends StrictFieldSelector<Alias, DocRef, JoinedDocs>,
>(
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
) {
  return addRawCondition(
    this,
    ConditionClause.WHERE,
    column,
    LogicalOperator.OR,
    params
  );
}

export function rawHaving<
  Alias extends string,
  DocRef extends Documents<string, Record<string, Field>>,
  JoinedDocs extends Record<string, Documents<string, Record<string, Field>>>,
  Definition extends Partial<QueryDefinition<Alias, DocRef, JoinedDocs>>,
  AllowedField extends FieldSelector<Alias, DocRef, JoinedDocs>,
  StrictAllowedField extends StrictFieldSelector<Alias, DocRef, JoinedDocs>,
>(
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
) {
  return addRawCondition(
    this,
    ConditionClause.HAVING,
    column,
    LogicalOperator.AND,
    params
  );
}

export function addCondition<
  Alias extends string,
  DocRef extends Documents<string, Record<string, Field>>,
  JoinedDocs extends Record<string, Documents<string, Record<string, Field>>>,
  Definition extends Partial<QueryDefinition<Alias, DocRef, JoinedDocs>>,
  AllowedField extends FieldSelector<Alias, DocRef, JoinedDocs>,
  StrictAllowedField extends StrictFieldSelector<Alias, DocRef, JoinedDocs>,
  Clause extends ConditionClause,
  ColName extends StrictAllowedField,
  Col extends ColName extends `${infer TableAlias}.${infer TableColumn}`
    ? TableAlias extends Alias
      ? DocRef['fields'][TableColumn]
      : JoinedDocs[TableAlias]['fields'][TableColumn]
    : never,
  Operator extends AcceptedOperator,
  Value extends WhereValue<Col>[Operator],
  Logical extends LogicalOperator,
  ValidClause extends Lowercase<Clause>,
>(
  query: QueryBuilder<
    Alias,
    DocRef,
    JoinedDocs,
    Definition,
    AllowedField,
    StrictAllowedField
  >,
  clause: Clause,
  column: ColName,
  operator: Operator,
  value: Value,
  logical: Logical
) {
  const validClause = clause.toLowerCase() as ValidClause;
  const condition = getCondition(column, operator, value);

  if (!query.definition[validClause]) query.definition[validClause] = [];

  const logicalPrefix = query.definition[validClause].length > 0 ? logical : '';

  query.definition[validClause].push(`${logicalPrefix} ${condition}`.trim());

  if (
    operator === AcceptedOperator.IS_NULL ||
    operator === AcceptedOperator.IS_NOT_NULL
  ) {
    return query as unknown as QueryBuilder<
      Alias,
      DocRef,
      JoinedDocs,
      Omit<Definition, typeof validClause> & {
        [Key in typeof validClause]: string[];
      }
    >;
  }

  if (!query.definition.params) query.definition.params = [];

  if (Array.isArray(value)) {
    query.definition.params.push(...value);
  } else {
    query.definition.params.push(value);
  }

  return query as unknown as QueryBuilder<
    Alias,
    DocRef,
    JoinedDocs,
    Omit<Definition, typeof validClause | 'params'> & {
      [Key in typeof validClause]: string[];
    } & {
      params: unknown[];
    }
  >;
}

export function where<
  Alias extends string,
  DocRef extends Documents<string, Record<string, Field>>,
  JoinedDocs extends Record<string, Documents<string, Record<string, Field>>>,
  Definition extends Partial<QueryDefinition<Alias, DocRef, JoinedDocs>>,
  AllowedField extends FieldSelector<Alias, DocRef, JoinedDocs>,
  StrictAllowedField extends StrictFieldSelector<Alias, DocRef, JoinedDocs>,
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
) {
  return addCondition(
    this,
    ConditionClause.WHERE,
    column,
    operator,
    value,
    LogicalOperator.AND
  );
}

export function or<
  Alias extends string,
  DocRef extends Documents<string, Record<string, Field>>,
  JoinedDocs extends Record<string, Documents<string, Record<string, Field>>>,
  Definition extends Partial<QueryDefinition<Alias, DocRef, JoinedDocs>>,
  AllowedField extends FieldSelector<Alias, DocRef, JoinedDocs>,
  StrictAllowedField extends StrictFieldSelector<Alias, DocRef, JoinedDocs>,
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
) {
  return addCondition(
    this,
    ConditionClause.WHERE,
    column,
    operator,
    value,
    LogicalOperator.OR
  );
}

export function having<
  Alias extends string,
  DocRef extends Documents<string, Record<string, Field>>,
  JoinedDocs extends Record<string, Documents<string, Record<string, Field>>>,
  Definition extends Partial<QueryDefinition<Alias, DocRef, JoinedDocs>>,
  AllowedField extends FieldSelector<Alias, DocRef, JoinedDocs>,
  StrictAllowedField extends StrictFieldSelector<Alias, DocRef, JoinedDocs>,
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
) {
  return addCondition(
    this,
    ConditionClause.HAVING,
    column,
    operator,
    value,
    LogicalOperator.AND
  );
}
