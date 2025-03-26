/* eslint-disable @typescript-eslint/no-explicit-any */
import { Database } from 'bun:sqlite';
import type { Item, KeyValueConfig, RawItem, RawKey } from './type';
import { getSql } from './sql';

export class KeyValue {
  public readonly filepath: string;
  public readonly db: Database;
  public readonly ttl: number;
  private readonly sql: ReturnType<typeof getSql>;

  private constructor(options: KeyValueConfig) {
    this.filepath = options.filepath;
    this.db = new Database(this.filepath);
    this.ttl = options.ttl || 3;
    this.sql = getSql(this.db);

    this.setup();
  }

  private setup() {
    this.db.run('PRAGMA journal_mode = WAL');
    this.db.run('PRAGMA synchronous = NORMAL');
    this.db.run('PRAGMA temp_store = MEMORY');
    this.db.run('PRAGMA cache_size = -64000');

    // KV Store
    this.db.run(`
    CREATE TABLE IF NOT EXISTS kv_store (
      key TEXT PRIMARY KEY,
      value BLOB,
      ttl INTEGER
    ) STRICT;
    `);

    // KV Index
    this.db.run(`CREATE INDEX IF NOT EXISTS kv_store_key ON kv_store (key);`);
    this.db.run(`CREATE INDEX IF NOT EXISTS kv_store_ttl ON kv_store (ttl);`);

    // KV Tags
    // this.db.run(`
    // CREATE TABLE IF NOT EXISTS kv_tags (
    //   tag TEXT,
    //   key TEXT,
    //   PRIMARY KEY (key, tag),
    //   FOREIGN KEY (key) REFERENCES kv_store(key) ON DELETE CASCADE
    // ) STRICT;
    // `);

    // KV Tags Index
    // this.db.run(`CREATE INDEX IF NOT EXISTS kv_tags_tag ON kv_tags (tag);`);
  }

  private compress<Value = any>(value: Value): Uint8Array {
    const stringified = JSON.stringify(value);
    const buffer = Buffer.from(stringified);
    const compressed = Bun.deflateSync(buffer);

    return compressed;
  }

  private decompress<Value = any>(buffer: Uint8Array): Value {
    const decompressed = Bun.inflateSync(buffer).toString();

    return JSON.parse(decompressed);
  }

  public setItem<Value = any>(
    key: string,
    value: Value,
    ttl: number | null = this.ttl
  ) {
    this.sql.set.run({
      key,
      value: this.compress(value),
      ttl: ttl ? Math.floor(Date.now() / 1000) + ttl : null,
    });

    return this;
  }

  public setItems<
    Value,
    Values extends { key: string; value: Value; ttl?: number | null },
  >(...items: Values[]) {
    this.db.transaction(() => {
      items.forEach((item) => {
        this.setItem(item.key, item.value, item.ttl);
      });
    })();

    return this;
  }

  public getItem<Value = any>(key: string): Value | null {
    const now = Math.floor(Date.now() / 1000);
    const data = this.sql.getItem.get({
      key,
    });

    if (!data || !data.value) return null;

    if (data.ttl && data.ttl < now) {
      this.sql.delete.run({ key });

      return null;
    }

    return this.decompress(data.value);
  }

  private getRawItems(): RawItem[];
  private getRawItems(key: string): RawItem[];
  private getRawItems(keys: string[]): RawItem[];
  private getRawItems(key: string | string[] | null = null): RawItem[] {
    let results: RawItem[] = [];

    if (Array.isArray(key)) {
      this.db.transaction(() =>
        key.forEach((key) => {
          const result = this.sql.getItem.get(key);

          if (!result) return;

          results.push({
            ...result,
            key,
          });
        })
      )();
    } else if (typeof key === 'string') {
      results = this.sql.getItemsLike.all({
        key: `${key}%`,
      });
    } else {
      results = this.sql.getItems.all();
    }

    return results;
  }

  public getItems<Value = any>(): Item<Value>[];
  public getItems<Value = any>(key: string): Item<Value>[];
  public getItems<Value = any>(keys: string[]): Item<Value>[];
  public getItems<Value = any>(
    key: string | string[] | null = null
  ): Item<Value>[] {
    const now = Date.now();
    const records: RawItem[] = this.getRawItems(key as any);
    const expires: string[] = [];

    if (!records.length) return [];

    const results: Item<Value>[] = [];

    for (const record of records) {
      if (!record.ttl) {
        results.push({
          key: record.key,
          value: this.decompress(record.value),
        });
        continue;
      }

      if (record.ttl < now) {
        expires.push(record.key);
        continue;
      }

      results.push({
        key: record.key,
        value: this.decompress(record.value),
      });
    }

    if (expires.length) {
      this.delete(...expires);
    }

    return results;
  }

