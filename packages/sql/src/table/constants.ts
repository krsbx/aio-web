export const Dialect = {
  POSTGRES: 'postgres',
  MYSQL: 'mysql',
  SQLITE: 'sqlite',
} as const;

export type Dialect = (typeof Dialect)[keyof typeof Dialect];
