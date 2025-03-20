import type { Column } from '../column';
import type { Table } from '../table';
import {
  AcceptedOperator as AcceptedOperatorValue,
  AggregationFunction as AggregationFunctionValue,
  ConditionClause as ConditionClauseValue,
  LogicalOperator as LogicalOperatorValue,
  QueryType as QueryTypeValue,
} from './constants';
import type {
  AcceptedInsertValues,
  AcceptedOperator,
  AcceptedOrderBy,
  AcceptedUpdateValues,
  AggregationFunction,
  ConditionClause,
  LogicalOperator,
  QueryType,
  WhereValue,
} from './types';
import { getCondition } from './utilities';

export interface QueryDefinition<Columns extends Record<string, Column>> {
  queryType: QueryType | null;
  select: (keyof Columns)[] | null;
  where: string[] | null;
  having: string[] | null;
  params: unknown[] | null;
  limit: number | null;
  offset: number | null;
  groupBy: (keyof Columns)[] | null;
  insertValues: AcceptedInsertValues<Columns> | null;
  updateValues: AcceptedUpdateValues<Columns> | null;
  orderBy: AcceptedOrderBy<Columns> | null;
  aggregate: {
    column: keyof Columns;
    fn: AggregationFunction;
  } | null;
}

export class QueryBuilder<
  TableRef extends Table<string, Record<string, Column>>,
  Definition extends Partial<QueryDefinition<TableRef['columns']>> = object,
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
    } as Definition;
  }

  private addCondition<
    Clause extends ConditionClause,
    ColName extends keyof TableRef['columns'],
    Col extends TableRef['columns'][ColName],
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
    ColName extends keyof TableRef['columns'],
    Col extends TableRef['columns'][ColName],
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
    ColName extends keyof TableRef['columns'],
    Col extends TableRef['columns'][ColName],
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
    ColName extends keyof TableRef['columns'],
    Col extends TableRef['columns'][ColName],
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
    ColName extends keyof TableRef['columns'],
    Col extends TableRef['columns'][ColName],
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

  public aggregate<
    ColName extends keyof TableRef['columns'],
    Fn extends AggregationFunction,
  >(column: ColName, fn: Fn) {
    this.definition.aggregate = {
      column,
      fn,
    };

    return this as unknown as QueryBuilder<
      TableRef,
      Definition & { aggregate: { column: ColName; fn: Fn } }
    >;
  }

  public count<ColName extends keyof TableRef['columns']>(column: ColName) {
    return this.aggregate(column, AggregationFunctionValue.COUNT);
  }

  public sum<ColName extends keyof TableRef['columns']>(column: ColName) {
    return this.aggregate(column, AggregationFunctionValue.SUM);
  }

  public min<ColName extends keyof TableRef['columns']>(column: ColName) {
    return this.aggregate(column, AggregationFunctionValue.MIN);
  }

  public max<ColName extends keyof TableRef['columns']>(column: ColName) {
    return this.aggregate(column, AggregationFunctionValue.MAX);
  }

  public avg<ColName extends keyof TableRef['columns']>(column: ColName) {
    return this.aggregate(column, AggregationFunctionValue.AVG);
  }

  public groupBy<Columns extends (keyof TableRef['columns'])[]>(
    columns: Columns
  ) {
    this.definition.groupBy = columns;

    return this as unknown as QueryBuilder<
      TableRef,
      Definition & { groupBy: Columns }
    >;
  }

  public limit<Limit extends number | null>(limit: Limit) {
    this.definition.limit = limit;

    return this as unknown as QueryBuilder<
      TableRef,
      Definition & { limit: Limit }
    >;
  }

  public offset<Offset extends number | null>(offset: Offset) {
    this.definition.offset = offset;

    return this as unknown as QueryBuilder<
      TableRef,
      Definition & { offset: Offset }
    >;
  }

  public orderBy<OrderBy extends AcceptedOrderBy<TableRef['columns']>>(
    orderBy: OrderBy
  ) {
    if (!this.definition.orderBy) this.definition.orderBy = {};

    this.definition.orderBy = {
      ...this.definition.orderBy,
      ...orderBy,
    };

    return this as unknown as QueryBuilder<
      TableRef,
      Definition & { orderBy: OrderBy }
    >;
  }

  public select<Columns extends (keyof TableRef['columns'])[]>(
    columns: Columns
  ) {
    this.definition.select = columns;
    this.definition.queryType = QueryTypeValue.SELECT;

    return this as unknown as QueryBuilder<
      TableRef,
      Definition & { queryType: typeof QueryTypeValue.SELECT; select: Columns }
    >;
  }

  public insert<
    Columns extends TableRef['columns'],
    Values extends {
      [ColName in keyof Columns]?: ReturnType<Columns[ColName]['infer']>;
    }[],
  >(values: Values) {
    this.definition.queryType = QueryTypeValue.INSERT;
    this.definition.insertValues = values;

    return this as unknown as QueryBuilder<
      TableRef,
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
      TableRef,
      Definition & { queryType: typeof QueryTypeValue.UPDATE }
    >;
  }

  public delete() {
    this.definition.queryType = QueryTypeValue.DELETE;

    return this as unknown as QueryBuilder<
      TableRef,
      Definition & { queryType: typeof QueryTypeValue.DELETE }
    >;
  }

  private buildSelectQuery() {
    if (this.definition.aggregate) {
      return `SELECT ${this.definition.aggregate.fn}(${this.definition.aggregate.column as string}) FROM ${this.table.name}`;
    }

    const columns =
      !this.definition.select || !this.definition.select.length
        ? '*'
        : this.definition.select.join(', ');

    return `SELECT ${columns} FROM ${this.table.name}`;
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

    if (this.definition.where?.length) {
      sql += ` WHERE ${this.definition.where.join(' ')}`;
    }

    if (this.definition.groupBy?.length) {
      sql += ` GROUP BY ${this.definition.groupBy.join(', ')}`;
    }

    if (this.definition.having?.length) {
      sql += ` HAVING ${this.definition.having.join(' ')}`;
    }

    if (this.definition.orderBy) {
      sql += ` ORDER BY ${this.definition.orderBy}`;
    }

    if (this.definition.limit !== null) {
      sql += ` LIMIT ${this.definition.limit}`;
    }

    if (this.definition.offset !== null) {
      sql += ` OFFSET ${this.definition.offset}`;
    }

    return { query: sql + ';', params: this.definition.params };
  }

  public toString() {
    return this.toQuery().query;
  }
}
