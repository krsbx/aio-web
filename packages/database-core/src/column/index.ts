import type { Dialect } from '../table/types';
import { ColumnTypeMapping } from './constants';
import type {
  AcceptedColumnTypeMap,
  ColumnOptions,
  EnumOptions,
} from './types';

interface ColumnDefinition<T, U extends Dialect | null = null> {
  primaryKey: boolean;
  autoIncrement: boolean;
  notNull: boolean;
  unique: boolean;
  comment: string | null;
  default: T | undefined;
  dialect: U | null;
}

type ValueSelector<
  Definition extends
    | Partial<ColumnDefinition<Value, Dialect>>
    | ColumnDefinition<Value, Dialect>,
  Value,
> = Definition['notNull'] extends true ? Value | string : Value | string | null;

export class Column<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Values = any,
  Options extends ColumnOptions<Values> = ColumnOptions<Values>,
  ColumnValue extends
    AcceptedColumnTypeMap[Options['type']] = AcceptedColumnTypeMap[Options['type']],
  Value extends Options extends EnumOptions<infer Value>
    ? Value[number]
    : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      ColumnValue = ColumnValue,
  Definition extends Partial<
    ColumnDefinition<Value, Dialect>
  > = NonNullable<unknown>,
> {
  public readonly definition: Definition;
  public readonly type: Options['type'];
  public readonly length: number | undefined;
  public readonly enums: readonly Values[];

  constructor(options: Options) {
    this.type = options.type;
    this.enums = [];

    if ('length' in options) {
      this.length = options.length as number;
    }

    if ('values' in options) {
      this.enums = options.values as readonly Values[];
    }

    this.definition = {
      autoIncrement: false,
      primaryKey: false,
      notNull: false,
      unique: false,
      comment: null,
      default: undefined,
    } as Definition;
  }

  public primaryKey() {
    this.definition.primaryKey = true;
    return this as Column<
      Values,
      Options,
      ColumnValue,
      Value,
      Definition & { primaryKey: true }
    >;
  }

  public notNull() {
    this.definition.notNull = true;
    return this as Column<
      Values,
      Options,
      ColumnValue,
      Value,
      Definition & { notNull: true }
    >;
  }

  public unique() {
    this.definition.unique = true;
    return this as Column<
      Values,
      Options,
      ColumnValue,
      Value,
      Definition & { unique: true }
    >;
  }

  public comment<Comment extends string | null>(value: Comment) {
    this.definition.comment = value;
    return this as unknown as Column<
      Values,
      Options,
      ColumnValue,
      Value,
      Definition & { comment: Comment }
    >;
  }

  public default<FinalValue extends ValueSelector<Definition, Value>>(
    value: FinalValue
  ) {
    this.definition.default = value as unknown as Value;
    return this as unknown as Column<
      Values,
      Options,
      ColumnValue,
      Value,
      Definition & { default: FinalValue }
    >;
  }

  public dialect<DbDialect extends Dialect>(dialect: DbDialect) {
    this.definition.dialect = dialect as never;
    return this as unknown as Column<
      Values,
      Options,
      ColumnValue,
      Value,
      Definition & { dialect: DbDialect }
    >;
  }

  public toString(): string {
    if (!this.definition.dialect) {
      throw new Error('No DB Dialect defined');
    }

    const correctType = ColumnTypeMapping[this.type][this.definition.dialect];

    const sqls = [
      correctType + (this.length !== undefined ? `(${this.length})` : ''),
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

  public infer(): ValueSelector<Definition, Value> {
    return null as never;
  }
}
