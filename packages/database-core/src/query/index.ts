import type { Column } from '../column';
import type { Table } from '../table';
import { Dialect } from '../table/constants';
import { deepClone, quoteIdentifier } from '../utilities';
import {
  AcceptedJoin,
  AcceptedOperator,
  AggregationFunction,
  ConditionClause,
  LogicalOperator,
  QueryType,
} from './constants';
import { buildQuery, toQuery } from './sql';
import type {
  AcceptedInsertValues,
  AcceptedOrderBy,
  AcceptedUpdateValues,
  AggregateColumn,
  AliasedColumn,
  ColumnSelector,
  QueryDefinition,
  QueryOutput,
  RawColumn,
  StrictColumnSelector,
  WhereValue,
} from './types';
import {
  getCondition,
  getParanoid,
  getTimestamp,
  parseAliasedRow,
} from './utilities';

export class QueryBuilder<
  Alias extends string,
  TableRef extends Table<string, Record<string, Column>>,
  JoinedTables extends Record<
    string,
    Table<string, Record<string, Column>>
  > = NonNullable<unknown>,
  Definition extends Partial<
    QueryDefinition<Alias, TableRef, JoinedTables>
  > = NonNullable<unknown>,
  AllowedColumn extends ColumnSelector<
    Alias,
    TableRef,
    JoinedTables
  > = ColumnSelector<Alias, TableRef, JoinedTables>,
  StrictAllowedColumn extends StrictColumnSelector<
    Alias,
    TableRef,
    JoinedTables
  > = StrictColumnSelector<Alias, TableRef, JoinedTables>,
