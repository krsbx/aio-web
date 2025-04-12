import { ReplicaInstanceType } from '../constants';
import type { ReplicaDatabaseReplica } from '../replica';
import type { AcceptedPrimaryInstance, ReplicaInstanceMap } from '../types';
import type { OnQueryRun, PrimaryDatabaseReplicaOptions } from './types';

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

  public onQuery(options: OnQueryRun) {
    this._replicas.forEach((replica) => {
      if (replica.type === ReplicaInstanceType.FILE) {
        if (options.type === 'SELECT') return;

        (replica.instance as AcceptedPrimaryInstance).client.exec(
          options.query,
          options.params
        );

        return;
      }

      (replica.instance as Bun.ServerWebSocket).send(
        JSON.stringify({
          action: '@ignisia/replica',
          payload: {
            query: options.query,
            params: options.params,
            type: options.type,
          },
        }),
        true
      );
    });
  }

  public static define(options: PrimaryDatabaseReplicaOptions) {
    return new PrimaryDatabaseReplica(options);
  }
}
