import { Dialect } from '../../table/constants';
import type { PostgresConfig } from '../types';

export const AcceptedSqlDialects = {
  [Dialect.POSTGRES]: Dialect.POSTGRES,
  [Dialect.MYSQL]: Dialect.MYSQL,
} as const;

export type AcceptedSqlDialects = keyof typeof AcceptedSqlDialects;

export type AcceptedSqlConfig = {
  [Dialect.POSTGRES]: PostgresConfig;
  [Dialect.MYSQL]: PostgresConfig;
};
