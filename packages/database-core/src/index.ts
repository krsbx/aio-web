import { Column } from './column';

export function defineTable<T extends string, U extends Record<string, Column>>(
  name: T,
  table: U
) {
  return {
    name,
    table,
  };
}
