import { Document, Field, Database as NoSqlDb } from '@ignisia/nosql';
import { SecureNoSqlDb, SecureSqlDb } from '@ignisia/securedb';
import { Column, Database as SqlDb, Table } from '@ignisia/sql';
import type { ServerWebSocket } from 'bun';
import type { ReplicaInstanceType } from './constants';
import type { QueryRunHooksOptions } from './primary/types';

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
      ? ServerWebSocket
      : never;
};

export interface PrimaryDatabaseQueryRequest {
  action: '@ignisia/replica';
  payload: {
    query: QueryRunHooksOptions['query'];
    params: QueryRunHooksOptions['params'];
    type: QueryRunHooksOptions['type'];
  };
}
