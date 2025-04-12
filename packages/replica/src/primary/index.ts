import type { ReplicaInstanceType } from '../constants';
import type { ReplicaDatabaseReplica } from '../replica';
import type { AcceptedPrimaryInstance, ReplicaInstanceMap } from '../types';
import type { PrimaryDatabaseReplicaOptions } from './types';

export class PrimaryDatabaseReplica {
  protected _instance: AcceptedPrimaryInstance;
  protected _replicas: ReplicaDatabaseReplica<
    ReplicaInstanceType,
    ReplicaInstanceMap[ReplicaInstanceType]
  >[];

  protected constructor(options: PrimaryDatabaseReplicaOptions) {
    this._instance = options.db;
    this._replicas = options.replicas;
  }

  public get instance() {
    return this._instance;
  }

  public get replicas() {
    return this._replicas;
  }

  public static define(options: PrimaryDatabaseReplicaOptions) {
    return new PrimaryDatabaseReplica(options);
  }
}
