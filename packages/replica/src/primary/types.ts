import type { QueryType as NoSqlQueryType } from '@ignisia/nosql/dist/documents/query/constants';
import type { QueryType as SqlQueryType } from '@ignisia/sql/dist/query/constants';
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

export interface OnQueryRun {
  query: string;
  params: unknown[];
  type: SqlQueryType | NoSqlQueryType;
}
