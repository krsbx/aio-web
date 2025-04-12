import type { UnionToIntersection } from '../../types';
import type { Document } from '../document';
import type { Field } from '../field';
import type {
  AcceptedOperator,
  AggregationFunction,
  OrderBy,
  QueryType,
} from './constants';

export type FieldSelector<
  Alias extends string,
  DocRef extends Document<string, Record<string, Field>>,
  JoinedDocs extends Record<string, Document<string, Record<string, Field>>>,
> =
  | `${Alias}.${keyof DocRef['fields'] & string}`
  | `${Alias}.*`
  | {
      [A in keyof JoinedDocs]:
        | `${A & string}.${keyof JoinedDocs[A]['fields'] & string}`
        | `${A & string}.*`;
    }[keyof JoinedDocs];

export type StrictFieldSelector<
  Alias extends string,
  DocRef extends Document<string, Record<string, Field>>,
  JoinedDocs extends Record<string, Document<string, Record<string, Field>>>,
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
  DocRef extends Document<string, Record<string, Field>>,
  JoinedDocs extends Record<
    string,
    Document<string, Record<string, Field>>
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

type InsertUpdateDeleteQueryOutput<
  DocRef extends Document<string, Record<string, Field>>,
> = {
  [K in keyof DocRef['fields']]: DocRef['fields'][K]['_output'];
};

type InferAliasedField<
  Current extends AliasedField<string, string>,
  Alias extends string,
  DocRef extends Document<string, Record<string, Field>>,
  JoinedDocs extends Record<string, Document<string, Record<string, Field>>>,
> = Current extends {
  field: `${infer DocAlias}.${infer FieldName}`;
  as: `${infer ColAlias}`;
}
  ? DocAlias extends keyof JoinedDocs
    ? {
        [T in DocAlias]: {
          [K in ColAlias]: JoinedDocs[T]['fields'][FieldName]['_output'];
        };
      }
    : DocAlias extends Alias | DocRef['name']
      ? {
          [K in FieldName as ColAlias]: DocRef['fields'][K]['_output'];
        }
      : NonNullable<unknown>
  : NonNullable<unknown>;

type InferRawField<
  Current extends string,
  Alias extends string,
  DocRef extends Document<string, Record<string, Field>>,
  JoinedDocs extends Record<string, Document<string, Record<string, Field>>>,
> = Current extends `${infer DocAlias}.${infer FieldName}`
  ? DocAlias extends keyof JoinedDocs
    ? {
        [T in DocAlias]: {
          [K in FieldName]: JoinedDocs[T]['fields'][K]['_output'];
        };
      }
    : DocAlias extends Alias | DocRef['name']
      ? {
          [K in FieldName]: DocRef['fields'][K]['_output'];
        }
      : NonNullable<unknown>
  : Current extends `${infer DocAlias}.${infer FieldName}`
    ? FieldName extends '*'
      ? DocAlias extends keyof JoinedDocs
        ? {
            [T in DocAlias]: {
              [K in keyof JoinedDocs[T]['fields']]: JoinedDocs[T]['fields'][K]['_output'];
            };
          }
        : DocAlias extends Alias | DocRef['name']
          ? {
              [K in keyof DocRef['fields']]: DocRef['fields'][K]['_output'];
            }
          : NonNullable<unknown>
      : NonNullable<unknown>
    : NonNullable<unknown>;

type InferSelectQueryOutput<
  Alias extends string,
  DocRef extends Document<string, Record<string, Field>>,
  JoinedDocs extends Record<string, Document<string, Record<string, Field>>>,
  Definition extends Partial<QueryDefinition<Alias, DocRef, JoinedDocs>>,
  AllowedField extends FieldSelector<Alias, DocRef, JoinedDocs>,
