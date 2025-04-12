import type { Document } from '../document';
import type { Field } from '../field';

export interface SqliteConfig {
  filename: string;
}

export interface DatabaseOptions<
  Docs extends Record<string, Document<string, Record<string, Field>>>,
> extends SqliteConfig {
  docs: Docs;
}

export interface DatabaseDialect {
  status: 'connecting' | 'connected' | 'disconnected';

  connect(): Promise<this>;
  disconnect(): Promise<this>;

  exec<T>(sql: string): Promise<T>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  exec<T>(sql: string, params: any): Promise<T>;

  transaction<T, U extends () => Promise<T>>(fn: U): Promise<T>;
}
