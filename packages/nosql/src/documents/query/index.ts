import { randomUUIDv7 } from 'bun';
import type { Documents } from '../documents';
import type { Field } from '../fields';
import { having, or, rawHaving, rawOr, rawWhere, where } from './condition';
import { AcceptedJoin, QueryType } from './constants';
import type {
  QueryConditionContract,
  QueryTransformerContract,
} from './contract';
import { aggregateCol, alias, clone, col } from './helper';
import { addJoin } from './join';
import { exec, toQuery, toString } from './sql';
import type {
  AcceptedInsertValues,
  AcceptedOrderBy,
  AcceptedUpdateValues,
  AggregateField,
  AliasedField,
  FieldSelector,
  QueryDefinition,
  QueryOutput,
  RawField,
  StrictFieldSelector,
} from './types';
import { getParanoid, getTimestamp } from './utilities';

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
  public readonly _output!: QueryOutput<
    Alias,
    DocRef,
    JoinedDocs,
    Definition,
    AllowedField
  >;

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
  public exec: QueryTransformerContract<
    Alias,
    DocRef,
    JoinedDocs,
    Definition,
    AllowedField,
    StrictAllowedField
  >['exec'];

  public toQuery: QueryTransformerContract<
    Alias,
    DocRef,
    JoinedDocs,
    Definition,
    AllowedField,
    StrictAllowedField
  >['toQuery'];
  public toString: QueryTransformerContract<
    Alias,
    DocRef,
    JoinedDocs,
    Definition,
    AllowedField,
    StrictAllowedField
  >['toString'];

  public rawWhere: QueryConditionContract<
    Alias,
    DocRef,
    JoinedDocs,
    Definition,
    AllowedField,
    StrictAllowedField
  >['rawWhere'];
  public rawAnd: QueryConditionContract<
    Alias,
    DocRef,
    JoinedDocs,
    Definition,
    AllowedField,
    StrictAllowedField
  >['rawWhere'];
  public rawOr: QueryConditionContract<
    Alias,
    DocRef,
    JoinedDocs,
    Definition,
    AllowedField,
    StrictAllowedField
  >['rawOr'];
  public rawHaving: QueryConditionContract<
    Alias,
    DocRef,
    JoinedDocs,
    Definition,
    AllowedField,
    StrictAllowedField
  >['rawHaving'];

  public where: QueryConditionContract<
    Alias,
    DocRef,
    JoinedDocs,
    Definition,
    AllowedField,
    StrictAllowedField
  >['where'];
  public and: QueryConditionContract<
    Alias,
    DocRef,
    JoinedDocs,
    Definition,
    AllowedField,
    StrictAllowedField
  >['where'];
  public or: QueryConditionContract<
    Alias,
    DocRef,
    JoinedDocs,
    Definition,
    AllowedField,
    StrictAllowedField
  >['or'];
  public having: QueryConditionContract<
    Alias,
    DocRef,
    JoinedDocs,
    Definition,
    AllowedField,
    StrictAllowedField
  >['having'];

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

    this.toQuery = toQuery.bind(this) as this['toQuery'];
    this.toString = toString.bind(this) as this['toString'];
    this.exec = exec.bind(this) as unknown as this['exec'];

    this.rawWhere = rawWhere.bind(this) as this['rawWhere'];
    this.rawHaving = rawHaving.bind(this) as this['rawHaving'];

    this.rawAnd = this.rawWhere;
    this.rawOr = rawOr.bind(this) as this['rawOr'];

    this.where = where.bind(this) as this['where'];
    this.having = having.bind(this) as this['having'];

    this.and = this.where as this['and'];
    this.or = or.bind(this) as this['or'];
  }

  public leftJoin<
    JoinDoc extends Documents<string, Record<string, Field>>,
    JoinAlias extends string,
    BaseColName extends `${Alias}.${keyof DocRef['fields'] & string}`,
    JoinColName extends `${JoinAlias}.${keyof JoinDoc['fields'] & string}`,
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
    BaseColName extends `${Alias}.${keyof DocRef['fields'] & string}`,
    JoinColName extends `${JoinAlias}.${keyof JoinDoc['fields'] & string}`,
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
    BaseColName extends `${Alias}.${keyof DocRef['fields'] & string}`,
    JoinColName extends `${JoinAlias}.${keyof JoinDoc['fields'] & string}`,
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
    BaseColName extends `${Alias}.${keyof DocRef['fields'] & string}`,
    JoinColName extends `${JoinAlias}.${keyof JoinDoc['fields'] & string}`,
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

  public select<
    Base extends Definition['baseAlias'] extends string
      ? Definition['baseAlias']
      : DocRef['name'],
    Fields extends DocRef['fields'],
  >(): QueryBuilder<
    Alias,
    DocRef,
    JoinedDocs,
    Omit<Definition, 'queryType' | 'select'> & {
      queryType: typeof QueryType.SELECT;
      select: Array<`${Base}.${keyof Fields & string}`>;
    }
  >;
  public select<
    Fields extends Array<
      | RawField<AllowedField>
      | ((c: typeof col) => AliasedField<AllowedField, string>)
    >,
  >(
    ...columns: Fields
  ): QueryBuilder<
    Alias,
    DocRef,
    JoinedDocs,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    Omit<Definition, 'queryType' | 'select'> & {
      queryType: typeof QueryType.SELECT;
      select: {
        [K in keyof Fields]: Fields[K] extends (col: never) => infer R
          ? R
          : Fields[K];
      };
    }
  >;
  public select(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...columns: any[]
  ) {
    if (!columns.length) {
      const base = this.definition.baseAlias ?? this.doc.name;

      columns = Object.keys(this.doc.fields).map(
        (colName) => `${base}.${colName}`
      );
    } else {
      columns = columns.map((column) => {
        if (typeof column === 'function') {
          return column(col);
        }

        return column;
      });
    }

    this.definition.select = columns;
    this.definition.queryType = QueryType.SELECT;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this as any;
  }

  public insert(...values: AcceptedInsertValues<DocRef['fields']>) {
    this.definition.queryType = QueryType.INSERT;

    if (!this.definition.insertValues) this.definition.insertValues = [];

    const { isWithTimestamp, createdAt, updatedAt, timestamp } = getTimestamp(
      this.doc
    );

    values = values.map((row) => ({
      ...row,
      _id: (row as { _id?: string })._id ?? randomUUIDv7(),
    }));

    if (isWithTimestamp) {
      values = values.map((row) => ({
        ...row,
        [createdAt]: row[createdAt as keyof typeof row] ?? timestamp,
        [updatedAt]: row[updatedAt as keyof typeof row] ?? timestamp,
      })) as AcceptedInsertValues<DocRef['fields']>;
    }

    this.definition.insertValues = values as AcceptedInsertValues<
      DocRef['fields']
    >;

    return this as unknown as QueryBuilder<
      Alias,
      DocRef,
      JoinedDocs,
      Omit<Definition, 'queryType' | 'insertValues'> & {
        queryType: typeof QueryType.INSERT;
        insertValues: AcceptedInsertValues<DocRef['fields']>;
      }
    >;
  }

  public update<Values extends AcceptedUpdateValues<DocRef['fields']>>(
    values: Values
  ) {
    const { isWithTimestamp, updatedAt, timestamp } = getTimestamp(this.doc);

    if (isWithTimestamp) {
      values = {
        ...values,
        [updatedAt]: values[updatedAt as keyof typeof values] ?? timestamp,
      };
    }

    this.definition.queryType = QueryType.UPDATE;
    this.definition.updateValues = values;

    return this as unknown as QueryBuilder<
      Alias,
      DocRef,
      JoinedDocs,
      Omit<Definition, 'queryType' | 'updateValues'> & {
        queryType: typeof QueryType.UPDATE;
        updateValues: Values;
      }
    >;
  }

  public delete() {
    const { isWithParanoid, deletedAt, timestamp } = getParanoid(this.doc);

    if (isWithParanoid) {
      return this.update({
        [deletedAt]: timestamp,
      } as AcceptedUpdateValues<DocRef['fields']>);
    }

    this.definition.queryType = QueryType.DELETE;

    return this as unknown as QueryBuilder<
      Alias,
      DocRef,
      JoinedDocs,
      Omit<Definition, 'queryType'> & { queryType: typeof QueryType.DELETE }
    >;
  }

  public infer(): this['_output'] {
    return null as never;
  }
}