> {
  public readonly table: TableRef;
  public readonly definition: Definition;
  public readonly _output!: QueryOutput<
    Alias,
    TableRef,
    JoinedTables,
    Definition,
    AllowedColumn
  >;

  public toQuery: () => {
    query: string;
    params: Definition['params'];
  };
  public toString: () => string;

  constructor(table: TableRef) {
    this.table = table;
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
      joinedTables: null,
      withDeleted: null,
    } as Definition;

    this.toQuery = toQuery.bind(this);
    this.toString = toString.bind(this);
  }

  public alias<NewAlias extends string>(alias: NewAlias) {
    this.definition.baseAlias = alias as unknown as Alias;

    return this as unknown as QueryBuilder<
      NewAlias,
      TableRef,
      JoinedTables,
      Omit<Definition, 'baseAlias'> & { baseAlias: NewAlias }
    >;
  }

  private aggregateCol<
    Aggregate extends AggregationFunction,
    ColName extends StrictAllowedColumn,
  >(
    fn: Aggregate,
    column: ColName
  ): {
    column: ColName;
    as: Lowercase<Aggregate>;
    fn: Aggregate;
  };
  private aggregateCol<
    Aggregate extends AggregationFunction,
    ColName extends StrictAllowedColumn,
    ColAlias extends string,
  >(
    fn: Aggregate,
    column: ColName,
    alias: ColAlias
  ): {
    column: ColName;
    as: ColAlias;
    fn: Aggregate;
  };
  private aggregateCol<
    Aggregate extends AggregationFunction,
    ColName extends StrictAllowedColumn,
    ColAlias extends string,
  >(fn: Aggregate, column: ColName, alias?: ColAlias) {
    return {
      column,
      as: alias ?? fn.toLowerCase(),
      fn,
    };
  }

  private col<ColName extends StrictAllowedColumn, ColAlias extends string>(
    column: ColName,
    alias: ColAlias
  ) {
    return {
      column,
      as: alias,
    } as const;
  }

  private rawCol<ColName extends StrictAllowedColumn>(column: ColName) {
    return column;
  }

  private addRawCondition<
    Clause extends ConditionClause,
    Logical extends LogicalOperator,
  >(
    clause: Clause,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    column: (c: this['rawCol']) => string,
    logical: Logical,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params?: any
  ) {
    const validClause = clause.toLowerCase() as Lowercase<ConditionClause>;

    if (!this.definition[validClause]) this.definition[validClause] = [];

    const condition = column(this.rawCol);

    const logicalPrefix =
      this.definition[validClause].length > 0 ? logical : '';

    this.definition[validClause].push(`${logicalPrefix} ${condition}`.trim());

    if (!this.definition.params) this.definition.params = [];

    if (typeof params === 'undefined') {
      return this;
    }

    if (Array.isArray(params)) {
      this.definition.params.push(...params);
    } else {
      this.definition.params.push(params);
    }

    return this;
  }

  public rawWhere(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    column: (c: this['rawCol']) => string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params?: any
  ) {
    return this.addRawCondition(
      ConditionClause.WHERE,
      column,
      LogicalOperator.AND,
      params
    );
  }

  public rawHaving(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    column: (c: this['rawCol']) => string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params?: any
  ) {
    return this.addRawCondition(
      ConditionClause.HAVING,
      column,
      LogicalOperator.AND,
      params
    );
  }

  public rawAnd(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    column: (c: this['rawCol']) => string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params?: any
  ) {
    return this.addRawCondition(
      ConditionClause.WHERE,
      column,
      LogicalOperator.AND,
      params
    );
  }

  public rawOr(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    column: (c: this['rawCol']) => string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params?: any
  ) {
    return this.addRawCondition(
      ConditionClause.WHERE,
      column,
      LogicalOperator.OR,
      params
    );
  }

  private addCondition<
    Clause extends ConditionClause,
    ColName extends StrictAllowedColumn,
    Col extends ColName extends `${infer TableAlias}.${infer TableColumn}`
      ? TableAlias extends Alias
        ? TableRef['columns'][TableColumn]
        : JoinedTables[TableAlias]['columns'][TableColumn]
      : never,
    Operator extends AcceptedOperator,
    Value extends WhereValue<Col>[Operator],
    Logical extends LogicalOperator,
  >(
    clause: Clause,
    column: ColName,
    operator: Operator,
    value: Value,
    logical: Logical
  ) {
    const validClause = clause.toLowerCase() as Lowercase<ConditionClause>;
    const condition = getCondition(this.table.dialect, column, operator, value);

    if (!this.definition[validClause]) this.definition[validClause] = [];

    const logicalPrefix =
      this.definition[validClause].length > 0 ? logical : '';

    this.definition[validClause].push(`${logicalPrefix} ${condition}`.trim());

    if (
      operator === AcceptedOperator.IS_NULL ||
      operator === AcceptedOperator.IS_NOT_NULL
    ) {
      return this as unknown as QueryBuilder<
        Alias,
        TableRef,
        JoinedTables,
        Omit<Definition, typeof validClause> & {
          [Key in typeof validClause]: string[];
        }
      >;
    }

    if (!this.definition.params) this.definition.params = [];

    if (Array.isArray(value)) {
      this.definition.params.push(...value);
    } else {
      this.definition.params.push(value);
    }

    return this as unknown as QueryBuilder<
      Alias,
      TableRef,
      JoinedTables,
      Omit<Definition, typeof validClause | 'params'> & {
        [Key in typeof validClause]: string[];
      } & {
        params: unknown[];
      }
    >;
  }

  public where<
    ColName extends StrictAllowedColumn,
    Col extends ColName extends `${infer TableAlias}.${infer TableColumn}`
      ? TableAlias extends Alias
        ? TableRef['columns'][TableColumn]
        : JoinedTables[TableAlias]['columns'][TableColumn]
      : never,
    Operator extends AcceptedOperator,
    Value extends WhereValue<Col>[Operator],
  >(column: ColName, operator: Operator, value: Value) {
    return this.addCondition(
      ConditionClause.WHERE,
      column,
      operator,
      value,
      LogicalOperator.AND
    );
  }

  public having<
    ColName extends StrictAllowedColumn,
    Col extends ColName extends `${infer TableAlias}.${infer TableColumn}`
      ? TableAlias extends Alias
        ? TableRef['columns'][TableColumn]
        : JoinedTables[TableAlias]['columns'][TableColumn]
      : never,
    Operator extends AcceptedOperator,
    Value extends WhereValue<Col>[Operator],
  >(column: ColName, operator: Operator, value: Value) {
    return this.addCondition(
      ConditionClause.HAVING,
      column,
      operator,
      value,
      LogicalOperator.AND
    );
  }

  public and<
    ColName extends StrictAllowedColumn,
    Col extends ColName extends `${infer TableAlias}.${infer TableColumn}`
      ? TableAlias extends Alias
        ? TableRef['columns'][TableColumn]
        : JoinedTables[TableAlias]['columns'][TableColumn]
      : never,
    Operator extends AcceptedOperator,
    Value extends WhereValue<Col>[Operator],
  >(column: ColName, operator: Operator, value: Value) {
    return this.addCondition(
      ConditionClause.WHERE,
      column,
      operator,
      value,
      LogicalOperator.AND
    );
  }

  public or<
    ColName extends StrictAllowedColumn,
    Col extends ColName extends `${infer TableAlias}.${infer TableColumn}`
      ? TableAlias extends Alias
        ? TableRef['columns'][TableColumn]
        : JoinedTables[TableAlias]['columns'][TableColumn]
      : never,
    Operator extends AcceptedOperator,
    Value extends WhereValue<Col>[Operator],
  >(column: ColName, operator: Operator, value: Value) {
    return this.addCondition(
      ConditionClause.WHERE,
      column,
      operator,
      value,
      LogicalOperator.OR
    );
  }

  private addJoin<
    JoinTable extends Table<string, Record<string, Column>>,
    JoinAlias extends string,
    BaseColName extends `${Alias}."${keyof TableRef['columns'] & string}"`,
    JoinColName extends `${JoinAlias}."${keyof JoinTable['columns'] & string}"`,
  >(
    joinType: AcceptedJoin,
    alias: JoinAlias,
    joinTable: JoinTable,
    baseColumn: BaseColName,
    joinColumn: JoinColName
  ) {
    if (!this.definition.joins) this.definition.joins = [];

    this.definition.joins.push(
      `${joinType} JOIN ${joinTable.name} AS ${alias} ON ${
        baseColumn
      } = ${joinColumn}`
    );

    if (!this.definition.joinedTables) {
      this.definition.joinedTables = {} as JoinedTables;
    }

    this.definition.joinedTables = {
      ...this.definition.joinedTables,
      [alias]: joinTable,
    };

    return this as unknown as QueryBuilder<
      Alias,
      TableRef,
      JoinedTables & { [K in JoinAlias]: JoinTable },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      Definition & {
        joins: string[];
        joinedTables: JoinedTables & { [K in JoinAlias]: JoinTable };
      }
    >;
  }

  public leftJoin<
    JoinTable extends Table<string, Record<string, Column>>,
    JoinAlias extends string,
    BaseColName extends `${Alias}."${keyof TableRef['columns'] & string}"`,
    JoinColName extends `${JoinAlias}."${keyof JoinTable['columns'] & string}"`,
  >(
    joinTable: JoinTable,
    alias: JoinAlias,
    baseColumn: BaseColName,
    joinColumn: JoinColName
  ) {
    return this.addJoin(
      AcceptedJoin.LEFT,
      alias,
      joinTable,
      baseColumn,
      joinColumn
    );
  }

  public rightJoin<
    JoinTable extends Table<string, Record<string, Column>>,
    JoinAlias extends string,
    BaseColName extends `${Alias}."${keyof TableRef['columns'] & string}"`,
    JoinColName extends `${JoinAlias}."${keyof JoinTable['columns'] & string}"`,
  >(
    joinTable: JoinTable,
    alias: JoinAlias,
    baseColumn: BaseColName,
    joinColumn: JoinColName
  ) {
    return this.addJoin(
      AcceptedJoin.RIGHT,
      alias,
      joinTable,
      baseColumn,
      joinColumn
    );
  }

  public innerJoin<
    JoinTable extends Table<string, Record<string, Column>>,
    JoinAlias extends string,
    BaseColName extends `${Alias}."${keyof TableRef['columns'] & string}"`,
    JoinColName extends `${JoinAlias}."${keyof JoinTable['columns'] & string}"`,
  >(
    joinTable: JoinTable,
    alias: JoinAlias,
    baseColumn: BaseColName,
    joinColumn: JoinColName
  ) {
    return this.addJoin(
      AcceptedJoin.INNER,
      alias,
      joinTable,
      baseColumn,
      joinColumn
    );
  }

  public naturalJoin<
    JoinTable extends Table<string, Record<string, Column>>,
    JoinAlias extends string,
    BaseColName extends `${Alias}."${keyof TableRef['columns'] & string}"`,
    JoinColName extends `${JoinAlias}."${keyof JoinTable['columns'] & string}"`,
  >(
    joinTable: JoinTable,
    alias: JoinAlias,
    baseColumn: BaseColName,
    joinColumn: JoinColName
  ) {
    return this.addJoin(
      AcceptedJoin.NATURAL,
      alias,
      joinTable,
      baseColumn,
      joinColumn
    );
  }

  public distinct() {
    this.definition.distinct = true;

    return this as unknown as QueryBuilder<
      Alias,
      TableRef,
      JoinedTables,
      Definition & { distinct: true }
    >;
  }

  public aggregate<
    Aggregates extends Array<
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      (c: this['aggregateCol']) => AggregateColumn<AllowedColumn>
    >,
  >(...aggregates: Aggregates) {
    this.definition.aggregates = aggregates.map((aggregate) =>
      aggregate(this.aggregateCol)
    );

    return this as unknown as QueryBuilder<
      Alias,
      TableRef,
      JoinedTables,
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
      ? Col extends RawColumn<StrictAllowedColumn>
        ? Col[]
        : Col extends AliasedColumn<StrictAllowedColumn, infer Alias>
          ? Alias[]
          : StrictAllowedColumn[]
      : StrictAllowedColumn[],
  >(...columns: Columns) {
    this.definition.groupBy = columns as Columns;

    return this as unknown as QueryBuilder<
      Alias,
      TableRef,
      JoinedTables,
      Definition & { groupBy: Columns }
    >;
  }

  public limit<Limit extends number | null>(limit: Limit) {
    this.definition.limit = limit;

    return this as unknown as QueryBuilder<
      Alias,
      TableRef,
      JoinedTables,
      Definition & { limit: Limit }
    >;
  }

  public offset<Offset extends number | null>(offset: Offset) {
    this.definition.offset = offset;

    return this as unknown as QueryBuilder<
      Alias,
      TableRef,
      JoinedTables,
      Definition & { offset: Offset }
    >;
  }

  public orderBy<OrderBy extends AcceptedOrderBy<StrictAllowedColumn>>(
    ...orderBy: OrderBy[]
  ) {
    if (!this.definition.orderBy) this.definition.orderBy = [];

    this.definition.orderBy.push(...orderBy);

    return this as unknown as QueryBuilder<
      Alias,
      TableRef,
      JoinedTables,
      Definition & { orderBy: OrderBy }
    >;
  }

  public withDeleted() {
    this.definition.withDeleted = true;

    return this as unknown as QueryBuilder<
      Alias,
      TableRef,
      JoinedTables,
      Definition & { withDeleted: true }
    >;
  }

  public clone() {
    const query = new QueryBuilder<Alias, TableRef, JoinedTables>(this.table);

    Object.assign(query.definition, deepClone(this.definition));

    return query;
  }

  public select<
    Base extends Definition['baseAlias'] extends string
      ? Definition['baseAlias']
      : TableRef['name'],
    Columns extends TableRef['columns'],
  >(): QueryBuilder<
    Alias,
    TableRef,
    JoinedTables,
    Omit<Definition, 'queryType' | 'select'> & {
      queryType: typeof QueryType.SELECT;
      select: Array<`${Base}."${keyof Columns & string}"`>;
    }
  >;
  public select<
    Columns extends Array<
      | RawColumn<AllowedColumn>
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      | ((c: this['col']) => AliasedColumn<AllowedColumn, string>)
    >,
  >(
    ...columns: Columns
  ): QueryBuilder<
    Alias,
    TableRef,
    JoinedTables,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    Omit<Definition, 'queryType' | 'select'> & {
      queryType: typeof QueryType.SELECT;
      select: {
        [K in keyof Columns]: Columns[K] extends (col: never) => infer R
          ? R
          : Columns[K];
      };
    }
  >;
  public select(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...columns: any[]
  ) {
    if (!columns.length) {
      const base = this.definition.baseAlias ?? this.table.name;

      columns = Object.keys(this.table.columns).map(
        (colName) => `${base}.${quoteIdentifier(colName)}`
      );
    } else {
      columns = columns.map((column) => {
        if (typeof column === 'function') {
          return column(this.col);
        }

        return column;
      });
    }

    this.definition.select = columns;
    this.definition.queryType = QueryType.SELECT;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this as any;
  }

  public insert<Values extends AcceptedInsertValues<TableRef['columns']>>(
    ...values: Values
  ) {
    this.definition.queryType = QueryType.INSERT;

    if (!this.definition.insertValues) this.definition.insertValues = [];

    const { isWithTimestamp, createdAt, updatedAt, timestamp } = getTimestamp(
      this.table
    );

    if (isWithTimestamp) {
      values = values.map((row) => ({
        ...row,
        [createdAt]: row[createdAt as keyof typeof row] ?? timestamp,
        [updatedAt]: row[updatedAt as keyof typeof row] ?? timestamp,
      })) as Values;
    }

    this.definition.insertValues.push(...values);

    return this as unknown as QueryBuilder<
      Alias,
      TableRef,
      JoinedTables,
      Omit<Definition, 'queryType' | 'insertValues'> & {
        queryType: typeof QueryType.INSERT;
        insertValues: Values;
      }
    >;
  }

  public update<Values extends AcceptedUpdateValues<TableRef['columns']>>(
    values: Values
  ) {
    const { isWithTimestamp, updatedAt, timestamp } = getTimestamp(this.table);

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
      TableRef,
      JoinedTables,
      Omit<Definition, 'queryType' | 'updateValues'> & {
        queryType: typeof QueryType.UPDATE;
        updateValues: Values;
      }
    >;
  }

  public delete() {
    const { isWithParanoid, deletedAt, timestamp } = getParanoid(this.table);

    if (isWithParanoid) {
      return this.update({
        [deletedAt]: timestamp,
      } as AcceptedUpdateValues<TableRef['columns']>);
    }

    this.definition.queryType = QueryType.DELETE;

    return this as unknown as QueryBuilder<
      Alias,
      TableRef,
      JoinedTables,
      Omit<Definition, 'queryType'> & { queryType: typeof QueryType.DELETE }
    >;
  }

  public async exec<
    Output extends this['_output'] extends void ? void : this['_output'][],
  >(): Promise<Output> {
    if (!this.table.database) throw new Error('Database client not defined');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any;
    const { query, params } = this.toQuery();

    if (this.table.dialect === Dialect.SQLITE) {
      result = await this.table.database.exec(query, params);
    } else {
      result = await this.table.database.exec(buildQuery(query), params);
    }

    if (Array.isArray(result)) {
      return result.map((r) =>
        parseAliasedRow({
          row: r,
          selects: this.definition.select ?? [],
          root: this.definition?.baseAlias ?? this.table.name,
        })
      ) as Output;
    }

    return result;
  }

  public infer(): this['_output'] {
    return null as never;
  }
}
