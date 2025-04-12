import type { ReplicaInstanceType } from '../constants';
import type { ReplicaInstanceMap } from '../types';
import type { ReplicaDatabaseReplicaOptions } from './types';

export class ReplicaDatabaseReplica<
  Type extends ReplicaInstanceType,
  Instance extends ReplicaInstanceMap[Type],
> {
  protected _type: Type;
  protected _instance: Instance;

  protected constructor(
    options: ReplicaDatabaseReplicaOptions<Type, Instance>
  ) {
    this._type = options.type;
    this._instance = options.instance;
  }

  public get type() {
    return this._type;
  }

  public get instance() {
    return this._instance;
  }

  public static define<
    Type extends ReplicaInstanceType,
    Instance extends ReplicaInstanceMap[Type],
  >(options: ReplicaDatabaseReplicaOptions<Type, Instance>) {
    return new ReplicaDatabaseReplica(options);
  }
}
