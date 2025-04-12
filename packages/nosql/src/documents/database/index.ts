import type { Documents } from '../documents';
import type { Field } from '../fields';
import type { QueryBuilder } from '../query';
import type { DatabaseDialect, DatabaseOptions } from './types';
import { DatabaseSqlite } from './wrapper';

export class Database<
  Docs extends Record<string, Documents<string, Record<string, Field>>>,
> {
  public readonly docs: Docs;
  public readonly filename: string;
  public readonly client: DatabaseDialect;

  protected constructor(options: DatabaseOptions<Docs>) {
    this.docs = options.docs;
    this.filename = options.filename;
    this.client = new DatabaseSqlite(options);

    for (const doc of Object.values(this.docs)) {
      // Re-assign the database objects
      doc.database = this.client;
    }

    // Create database
    this.client.exec(`
    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      collection TEXT NOT NULL,
      data JSON
    );
    `);

    // Create FTS5
    this.client.exec(`
    CREATE VIRTUAL TABLE IF NOT EXISTS documents_fts USING fts5(
      id, collection, content
    );
    `);
  }

  public document<
    DocName extends keyof Docs & string,
    Doc extends Docs[DocName],
  >(docName: DocName) {
    if (!this.docs[docName]) {
      throw new Error(`Document ${docName as string} does not exist`);
    }

    const doc = this.docs[docName];

    return doc.query() as unknown as QueryBuilder<DocName, Doc>;
  }

  public static define<
    Docs extends Record<string, Documents<string, Record<string, Field>>>,
  >(options: DatabaseOptions<Docs>) {
    return new Database(options);
  }
}
