import { Dialect } from '../table/constants';
import { AcceptedColumnTypes, ColumnTypeMapping } from './constants';
import type {
  AcceptedColumnTypeMap,
  ColumnDefinition,
  ColumnOptions,
  EnumOptions,
  ValueSelector,
} from './types';

export class Column<
  Type extends AcceptedColumnTypes = AcceptedColumnTypes,
  Values extends
    | number
    | readonly string[] = Type extends typeof AcceptedColumnTypes.ENUM
    ? readonly string[]
    : number,
  Options extends ColumnOptions<Type, Values> = ColumnOptions<Type, Values>,
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
  public readonly length: number | null;
  public readonly enums: readonly Value[];
  public readonly _output!: ValueSelector<Definition, Value>;

  protected constructor(options: Options) {
    this.type = options.type;
    this.enums = [];
    this.length = null;

    if ('length' in options) {
      this.length = options.length as number;
    }

    if ('values' in options) {
      this.enums = options.values as readonly Value[];
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

  public static define<
    Type extends AcceptedColumnTypes = AcceptedColumnTypes,
    Values extends number | readonly string[] = number | readonly string[],
    Options extends ColumnOptions<Type, Values> = ColumnOptions<Type, Values>,
  >(options: Options) {
    return new Column(options);
  }

  public autoIncrement() {
    this.definition.autoIncrement = true;
    return this as Column<
      Type,
      Values,
      Options,
      ColumnValue,
      Value,
      Definition & { autoIncrement: true }
    >;
  }

  public primaryKey() {
    this.definition.primaryKey = true;
    return this as Column<
      Type,
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
      Type,
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
      Type,
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
      Type,
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
      Type,
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
      Type,
      Values,
      Options,
      ColumnValue,
      Value,
      Definition & { dialect: DbDialect }
    >;
  }

  public toQuery() {
    if (!this.definition.dialect) {
      throw new Error('No DB Dialect defined');
    }

    const correctType = ColumnTypeMapping[this.type][this.definition.dialect];

    let sql = correctType + (this.length ? `(${this.length})` : '');

    if (this.definition.primaryKey) {
      sql += ' PRIMARY KEY';
    }

    if (
      this.definition.autoIncrement ||
      this.type === AcceptedColumnTypes.SERIAL
    ) {
      const isPrimaryKey = !!this.definition.primaryKey;

      if (this.definition.dialect === Dialect.POSTGRES) {
        sql = `SERIAL${isPrimaryKey ? ' PRIMARY KEY' : ''}`;
      } else {
        if (this.type !== AcceptedColumnTypes.SERIAL) {
          sql += ' AUTOINCREMENT';
        } else {
          const sqls = ['INTEGER', 'PRIMARY KEY', 'AUTOINCREMENT'];

          if (!isPrimaryKey) sqls.splice(1, 1);

          sql = sqls.join(' ');
        }
      }
    }

    if (this.definition.notNull) {
      sql += ' NOT NULL';
    }

    if (this.definition.unique) {
      sql += ' UNIQUE';
    }

    if (this.definition.default !== undefined) {
      const value = this.definition.default;
      const isString = typeof this.definition.default === 'string';
      const finalValue = isString ? `'${value}'` : value;

      sql += ` DEFAULT ${finalValue}`;
    }

    return { query: sql, params: [] };
  }

  public toString() {
    return this.toQuery().query;
  }

  public infer(): this['_output'] {
    return null as never;
  }
}
