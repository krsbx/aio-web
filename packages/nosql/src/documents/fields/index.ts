import { AcceptedColumnTypes } from './constants';
import type {
  AcceptedColumnTypeMap,
  ArrayOptions,
  EnumOptions,
  FieldOptions,
  JsonOptions,
} from './types';

export class Field<
  Type extends AcceptedColumnTypes = AcceptedColumnTypes,
  Values extends Record<string, Field> | readonly string[] = readonly string[],
  Options extends FieldOptions<Type, Values> = FieldOptions<Type, Values>,
  ColValue extends AcceptedColumnTypeMap[Type] = AcceptedColumnTypeMap[Type],
  Value extends Options extends EnumOptions<infer Value>
    ? Value[number]
    : ColValue = ColValue,
  Fields extends Options extends JsonOptions<infer Fields>
    ? Fields
    : Options extends ArrayOptions<infer Fields>
      ? Fields
      : never = never,
> {
  public readonly type: Type;
  public readonly enums: readonly Value[];
  public readonly fields: Fields;

  private constructor(options: Options) {
    this.type = options.type as Type;
    this.enums = [];
    this.fields = null as unknown as Fields;

    if ('values' in options) {
      this.enums = options.values as readonly Value[];
    }

    if ('fields' in options) {
      this.fields = options.fields as Fields;
    }
  }

  public static define<
    Type extends AcceptedColumnTypes,
    Values extends Record<string, Field> | readonly string[],
    Options extends FieldOptions<Type, Values>,
    ColValue extends AcceptedColumnTypeMap[Type],
    Value extends Options extends EnumOptions<infer Value>
      ? Value[number]
      : ColValue,
    Fields extends Options extends JsonOptions<infer Fields>
      ? Fields
      : Options extends ArrayOptions<infer Fields>
        ? Fields
        : never,
  >(options: Options) {
    const field = new Field<Type, Values, Options, ColValue, Value, Fields>(
      options
    );

    return field;
  }
}
