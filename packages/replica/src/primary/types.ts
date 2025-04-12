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
