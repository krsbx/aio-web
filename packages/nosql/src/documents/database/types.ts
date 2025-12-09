import type { TransactionSQL } from 'bun';
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

export interface DatabaseExecOptions {
  sql: string;
  params?: unknown[] | null | undefined;
  tx?: TransactionSQL | null;
}

export interface DatabaseDialect {
  status: 'connecting' | 'connected' | 'disconnected';

  connect(): Promise<this>;
  disconnect(): Promise<this>;

  exec<T>(options: DatabaseExecOptions): Promise<T>;

  transaction<T, U extends (tx: TransactionSQL) => Promise<T>>(
    fn: U
  ): Promise<T>;
}
