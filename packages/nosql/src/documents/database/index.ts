import type { Document } from '../document';
import type { Field } from '../field';
import type { QueryBuilder } from '../query';
import type { QueryHooksType } from '../query/constants';
import type { QuerHooks, QueryRunHooks } from '../query/types';
import type { DatabaseDialect, DatabaseOptions } from './types';
import { DatabaseSqlite } from './wrapper';

export class Database<
  Docs extends Record<string, Document<string, Record<string, Field>>>,
> {
  public readonly hooks: Partial<QuerHooks>;
  public readonly docs: Docs;
  public readonly filename: string;
  public readonly client: DatabaseDialect;

  protected constructor(options: DatabaseOptions<Docs>) {
    this.hooks = {};
    this.docs = options.docs;
    this.filename = options.filename;
    this.client = new DatabaseSqlite(options);

    for (const doc of Object.values(this.docs)) {
      // Re-assign the database objects
      doc.client = this.client;
    }

    // Create database
    this.client.exec({
      sql: `
    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      collection TEXT NOT NULL,
      data JSON
    );
    `,
    });

    // Create FTS5
    this.client.exec({
      sql: `
    CREATE VIRTUAL TABLE IF NOT EXISTS documents_fts USING fts5(
      id, collection, content
    );
    `,
    });
  }

  public document<
    DocName extends keyof Docs & string,
    Doc extends Docs[DocName],
  >(docName: DocName) {
    if (!this.docs[docName]) {
      throw new Error(`Document ${docName as string} does not exist`);
    }

    const doc = this.docs[docName];
    const query = doc.query();

    // Bind the hooks from the database class to the query
    query.hooks.before = this.hooks.before;
    query.hooks.after = this.hooks.after;

    // Fix the type
    return query as unknown as QueryBuilder<DocName, Doc>;
  }

  public addHook(type: QueryHooksType, fn: QueryRunHooks) {
    if (!this.hooks[type]) {
      this.hooks[type] = new Set();
    }

    this.hooks[type].add(fn);

    return this;
  }

  public removeHook(type: QueryHooksType, fn: QueryRunHooks) {
    if (this.hooks[type]) {
      this.hooks[type].delete(fn);
    }

    return this;
  }

  public async transaction<T, U extends () => Promise<T>>(fn: U) {
    return this.client.transaction(fn);
  }

  public static define<
    Docs extends Record<string, Document<string, Record<string, Field>>>,
  >(options: DatabaseOptions<Docs>) {
    return new Database(options);
  }
}
