import type { ReplicaInstanceType } from './constants';

export type ReplicaInstanceMap = {
  [K in ReplicaInstanceType]: K extends typeof ReplicaInstanceType.FILE
    ? `file://${string}`
    : K extends typeof ReplicaInstanceType.SOCKET
      ? WebSocket
      : never;
};

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
