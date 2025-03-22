import type { Column } from '../column';
import type { Table } from '../table';
import { deepClone } from '../utilities';
import {
  AcceptedJoin,
  AcceptedOperator,
  AggregationFunction,
  ConditionClause,
  LogicalOperator,
  QueryType,
} from './constants';
import type {
  AcceptedInsertValues,
  AcceptedOrderBy,
  AcceptedUpdateValues,
  AliasedColumn,
  ColumnSelector,
  QueryDefinition,
  RawColumn,
  WhereValue,
} from './types';
import { getCondition } from './utilities';

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
      Omit<Definition, 'baseAlias'> & { baseAlias: NewAlias }
    >;
  }

  public col<ColName extends AllowedColumn, ColAlias extends string>(
    column: ColName,
    alias: ColAlias
  ) {
    return {
      column,
      as: alias,
    } as const;
  }

  public rawCol<ColName extends AllowedColumn>(column: ColName) {
    return column;
  }

  private addRawCondition<
    Clause extends ConditionClause,
    Logical extends LogicalOperator,
  >(
    clause: Clause,
    column: (col: this['rawCol']) => string,
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
    column: (col: this['rawCol']) => string,
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
    column: (col: this['rawCol']) => string,
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
    column: (col: this['rawCol']) => string,
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
    column: (col: this['rawCol']) => string,
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
      operator === AcceptedOperator.IS_NULL ||
      operator === AcceptedOperator.IS_NOT_NULL
    ) {
      return this as unknown as QueryBuilder<
        Alias,
        TableRef,
        JoinedTables,
        Definition & { [Key in typeof validClause]: string[] }
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
      Definition & {
        [Key in typeof validClause]: string[];
      } & {
        params: unknown[];
      }
    >;
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
    return this.addCondition(
      ConditionClause.WHERE,
      column,
      operator,
      value,
      LogicalOperator.AND
    );
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
    return this.addCondition(
      ConditionClause.HAVING,
      column,
      operator,
      value,
      LogicalOperator.AND
    );
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
    return this.addCondition(
      ConditionClause.WHERE,
      column,
      operator,
      value,
      LogicalOperator.AND
    );
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
      AcceptedJoin.LEFT,
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
      AcceptedJoin.RIGHT,
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
      AcceptedJoin.INNER,
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
      AcceptedJoin.NATURAL,
      joinTable,
      baseColumn,
      joinColumn,
      alias
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
    ColName extends AllowedColumn,
    Fn extends AggregationFunction,
  >(column: ColName, fn: Fn) {
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
    return this.aggregate(column, AggregationFunction.COUNT);
  }

  public sum<ColName extends AllowedColumn>(column: ColName) {
    return this.aggregate(column, AggregationFunction.SUM);
  }

  public min<ColName extends AllowedColumn>(column: ColName) {
    return this.aggregate(column, AggregationFunction.MIN);
  }

  public max<ColName extends AllowedColumn>(column: ColName) {
    return this.aggregate(column, AggregationFunction.MAX);
  }

  public avg<ColName extends AllowedColumn>(column: ColName) {
    return this.aggregate(column, AggregationFunction.AVG);
  }

  public groupBy<
    Groupable extends NonNullable<Definition['select']>,
    Columns extends Groupable extends readonly (infer Col)[]
      ? Col extends RawColumn<AllowedColumn>
        ? Col[]
        : Col extends AliasedColumn<AllowedColumn, infer Alias>
          ? Alias[]
          : AllowedColumn[]
      : AllowedColumn[],
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
      select: Array<`${Base}.${keyof Columns & string}`>;
    }
  >;
  public select<
    Columns extends Array<
      | RawColumn<AllowedColumn>
      | ((col: this['col']) => AliasedColumn<AllowedColumn, string>)
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
        (colName) => `${base}.${colName}`
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
    this.definition.queryType = QueryType.DELETE;

    return this as unknown as QueryBuilder<
      Alias,
      TableRef,
      JoinedTables,
      Omit<Definition, 'queryType'> & { queryType: typeof QueryType.DELETE }
    >;
  }

  private buildSelectQuery() {
    const from = this.definition.baseAlias
      ? `${this.table.name} AS ${this.definition.baseAlias}`
      : this.table.name;

    if (this.definition?.aggregate) {
      return `SELECT ${this.definition.aggregate.fn}(${this.definition.aggregate.column}) FROM ${from}`;
    }

    let columns = '*';

    if (this.definition?.select?.length) {
      columns = this.definition.select
        .map((col) => {
          if (typeof col === 'object') {
            return `${col.column} AS ${col.as}`;
          }

          return col;
        })
        .join(', ');
    }

    const distinct = this.definition.distinct ? 'DISTINCT ' : '';

    return `SELECT ${distinct}${columns} FROM ${from}`;
  }

  private buildInsertQuery() {
    const rows = this.definition?.insertValues;

    if (!rows?.length) {
      throw new Error(`INSERT requires values`);
    }

    const keys = Object.keys(rows[0]);
    const columns = keys.join(', ');
    const rowPlaceholders = `(${keys.map(() => '?').join(', ')})`;
    const placeholders = rows.map(() => rowPlaceholders).join(', ');

    this.definition.params = rows.flatMap((row) =>
      keys.map((key) => (row as TableRef['columns'])[key])
    );

    return `INSERT INTO ${this.table.name} (${columns}) VALUES ${placeholders}`;
  }

  private buildUpdateQuery() {
    if (!this.definition?.updateValues?.length) {
      throw new Error(`UPDATE requires values`);
    }

    const keys = Object.keys(
      this.definition.updateValues
    ) as (keyof TableRef['columns'])[];
    const updateParams = keys.map((key) => this.definition.updateValues![key]);

    if (this.definition?.params) {
      this.definition.params = [...updateParams, ...this.definition.params];
    } else {
      this.definition.params = updateParams;
    }

    return `UPDATE ${this.table.name} SET ${keys.map((key) => `${key as string} = ?`.trim()).join(', ')}`;
  }

  private buildDeleteQuery() {
    return `DELETE FROM ${this.table.name}`;
  }

  public toQuery() {
    let sql = '';

    switch (this.definition.queryType) {
      case QueryType.SELECT:
        sql = this.buildSelectQuery();
        break;

      case QueryType.INSERT:
        sql = this.buildInsertQuery();
        break;

      case QueryType.UPDATE:
        sql = this.buildUpdateQuery();
        break;

      case QueryType.DELETE:
        sql = this.buildDeleteQuery();
        break;

      default:
        throw new Error('No query type defined');
    }

    if (this.definition?.joins?.length) {
      sql += ` ${this.definition.joins.join(' ')}`;
    }

    if (this.definition?.where?.length) {
      sql += ` WHERE ${this.definition.where.join(' ')}`;
    }

    if (this.definition?.groupBy?.length) {
      sql += ' GROUP BY';

      const placeholders = this.definition.groupBy.map(() => '?').join(', ');

      const params = this.definition.groupBy.map((group) => group);

      sql += ` ${placeholders}`;

      if (!this.definition.params) this.definition.params = [];

      this.definition.params.push(...params);
    }

    if (this.definition?.having?.length) {
      sql += ` HAVING ${this.definition.having.join(' ')}`;
    }

    if (this.definition?.orderBy?.length) {
      sql += ' ORDER BY';

      const placeholders = this.definition.orderBy.map(() => '? ?').join(', ');

      const params = this.definition.orderBy
        .map((order) => [order.column, order.direction])
        .flat(1);

      sql += ` ${placeholders}`;

      if (!this.definition.params) this.definition.params = [];

      this.definition.params.push(...params);
    }

    if (this.definition?.limit !== null) {
      sql += ` LIMIT ?`;

      if (!this.definition.params) this.definition.params = [];

      this.definition.params.push(this.definition.limit);
    }

    if (this.definition?.offset !== null) {
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
