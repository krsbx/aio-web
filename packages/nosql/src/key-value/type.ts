export interface KeyValueConfig {
  filepath: string;
  /**
   * @default to 3s
   */
  ttl?: number;
}

export interface Item<Value> {
  key: string;
  value: Value;
}

export interface RawItem {
  key: string;
  value: Uint8Array;
  ttl: number | null;
}

export interface RawKey {
  key: string;
  ttl: number | null;
}