  public has(key: string) {
    const item = this.sql.getItem.get({ key });

    if (!item) return false;

    if (item.ttl && item.ttl < Date.now()) {
      this.delete(key);
      return false;
    }

    return true;
  }

  public getCount() {
    return this.sql.count.get()!.count;
  }

  public get count() {
    return this.getCount();
  }

  public get length() {
    return this.count;
  }

  public get items() {
    return this.getItems();
  }

  public getCountValid() {
    return this.sql.countValid.get({ now: Date.now() })!.count;
  }

  public getCountExpiring() {
    return this.sql.countExpiring.get()!.count;
  }

  public getCountExpired() {
    return this.sql.countExpired.get({ now: Date.now() })!.count;
  }

  private getRawKeys(): RawKey[];
  private getRawKeys(key: string): RawKey[];
  private getRawKeys(key?: string) {
    let records: { key: string; ttl: number | null }[] = [];

    if (key) {
      records = this.sql.keysLike.all({
        key: `${key}%`,
      });
    } else {
      records = this.sql.keys.all();
    }

    return records;
  }

  public getKeys(): string[];
  public getKeys(key: string): string[];
  public getKeys(key?: string) {
    const now = Date.now();
    const expires: string[] = [];

    const records = this.getRawKeys(key as any);

    const results: string[] = [];

    for (const record of records) {
      if (!record.ttl) {
        results.push(record.key);
        continue;
      }

      if (record.ttl < now) {
        expires.push(record.key);
        continue;
      }

      results.push(record.key);
    }

    if (expires.length) {
      this.delete(...expires);
    }

    return results;
  }

  public get keys() {
    return this.getKeys();
  }

  public delete<Keys extends string[]>(...keys: Keys) {
    this.db.transaction(() => {
      keys.forEach((key) => {
        this.sql.delete.run({ key });
      });
    })();

    return this;
  }

  public clear() {
    this.sql.clear.run();

    return this;
  }

  public deleteExpired() {
    this.sql.deleteExpired.run({ now: Date.now() });

    return this;
  }

  public setTtl(key: string, ttl: number | null = this.ttl) {
    this.sql.setExpired.run({
      key,
      ttl: ttl ? Math.floor(Date.now() / 1000) + ttl : null,
    });

    return this;
  }

  public getTtl(key: string) {
    const now = Date.now();
    const row = this.sql.expired.get({ key });

    if (!row || !row.ttl) return null;

    if (row.ttl < now) {
      this.delete(key);

      return null;
    }

    return row.ttl - now;
  }

  // public addTag(key: string, tag: string) {
  //   this.sql.addTag.run({ key, tag });

  //   return this;
  // }

  // public deleteTag(key: string, tag: string) {
  //   this.sql.deleteTag.run({ key, tag });

  //   return this;
  // }

  // public deleteTags(key: string): KeyValue;
  // public deleteTags(key: string, tags: string[]): KeyValue;
  // public deleteTags(key: string, tags?: string[]) {
  //   if (tags) {
  //     this.db.transaction(() => {
  //       tags.forEach((tag) => {
  //         this.deleteTag(key, tag);
  //       });
  //     })();
  //   } else {
  //     this.sql.deleteTags.run({ key });
  //   }

  //   return this;
  // }

  // public deleteTaggedItems(tag: string) {
  //   this.sql.deleteTaggedItems.run({ tag });

  //   return this;
  // }

  // public getTaggedKeys(tag: string) {
  //   const rows = this.sql.keyTags.all({ tag });

  //   return rows.map((row) => row.key);
  // }

  // public getTaggedValues<Value = any>(tag: string): Value[] {
  //   return this.db.transaction(() => {
  //     const keys = this.getTaggedKeys(tag);

  //     return keys
  //       .map((key) => this.getItems<Value>(key))
  //       .map((item) => item.map((i) => i.value))
  //       .flat(1);
  //   })();
  // }

  public static define(options: KeyValueConfig) {
    return new KeyValue(options);
  }
}
