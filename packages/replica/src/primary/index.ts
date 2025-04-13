import type { ServerWebSocket } from 'bun';
import { ReplicaInstanceType } from '../constants';
import type { ReplicaDatabaseReplica } from '../replica';
import type {
  AcceptedPrimaryInstance,
  PrimaryDatabaseQueryRequest,
  ReplicaInstanceMap,
} from '../types';
import type {
  PrimaryDatabaseReplicaOptions,
  QueryRunHooksOptions,
} from './types';

export class PrimaryDatabaseReplica implements Disposable {
  protected _instance: AcceptedPrimaryInstance;
  protected _replicas: ReplicaDatabaseReplica<
    ReplicaInstanceType,
    ReplicaInstanceMap[ReplicaInstanceType]
  >[];

  protected constructor(options: PrimaryDatabaseReplicaOptions) {
    this._instance = options.db;
    this._replicas = options.replicas;
    this._instance.addHook('after', this.onQuery);
  }

  public get instance() {
    return this._instance;
  }

  public get replicas() {
    return this._replicas;
  }

  public onQuery(options: QueryRunHooksOptions) {
    this._replicas.forEach((replica) => {
      if (options.type === 'SELECT') return;
      if (options.hook !== 'after') return;

      if (replica.type === ReplicaInstanceType.FILE) {
        (replica.instance as AcceptedPrimaryInstance).client.exec(
          options.query,
          options.params
        );

        return;
      }

      const request: PrimaryDatabaseQueryRequest = {
        action: '@ignisia/replica',
        payload: {
          query: options.query,
          params: options.params,
          type: options.type,
        },
      };

      (replica.instance as ServerWebSocket).send(JSON.stringify(request), true);
    });
  }

  public [Symbol.dispose]() {
    this._instance.removeHook('after', this.onQuery);
  }

  public static define(options: PrimaryDatabaseReplicaOptions) {
    return new PrimaryDatabaseReplica(options);
  }
}
