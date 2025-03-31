import type { ReplicaInstanceMap, ReplicaInstanceType } from './constants';
import type {
  DatabaseReplicaBaseConfig,
  DatabaseReplicaOptions,
} from './types';

export class DatabaseReplica<
  IsPrimary extends boolean,
  Type extends ReplicaInstanceType,
  Instance extends ReplicaInstanceMap[Type],
> {
  public readonly isPrimary: IsPrimary;
  public readonly type: Type | null;
  public readonly instance: Instance | null;

  private constructor(
    options: DatabaseReplicaOptions<IsPrimary, Type, Instance>
  ) {
    this.isPrimary = options.isPrimary;

    if (!this.isPrimary) {
      type Config = DatabaseReplicaBaseConfig<false, Type, Instance>;

      this.type = (options as Config).config.type;
      this.instance = (options as Config).config.instance;
    } else {
      this.type = null;
      this.instance = null;
    }
  }
}
