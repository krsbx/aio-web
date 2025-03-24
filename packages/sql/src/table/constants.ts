export const Dialect = {
  POSTGRES: 'postgres',
  SQLITE: 'sqlite',
} as const;

export type Dialect = (typeof Dialect)[keyof typeof Dialect];
