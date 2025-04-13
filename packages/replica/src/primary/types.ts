import type { QueryRunHooksOptions as NoSqlQueryRunHooksOptions } from '@ignisia/nosql/dist/documents/query/types';
import type { QueryRunHooksOptions as SqlQueryRunHooksOptions } from '@ignisia/sql/dist/query/types';
import type { ReplicaInstanceType } from '../constants';
import type { ReplicaDatabaseReplica } from '../replica';
import type { AcceptedPrimaryInstance, ReplicaInstanceMap } from '../types';

export interface PrimaryDatabaseReplicaOptions {
  db: AcceptedPrimaryInstance;
  replicas: ReplicaDatabaseReplica<
    ReplicaInstanceType,
    ReplicaInstanceMap[ReplicaInstanceType]
  >[];
}

export type QueryRunHooksOptions =
  | NoSqlQueryRunHooksOptions
  | SqlQueryRunHooksOptions;
