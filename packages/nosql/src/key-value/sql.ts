import { Database, Statement } from 'bun:sqlite';

export function getSql(db: Database) {
  return {
    set: db.query(
      `INSERT OR REPLACE INTO kv_store (key, value, ttl) VALUES ($key, $value, $ttl);`
    ) as Statement,
    getItem: db.query(
      `SELECT value, ttl FROM kv_store WHERE key = $key;`
    ) as Statement<{ value: Uint8Array; ttl: number | null }>,
    getItems: db.query(`SELECT key, value, ttl FROM kv_store;`) as Statement<{
      key: string;
      value: Uint8Array;
      ttl: number | null;
    }>,
    getItemsLike: db.query(
      `SELECT key, value, ttl FROM kv_store WHERE key LIKE $key;`
    ) as Statement<{
      key: string;
      value: Uint8Array;
      ttl: number | null;
    }>,
    delete: db.query(`DELETE FROM kv_store WHERE key = $key;`) as Statement,

    keys: db.query(`SELECT key, ttl FROM kv_store;`) as Statement<{
      key: string;
      ttl: number | null;
    }>,
    keysLike: db.query(
      `SELECT key, ttl FROM kv_store WHERE key LIKE $key;`
    ) as Statement<{
      key: string;
      ttl: number | null;
    }>,

    setExpired: db.query(
      `UPDATE kv_store SET ttl = $ttl WHERE key = $key;`
    ) as Statement,
    expired: db.query(
      `SELECT ttl FROM kv_store WHERE ttl < $now;`
    ) as Statement<{
      ttl: number;
    }>,
    deleteExpired: db.query(
      `DELETE FROM kv_store WHERE ttl < $now;`
    ) as Statement,
    clear: db.query(`DELETE FROM kv_store;`) as Statement,

    count: db.query(`SELECT COUNT(*) AS count FROM kv_store;`) as Statement<{
      count: number;
    }>,
    countValid: db.query(
      `SELECT COUNT(*) AS count FROM kv_store WHERE ttl IS NULL OR ttl > $now;`
    ) as Statement<{
      count: number;
    }>,
    countExpired: db.query(
      `SELECT COUNT(*) AS count FROM kv_store WHERE ttl < $now;`
    ) as Statement<{
      count: number;
    }>,
    countExpiring: db.query(
      `SELECT COUNT(*) AS count FROM kv_store WHERE IS NOT NULL;`
    ) as Statement<{ count: number }>,

    // addTag: db.query(
    //   `INSERT OR IGNORE INTO kv_tags (key, tag) VALUES ($key, $tag);`
    // ) as Statement,
    // deleteTag: db.query(
    //   `DELETE FROM kv_tags WHERE tag = $tag AND key = $key;`
    // ) as Statement,
    // deleteTags: db.query(`DELETE from kv_tags WHERE key = $key;`) as Statement,
    // deleteTaggedItems: db.query(
    //   `DELETE FROM kv_store WHERE key IN (SELECT key FROM kv_tags WHERE tag = $tag)`
    // ) as Statement,

    // keyTags: db.query(
    //   `SELECT key FROM kv_tags WHERE tag = $tag;`
    // ) as Statement<{
    //   key: string;
    // }>,
  };
}
