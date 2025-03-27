import type { Documents } from '../documents';
import type { Field } from '../fields';
import type {
  AcceptedOperator,
  AggregationFunction,
  OrderBy,
  QueryType,
} from './constants';

export type FieldSelector<
  Alias extends string,
  DocRef extends Documents<string, Record<string, Field>>,
  JoinedTables extends Record<string, Documents<string, Record<string, Field>>>,
> =
  | `${Alias}.${keyof DocRef['fields'] & string}`
  | `${Alias}.*`
  | {
      [A in keyof JoinedTables]:
        | `${A & string}.${keyof JoinedTables[A]['fields'] & string}`
        | `${A & string}.*`;
    }[keyof JoinedTables];

export type StrictFieldSelector<
  Alias extends string,
  DocRef extends Documents<string, Record<string, Field>>,
  JoinedDocs extends Record<string, Documents<string, Record<string, Field>>>,
> =
  | `${Alias}.${keyof DocRef['fields'] & string}`
  | {
      [A in keyof JoinedDocs]: `${A & string}.${keyof JoinedDocs[A]['fields'] & string}`;
    }[keyof JoinedDocs];

export type WhereValue<T extends Field> = {
  [K in AcceptedOperator]: K extends
    | typeof AcceptedOperator.BETWEEN
    | typeof AcceptedOperator.NOT_BETWEEN
    ? [T['_output'], T['_output']]
    : K extends typeof AcceptedOperator.IN | typeof AcceptedOperator.NOT_IN
      ? T['_output'][]
      : K extends
            | typeof AcceptedOperator.IS_NULL
            | typeof AcceptedOperator.IS_NOT_NULL
        ? never
        : T['_output'];
};

export type AcceptedOrderBy<Fields extends string> = {
  field: Fields;
  direction: OrderBy;
};

type InsertValuesParser<Fields extends Record<string, Field>> = {
  [FieldName in keyof Fields]: {
    output: Fields[FieldName]['_output'];
    required: Fields[FieldName]['definition'] extends {
      notNull: true;
    }
      ? true
      : Fields[FieldName]['definition'] extends { default: infer Default }
        ? Default extends NonNullable<Default>
          ? false
          : true
        : false;
  };
};

type InsertValuesParserRequired<
  Parsed extends InsertValuesParser<Record<string, Field>>,
> = {
  [FieldName in keyof Parsed as Parsed[FieldName]['required'] extends true
    ? FieldName
    : never]: Parsed[FieldName]['output'];
};

type InsertValuesParserOptional<
  Parsed extends InsertValuesParser<Record<string, Field>>,
> = {
  [FieldName in keyof Parsed as Parsed[FieldName]['required'] extends false
    ? FieldName
    : never]?: Parsed[FieldName]['output'];
};

export type AcceptedInsertValues<
  Fields extends Record<string, Field>,
  Parsed extends InsertValuesParser<Fields> = InsertValuesParser<Fields>,
  Required extends
    InsertValuesParserRequired<Parsed> = InsertValuesParserRequired<Parsed>,
  Optional extends
    InsertValuesParserOptional<Parsed> = InsertValuesParserOptional<Parsed>,
> = Array<Required & Optional>;

export type AcceptedUpdateValues<Fields extends Record<string, Field>> = {
  [FieldName in keyof Fields]?: Fields[FieldName]['_output'];
};

export type RawField<AllowedField extends string> = AllowedField;

export type AliasedField<
  Allowed extends string,
  Alias extends string = string,
> = {
  field: Allowed;
  as: Alias;
};

export type SelectableField<Allowed extends string> =
  | RawField<Allowed>
  | AliasedField<Allowed>;

export type AggregateField<
  Allowed extends string,
  Fn extends AggregationFunction = AggregationFunction,
  Alias extends string = string,
> = {
  field: Allowed;
  as?: Alias | Fn;
  fn: AggregationFunction;
};

export interface QueryDefinition<
  Alias extends string,
  DocRef extends Documents<string, Record<string, Field>>,
  JoinedDocs extends Record<
    string,
    Documents<string, Record<string, Field>>
  > = NonNullable<unknown>,
  AllowedField extends FieldSelector<Alias, DocRef, JoinedDocs> = FieldSelector<
    Alias,
    DocRef,
    JoinedDocs
  >,
> {
  queryType: QueryType | null;
  select: SelectableField<AllowedField>[] | null;
  where: string[] | null;
  having: string[] | null;
  params: unknown[] | null;
  limit: number | null;
  offset: number | null;
  groupBy: AllowedField[] | null;
  insertValues: AcceptedInsertValues<DocRef['fields']> | null;
  updateValues: AcceptedUpdateValues<DocRef['fields']> | null;
  orderBy: AcceptedOrderBy<AllowedField>[] | null;
  aggregates: AggregateField<AllowedField>[] | null;
  distinct: boolean | null;
  joins: string[] | null;
  baseAlias: Alias | null;
  withDeleted: boolean | null;
  joinedDocs: JoinedDocs | null;
}
