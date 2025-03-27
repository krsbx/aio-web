import type { ReplicaInstanceMap, ReplicaInstanceType } from './constants';

export interface DatabaseReplicaConfig<
  Type extends ReplicaInstanceType,
  Instance extends ReplicaInstanceMap[Type],
> {
  type: Type;
  instance: Instance;
}

export type DatabaseReplicaBaseConfig<
  IsPrimary extends boolean,
  Type extends ReplicaInstanceType,
  Instance extends ReplicaInstanceMap[Type],
> = IsPrimary extends false
  ? {
      config: DatabaseReplicaConfig<Type, Instance>;
    }
  : NonNullable<unknown>;

export type DatabaseReplicaOptions<
  IsPrimary extends boolean,
  Type extends ReplicaInstanceType,
  Instance extends ReplicaInstanceMap[Type],
> = {
  isPrimary: IsPrimary;
} & DatabaseReplicaBaseConfig<IsPrimary, Type, Instance>;
