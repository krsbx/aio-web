import type { Documents } from '../documents';
import type { Field } from '../fields';
import { AcceptedJoin } from './constants';
import type { QueryTransformerContract } from './contract';
import { aggregateCol, alias, clone } from './helper';
import { addJoin } from './join';
import type {
  AcceptedOrderBy,
  AggregateField,
  AliasedField,
  FieldSelector,
  QueryDefinition,
  RawField,
  StrictFieldSelector,
} from './types';

export class QueryBuilder<
  Alias extends string,
  DocRef extends Documents<string, Record<string, Field>>,
  JoinedDocs extends Record<
    string,
    Documents<string, Record<string, Field>>
  > = NonNullable<unknown>,
  Definition extends Partial<
    QueryDefinition<Alias, DocRef, JoinedDocs>
  > = NonNullable<unknown>,
  AllowedField extends FieldSelector<Alias, DocRef, JoinedDocs> = FieldSelector<
    Alias,
    DocRef,
    JoinedDocs
  >,
  StrictAllowedField extends StrictFieldSelector<
    Alias,
    DocRef,
    JoinedDocs
  > = StrictFieldSelector<Alias, DocRef, JoinedDocs>,
> {
  public readonly doc: DocRef;
  public readonly definition: Definition;

  public alias: QueryTransformerContract<
    Alias,
    DocRef,
    JoinedDocs,
    Definition,
    AllowedField,
    StrictAllowedField
  >['alias'];
  public clone: QueryTransformerContract<
    Alias,
    DocRef,
    JoinedDocs,
    Definition,
    AllowedField,
    StrictAllowedField
  >['clone'];

  constructor(doc: DocRef) {
    this.doc = doc;
    this.definition = {
      queryType: null,
      select: null,
      having: null,
      where: null,
      params: null,
      limit: null,
      offset: null,
      groupBy: null,
      insertValues: null,
      updateValues: null,
      orderBy: null,
      aggregates: null,
      joins: null,
      distinct: null,
      baseAlias: null,
      joinedDocs: null,
      withDeleted: null,
    } as Definition;

    this.alias = alias.bind(this) as this['alias'];
    this.clone = clone.bind(this) as this['clone'];
  }

  public leftJoin<
    JoinDoc extends Documents<string, Record<string, Field>>,
    JoinAlias extends string,
    BaseColName extends `${keyof DocRef['fields'] & string}`,
    JoinColName extends `${keyof JoinDoc['fields'] & string}`,
  >(
    joinDoc: JoinDoc,
    alias: JoinAlias,
    baseColumn: BaseColName,
    joinColumn: JoinColName
  ) {
    return addJoin(
      this,
      AcceptedJoin.LEFT,
      alias,
      joinDoc,
      baseColumn,
      joinColumn
    );
  }

  public rightJoin<
    JoinDoc extends Documents<string, Record<string, Field>>,
    JoinAlias extends string,
    BaseColName extends `${keyof DocRef['fields'] & string}`,
    JoinColName extends `${keyof JoinDoc['fields'] & string}`,
  >(
    joinDoc: JoinDoc,
    alias: JoinAlias,
    baseColumn: BaseColName,
    joinColumn: JoinColName
  ) {
    return addJoin(
      this,
      AcceptedJoin.RIGHT,
      alias,
      joinDoc,
      baseColumn,
      joinColumn
    );
  }

  public innerJoin<
    JoinDoc extends Documents<string, Record<string, Field>>,
    JoinAlias extends string,
    BaseColName extends `${keyof DocRef['fields'] & string}`,
    JoinColName extends `${keyof JoinDoc['fields'] & string}`,
  >(
    joinDoc: JoinDoc,
    alias: JoinAlias,
    baseColumn: BaseColName,
    joinColumn: JoinColName
  ) {
    return addJoin(
      this,
      AcceptedJoin.INNER,
      alias,
      joinDoc,
      baseColumn,
      joinColumn
    );
  }

  public naturalJoin<
    JoinDoc extends Documents<string, Record<string, Field>>,
    JoinAlias extends string,
    BaseColName extends `${keyof DocRef['fields'] & string}`,
    JoinColName extends `${keyof JoinDoc['fields'] & string}`,
  >(
    joinDoc: JoinDoc,
    alias: JoinAlias,
    baseColumn: BaseColName,
    joinColumn: JoinColName
  ) {
    return addJoin(
      this,
      AcceptedJoin.NATURAL,
      alias,
      joinDoc,
      baseColumn,
      joinColumn
    );
  }

  public distinct() {
    this.definition.distinct = true;

    return this as unknown as QueryBuilder<
      Alias,
      DocRef,
      JoinedDocs,
      Omit<Definition, 'distinct'> & { distinct: true }
    >;
  }

  public aggregate<
    Aggregates extends Array<
      (c: typeof aggregateCol) => AggregateField<AllowedField>
    >,
  >(...aggregates: Aggregates) {
    this.definition.aggregates = aggregates.map((aggregate) =>
      aggregate(aggregateCol)
    );

    return this as unknown as QueryBuilder<
      Alias,
      DocRef,
      JoinedDocs,
      Omit<Definition, 'aggregates'> & {
        aggregates: {
          [K in keyof Aggregates]: Aggregates[K] extends (col: never) => infer R
            ? R
            : Aggregates[K];
        };
      }
    >;
  }

  public groupBy<
    Groupable extends NonNullable<Definition['select']>,
    Columns extends Groupable extends readonly (infer Col)[]
      ? Col extends RawField<StrictAllowedField>
        ? Col[]
        : Col extends AliasedField<StrictAllowedField, infer Alias>
          ? Alias[]
          : StrictAllowedField[]
      : StrictAllowedField[],
  >(...columns: Columns) {
    this.definition.groupBy = columns as Columns;

    return this as unknown as QueryBuilder<
      Alias,
      DocRef,
      JoinedDocs,
      Omit<Definition, 'groupBy'> & { groupBy: Columns }
    >;
  }

  public limit<Limit extends number | null>(limit: Limit) {
    this.definition.limit = limit;

    return this as unknown as QueryBuilder<
      Alias,
      DocRef,
      JoinedDocs,
      Omit<Definition, 'limit'> & { limit: Limit }
    >;
  }

  public offset<Offset extends number | null>(offset: Offset) {
    this.definition.offset = offset;

    return this as unknown as QueryBuilder<
      Alias,
      DocRef,
      JoinedDocs,
      Omit<Definition, 'offset'> & { offset: Offset }
    >;
  }

  public orderBy<OrderBy extends AcceptedOrderBy<StrictAllowedField>>(
    ...orderBy: OrderBy[]
  ) {
    if (!this.definition.orderBy) this.definition.orderBy = [];

    this.definition.orderBy.push(...orderBy);

    return this as unknown as QueryBuilder<
      Alias,
      DocRef,
      JoinedDocs,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      Omit<Definition, 'orderBy'> & { orderBy: OrderBy }
    >;
  }

  public withDeleted() {
    this.definition.withDeleted = true;

    return this as unknown as QueryBuilder<
      Alias,
      DocRef,
      JoinedDocs,
      Omit<Definition, 'withDeleted'> & { withDeleted: true }
    >;
  }
}
