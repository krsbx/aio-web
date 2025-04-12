import {
  Documents as Document,
  Field,
  Database as NoSqlDb,
} from '@ignisia/nosql';
import { SecureNoSqlDb, SecureSqlDb } from '@ignisia/securedb';
import { Column, Database as SqlDb, Table } from '@ignisia/sql';
import type { ReplicaInstanceType } from './constants';

type Tables = Table<string, Record<string, Column>, 'sqlite'>;
type Documents = Document<string, Record<string, Field>>;

export type AcceptedPrimaryInstance =
  | SqlDb<'sqlite', Record<string, Tables>>
  | NoSqlDb<Record<string, Documents>>
  | SecureSqlDb<'sqlite', Record<string, Tables>>
  | SecureNoSqlDb<Record<string, Documents>>;

export type ReplicaInstanceMap = {
  [K in ReplicaInstanceType]: K extends typeof ReplicaInstanceType.FILE
    ? AcceptedPrimaryInstance
    : K extends typeof ReplicaInstanceType.SOCKET
      ? WebSocket
      : never;
};
