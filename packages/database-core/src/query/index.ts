import { Column } from '../column';
import { Table } from '../table';
import {
  AcceptedJoin as AcceptedJoinValue,
  AcceptedOperator as AcceptedOperatorValue,
  AggregationFunction as AggregationFunctionValue,
  ConditionClause as ConditionClauseValue,
  LogicalOperator as LogicalOperatorValue,
  QueryType as QueryTypeValue,
} from './constants';
import type {
  AcceptedInsertValues,
  AcceptedJoin,
  AcceptedOperator,
  AcceptedOrderBy,
  AcceptedUpdateValues,
  AggregationFunction,
  ColumnSelector,
  ConditionClause,
  LogicalOperator,
  QueryType,
  WhereValue,
} from './types';
import { getCondition } from './utilities';

interface QueryDefinition<
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
  select: AllowedColumn[] | null;
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
> {
  public readonly table: TableRef;
  public readonly definition: Definition;

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
      aggregate: null,
      joins: null,
      distinct: null,
      baseAlias: null,
      joinedTables: null,
    } as Definition;
  }

  public alias<NewAlias extends string>(alias: NewAlias) {
    this.definition.baseAlias = alias as unknown as Alias;

    return this as unknown as QueryBuilder<
      NewAlias,
      TableRef,
      JoinedTables,
      Definition & { baseAlias: NewAlias }
    >;
  }

  private addCondition<
    Clause extends ConditionClause,
    ColName extends AllowedColumn,
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
    const condition = getCondition<TableRef, ColName, Operator, Value>(
      column,
      operator,
      value
    );

    if (!this.definition[validClause]) this.definition[validClause] = [];

    const logicalPrefix =
      this.definition[validClause].length > 0 ? logical : '';

    this.definition[validClause].push(`${logicalPrefix} ${condition}`.trim());

    if (
      operator === AcceptedOperatorValue.IS_NULL ||
      operator === AcceptedOperatorValue.IS_NOT_NULL
    ) {
      return;
    }

    if (!this.definition.params) this.definition.params = [];

    if (Array.isArray(value)) {
      this.definition.params.push(...value);
    } else {
      this.definition.params.push(value);
    }
  }

  public where<
    ColName extends AllowedColumn,
    Col extends ColName extends `${infer TableAlias}.${infer TableColumn}`
      ? TableAlias extends Alias
        ? TableRef['columns'][TableColumn]
        : JoinedTables[TableAlias]['columns'][TableColumn]
      : never,
    Operator extends AcceptedOperator,
    Value extends WhereValue<Col>[Operator],
  >(column: ColName, operator: Operator, value: Value) {
    this.addCondition(
      ConditionClauseValue.WHERE,
      column,
      operator,
      value,
      LogicalOperatorValue.AND
    );

    return this;
  }

  public having<
    ColName extends AllowedColumn,
    Col extends ColName extends `${infer TableAlias}.${infer TableColumn}`
      ? TableAlias extends Alias
        ? TableRef['columns'][TableColumn]
        : JoinedTables[TableAlias]['columns'][TableColumn]
      : never,
    Operator extends AcceptedOperator,
    Value extends WhereValue<Col>[Operator],
  >(column: ColName, operator: Operator, value: Value) {
    this.addCondition(
      ConditionClauseValue.HAVING,
      column,
      operator,
      value,
      LogicalOperatorValue.AND
    );

    return this;
  }

  public and<
    ColName extends AllowedColumn,
    Col extends ColName extends `${infer TableAlias}.${infer TableColumn}`
      ? TableAlias extends Alias
        ? TableRef['columns'][TableColumn]
        : JoinedTables[TableAlias]['columns'][TableColumn]
      : never,
    Operator extends AcceptedOperator,
    Value extends WhereValue<Col>[Operator],
  >(column: ColName, operator: Operator, value: Value) {
    this.addCondition(
      ConditionClauseValue.WHERE,
      column,
      operator,
      value,
      LogicalOperatorValue.AND
    );

    return this;
  }

  public or<
    ColName extends AllowedColumn,
    Col extends ColName extends `${infer TableAlias}.${infer TableColumn}`
      ? TableAlias extends Alias
        ? TableRef['columns'][TableColumn]
        : JoinedTables[TableAlias]['columns'][TableColumn]
      : never,
    Operator extends AcceptedOperator,
    Value extends WhereValue<Col>[Operator],
  >(column: ColName, operator: Operator, value: Value) {
    this.addCondition(
      ConditionClauseValue.WHERE,
      column,
      operator,
      value,
      LogicalOperatorValue.OR
    );

    return this;
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
    ColName extends AllowedColumn,
    Fn extends AggregationFunction,
  >(column: AllowedColumn, fn: Fn) {
    this.definition.aggregate = {
      column,
      fn,
    };

    return this as unknown as QueryBuilder<
      Alias,
      TableRef,
      JoinedTables,
      Definition & { aggregate: { column: ColName; fn: Fn } }
    >;
  }

  public count<ColName extends AllowedColumn>(column: ColName) {
    return this.aggregate(column, AggregationFunctionValue.COUNT);
  }

  public sum<ColName extends AllowedColumn>(column: ColName) {
    return this.aggregate(column, AggregationFunctionValue.SUM);
  }

  public min<ColName extends AllowedColumn>(column: ColName) {
    return this.aggregate(column, AggregationFunctionValue.MIN);
  }

  public max<ColName extends AllowedColumn>(column: ColName) {
    return this.aggregate(column, AggregationFunctionValue.MAX);
  }

  public avg<ColName extends AllowedColumn>(column: ColName) {
    return this.aggregate(column, AggregationFunctionValue.AVG);
  }

  public groupBy<Columns extends AllowedColumn[]>(...columns: Columns) {
    this.definition.groupBy = columns;

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

  public orderBy<OrderBy extends AcceptedOrderBy<AllowedColumn>>(
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

  public select<Columns extends AllowedColumn[]>(...columns: Columns) {
    this.definition.select = columns;
    this.definition.queryType = QueryTypeValue.SELECT;

    return this as unknown as QueryBuilder<
      Alias,
      TableRef,
      JoinedTables,
      Definition & { queryType: typeof QueryTypeValue.SELECT; select: Columns }
    >;
  }

  public insert<
    Columns extends TableRef['columns'],
    Values extends {
      [ColName in keyof Columns]?: ReturnType<Columns[ColName]['infer']>;
    },
  >(...values: Values[]) {
    this.definition.queryType = QueryTypeValue.INSERT;

    if (!this.definition.insertValues) {
      this.definition.insertValues = [];
    }

    this.definition.insertValues.push(...values);

    return this as unknown as QueryBuilder<
      Alias,
      TableRef,
      JoinedTables,
      Definition & { queryType: typeof QueryTypeValue.INSERT }
    >;
  }

  public update<
    Columns extends TableRef['columns'],
    Values extends {
      [ColName in keyof Columns]?: ReturnType<Columns[ColName]['infer']>;
    },
  >(values: Values) {
    this.definition.queryType = QueryTypeValue.UPDATE;
    this.definition.updateValues = values;

    return this as unknown as QueryBuilder<
      Alias,
      TableRef,
      JoinedTables,
      Definition & { queryType: typeof QueryTypeValue.UPDATE }
    >;
  }

  public delete() {
    this.definition.queryType = QueryTypeValue.DELETE;

    return this as unknown as QueryBuilder<
      Alias,
      TableRef,
      JoinedTables,
      Definition & { queryType: typeof QueryTypeValue.DELETE }
    >;
  }

  private buildSelectQuery() {
    const from = this.definition.baseAlias
      ? `${this.table.name} AS ${this.definition.baseAlias}`
      : this.table.name;

    if (this.definition.aggregate) {
      return `SELECT ${this.definition.aggregate.fn}(${this.definition.aggregate.column as string}) FROM ${from}`;
    }

    const columns =
      !this.definition.select || !this.definition.select.length
        ? '*'
        : this.definition.select.join(', ');

    if (this.definition.distinct) {
      return `SELECT DISTINCT ${columns} FROM ${from}`;
    }

    return `SELECT ${columns} FROM ${from}`;
  }

  private buildInsertQuery() {
    if (!this.definition.insertValues || !this.definition.insertValues.length) {
      throw new Error(`INSERT requires values`);
    }

    const keys = Object.keys(
      this.definition.insertValues[0]
    ) as (keyof TableRef['columns'])[];
    const placeholders = keys.map(() => '?').join(', ');

    this.definition.params = this.definition.insertValues.flatMap((row) =>
      keys.map((key) => row[key])
    );

    return `INSERT INTO ${this.table.name} (${keys.join(', ')}) VALUES (${placeholders})`;
  }

  private buildUpdateQuery() {
    if (!this.definition.updateValues || !this.definition.updateValues.length) {
      throw new Error(`UPDATE requires values`);
    }

    const keys = Object.keys(
      this.definition.updateValues
    ) as (keyof TableRef['columns'])[];
    const updateParams = keys.map((key) => this.definition.updateValues![key]);

    if (this.definition.params) {
      this.definition.params = [...updateParams, ...this.definition.params];
    } else {
      this.definition.params = updateParams;
    }

    return `UPDATE ${this.table.name} SET ${keys.map((key) => `${key as string} = ?`.trim()).join(', ')}`;
  }

  private addJoin<
    JoinTable extends Table<string, Record<string, Column>>,
    JoinAlias extends string,
    BaseColName extends keyof TableRef['columns'],
    JoinColName extends keyof JoinTable['columns'],
  >(
    joinType: AcceptedJoin,
    joinTable: JoinTable,
    baseColumn: BaseColName,
    joinColumn: JoinColName,
    alias: JoinAlias
  ) {
    if (!this.definition.joins) this.definition.joins = [];

    this.definition.joins.push(
      `${joinType} JOIN ${joinTable.name} AS ${alias} ON ${this.definition.baseAlias}.${String(
        baseColumn
      )} = ${alias}.${String(joinColumn)}`
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
    BaseColName extends keyof TableRef['columns'],
    JoinColName extends keyof JoinTable['columns'],
  >(
    joinTable: JoinTable,
    baseColumn: BaseColName,
    joinColumn: JoinColName,
    alias: JoinAlias
  ) {
    return this.addJoin(
      AcceptedJoinValue.LEFT,
      joinTable,
      baseColumn,
      joinColumn,
      alias
    );
  }

  public rightJoin<
    JoinTable extends Table<string, Record<string, Column>>,
    JoinAlias extends string,
    BaseColName extends keyof TableRef['columns'],
    JoinColName extends keyof JoinTable['columns'],
  >(
    joinTable: JoinTable,
    baseColumn: BaseColName,
    joinColumn: JoinColName,
    alias: JoinAlias
  ) {
    return this.addJoin(
      AcceptedJoinValue.RIGHT,
      joinTable,
      baseColumn,
      joinColumn,
      alias
    );
  }

  public innerJoin<
    JoinTable extends Table<string, Record<string, Column>>,
    JoinAlias extends string,
    BaseColName extends keyof TableRef['columns'],
    JoinColName extends keyof JoinTable['columns'],
  >(
    joinTable: JoinTable,
    baseColumn: BaseColName,
    joinColumn: JoinColName,
    alias: JoinAlias
  ) {
    return this.addJoin(
      AcceptedJoinValue.INNER,
      joinTable,
      baseColumn,
      joinColumn,
      alias
    );
  }

  public naturalJoin<
    JoinTable extends Table<string, Record<string, Column>>,
    JoinAlias extends string,
    BaseColName extends keyof TableRef['columns'],
    JoinColName extends keyof JoinTable['columns'],
  >(
    joinTable: JoinTable,
    baseColumn: BaseColName,
    joinColumn: JoinColName,
    alias: JoinAlias
  ) {
    return this.addJoin(
      AcceptedJoinValue.NATURAL,
      joinTable,
      baseColumn,
      joinColumn,
      alias
    );
  }

  public toQuery() {
    let sql = '';

    switch (this.definition.queryType) {
      case QueryTypeValue.SELECT:
        sql = this.buildSelectQuery();
        break;

      case QueryTypeValue.INSERT:
        sql = this.buildInsertQuery();
        break;

      case QueryTypeValue.UPDATE:
        sql = this.buildUpdateQuery();
        break;

      case QueryTypeValue.DELETE:
        sql = `DELETE FROM ${this.table.name}`;
        break;

      default:
        throw new Error('No query type defined');
    }

    if (this.definition.joins?.length) {
      sql += ` ${this.definition.joins.join(' ')}`;
    }

    if (this.definition.where?.length) {
      sql += ` WHERE ${this.definition.where.join(' ')}`;
    }

    if (this.definition.groupBy?.length) {
      sql += ' GROUP BY';

      const placeholders = this.definition.groupBy.map(() => '?').join(', ');

      const params = this.definition.groupBy.map((group) => group);

      sql += ` ${placeholders}`;

      if (!this.definition.params) this.definition.params = [];

      this.definition.params.push(...params);
    }

    if (this.definition.having?.length) {
      sql += ` HAVING ${this.definition.having.join(' ')}`;
    }

    if (this.definition.orderBy && this.definition.orderBy.length) {
      sql += ' ORDER BY';

      const placeholders = this.definition.orderBy.map(() => '? ?').join(', ');

      const params = this.definition.orderBy
        .map((order) => [order.column, order.direction])
        .flat(1);

      sql += ` ${placeholders}`;

      if (!this.definition.params) this.definition.params = [];

      this.definition.params.push(...params);
    }

    if (this.definition.limit !== null) {
      sql += ` LIMIT ?`;

      if (!this.definition.params) this.definition.params = [];

      this.definition.params.push(this.definition.limit);
    }

    if (this.definition.offset !== null) {
      sql += ` OFFSET ?`;

      if (!this.definition.params) this.definition.params = [];

      this.definition.params.push(this.definition.offset);
    }

    return { query: sql + ';', params: this.definition.params };
  }

  public toString() {
    return this.toQuery().query;
  }
}
