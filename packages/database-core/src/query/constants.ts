export const LogicalOperator = {
  AND: 'AND',
  OR: 'OR',
} as const;

export const ConditionClause = {
  WHERE: 'WHERE',
  HAVING: 'HAVING',
} as const;

export const AcceptedOperator = {
  EQ: 'eq',
  NE: 'ne',
  GT: 'gt',
  LT: 'lt',
  GTE: 'gte',
  LTE: 'lte',
  IN: 'in',
  NOT_IN: 'notIn',
  LIKE: 'like',
  IS_NULL: 'isNull',
  IS_NOT_NULL: 'isNotNull',
  BETWEEN: 'between',
  NOT_BETWEEN: 'notBetween',
} as const;

export const QueryType = {
  SELECT: 'SELECT',
  INSERT: 'INSERT',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
} as const;

export const OrderBy = {
  ASC: 'ASC',
  DESC: 'DESC',
} as const;

export const AggregationFunction = {
  COUNT: 'COUNT',
  SUM: 'SUM',
  MIN: 'MIN',
  MAX: 'MAX',
  AVG: 'AVG',
} as const;