> = Definition extends { select: infer Select }
  ? Select extends Array<SelectableField<AllowedField>>
    ? UnionToIntersection<
        Select[number] extends infer Col
          ? Col extends RawField<AllowedField>
            ? InferRawField<Col, Alias, DocRef, JoinedDocs>
            : Col extends AliasedField<AllowedField>
              ? InferAliasedField<Col, Alias, DocRef, JoinedDocs>
              : NonNullable<unknown>
          : NonNullable<unknown>
      >
    : NonNullable<unknown>
  : NonNullable<unknown>;

type InferAggregateField<
  Current extends AggregateField<string>,
  Alias extends string,
  DocRef extends Document<string, Record<string, Field>>,
  JoinedDocs extends Record<string, Document<string, Record<string, Field>>>,
> = Current extends {
  field: `${infer DocAlias}.${infer FieldName}`;
  as: `${infer ColAlias}`;
  fn?: AggregationFunction;
}
  ? DocAlias extends keyof JoinedDocs
    ? {
        [T in DocAlias]: {
          [K in ColAlias]:
            | JoinedDocs[T]['fields'][FieldName]['_output']
            | number;
        };
      }
    : DocAlias extends Alias | DocRef['name']
      ? {
          [K in FieldName as ColAlias]: DocRef['fields'][K]['_output'] | number;
        }
      : NonNullable<unknown>
  : NonNullable<unknown>;

type InferAggregateQueryOutput<
  Alias extends string,
  DocRef extends Document<string, Record<string, Field>>,
  JoinedDocs extends Record<string, Document<string, Record<string, Field>>>,
  Definition extends Partial<QueryDefinition<Alias, DocRef, JoinedDocs>>,
  AllowedField extends FieldSelector<Alias, DocRef, JoinedDocs>,
> = Definition extends { aggregates: infer Aggregates }
  ? Aggregates extends Array<AggregateField<AllowedField>>
    ? UnionToIntersection<
        Aggregates[number] extends infer Col
          ? Col extends RawField<AllowedField>
            ? InferRawField<Col, Alias, DocRef, JoinedDocs>
            : Col extends AliasedField<AllowedField>
              ? InferAliasedField<Col, Alias, DocRef, JoinedDocs>
              : Col extends AggregateField<AllowedField>
                ? InferAggregateField<Col, Alias, DocRef, JoinedDocs>
                : NonNullable<unknown>
          : NonNullable<unknown>
      >
    : NonNullable<unknown>
  : NonNullable<unknown>;

export type SelectQueryOutput<
  Alias extends string,
  DocRef extends Document<string, Record<string, Field>>,
  JoinedDocs extends Record<string, Document<string, Record<string, Field>>>,
  Definition extends Partial<QueryDefinition<Alias, DocRef, JoinedDocs>>,
  AllowedField extends FieldSelector<Alias, DocRef, JoinedDocs>,
> = InferSelectQueryOutput<
  Alias,
  DocRef,
  JoinedDocs,
  Definition,
  AllowedField
> &
  InferAggregateQueryOutput<
    Alias,
    DocRef,
    JoinedDocs,
    Definition,
    AllowedField
  >;

export type QueryOutput<
  Alias extends string,
  DocRef extends Document<string, Record<string, Field>>,
  JoinedDocs extends Record<string, Document<string, Record<string, Field>>>,
  Definition extends Partial<QueryDefinition<Alias, DocRef, JoinedDocs>>,
  AllowedField extends FieldSelector<Alias, DocRef, JoinedDocs>,
> = Definition extends { queryType: infer Type }
  ? Type extends null
    ? never
    : Type extends
          | typeof QueryType.INSERT
          | typeof QueryType.UPDATE
          | typeof QueryType.DELETE
      ? InsertUpdateDeleteQueryOutput<DocRef>[]
      : Type extends typeof QueryType.SELECT
        ? SelectQueryOutput<
            Alias,
            DocRef,
            JoinedDocs,
            Definition,
            AllowedField
          >[]
        : never
  : never;
