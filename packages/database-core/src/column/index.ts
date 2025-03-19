import type {
  AcceptedColumnTypeMap,
  ColumnOptions,
  EnumOptions,
} from './types';

interface ColumnDefinition<T> {
  primaryKey: boolean;
  autoIncrement: boolean;
  notNull: boolean;
  unique: boolean;
  comment: string | null;
  default: T | undefined;
}

export class Column<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T = any,
  U extends ColumnOptions<T> = ColumnOptions<T>,
  V extends AcceptedColumnTypeMap[U['type']] = AcceptedColumnTypeMap[U['type']],
  W extends Partial<ColumnDefinition<U>> = object,
> {
  public readonly definition: W;
  public readonly type: U['type'];
  public readonly length?: number;
  public readonly enums?: readonly T[];

  constructor(options: U) {
    this.type = options.type;
    this.enums = [];

    if ('length' in options) {
      this.length = options.length as number;
    }

    if ('values' in options) {
      this.enums = options.values as readonly T[];
    }

    this.definition = {
      autoIncrement: false,
      primaryKey: false,
      notNull: false,
      unique: false,
      comment: null,
      default: undefined,
    } as W;
  }

  public primaryKey() {
    this.definition.primaryKey = true;
    return this as Column<T, U, V, W & { primaryKey: true }>;
  }

  public notNull() {
    this.definition.notNull = true;
    return this as Column<T, U, V, W & { notNull: true }>;
  }

  public unique() {
    this.definition.unique = true;
    return this as Column<T, U, V, W & { unique: true }>;
  }

  public comment<X extends string | null>(value: X) {
    this.definition.comment = value;
    return this as unknown as Column<T, U, V, W & { comment: X }>;
  }

  public default<
    X extends U extends EnumOptions<infer Y> ? Y[number] : V,
    Z extends W['notNull'] extends true ? X : X | null,
  >(value: Z) {
    this.definition.default = value as unknown as U;
    return this as unknown as Column<T, U, V, W & { default: Z }>;
  }

  public toString(): string {
    const sqls = [
      this.type + (this.length !== undefined ? `(${this.length})` : ''),
    ];

    if (this.definition.primaryKey) {
      sqls.push('PRIMARY KEY');
    }

    if (this.definition.autoIncrement) {
      sqls.push('AUTOINCREMENT');
    }

    if (this.definition.notNull) {
      sqls.push('NOT NULL');
    }

    if (this.definition.unique) {
      sqls.push('UNIQUE');
    }

    if (this.definition.default !== undefined) {
      const value = this.definition.default;
      const isString = typeof this.definition.default === 'string';
      const finalValue = isString ? `'${value}'` : value;

      sqls.push(`DEFAULT ${finalValue}`);
    }

    return sqls.join(' ');
  }

  infer<
    X extends U extends EnumOptions<infer Y> ? Y[number] : V,
    Z extends W['notNull'] extends true ? X : X | null,
  >(): Z {
    return null as never;
  }
}
