import type { ReplicaInstanceType } from '../constants';
import type { ReplicaInstanceMap } from '../types';

export interface ReplicaDatabaseReplicaOptions<
  Type extends ReplicaInstanceType,
  Instance extends ReplicaInstanceMap[Type],
> {
  type: Type;
  instance: Instance;
}
