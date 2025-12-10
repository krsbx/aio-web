import type { DatabaseDialect } from '../database/types';
import type { Field } from '../field';
import { QueryBuilder } from '../query';
import type {
  DocumentOptions,
  DocumentOutput,
  TimestampOptions,
} from './types';
import { defineFields } from './utilities';

export class Document<
  DocName extends string = string,
  Fields extends Record<string, Field> = Record<string, Field>,
  CreatedAt extends string | boolean = string | boolean,
  UpdatedAt extends string | boolean = string | boolean,
  Timestamp extends TimestampOptions<CreatedAt, UpdatedAt> | boolean =
    | TimestampOptions<CreatedAt, UpdatedAt>
    | boolean,
  Paranoid extends string | boolean = string | boolean,
> {
  public client: DatabaseDialect | null;
  public readonly name: DocName;
  public readonly fields: Fields;
  public readonly timestamp: Timestamp | null;
  public readonly paranoid: Paranoid | null;
  public readonly _output!: DocumentOutput<
    DocName,
    Fields,
    CreatedAt,
    UpdatedAt,
    Timestamp,
    Paranoid
  >;

  protected constructor(
    options: DocumentOptions<
      DocName,
      Fields,
      CreatedAt,
      UpdatedAt,
      Timestamp,
      Paranoid
    >
  ) {
    this.name = options.name;
    this.fields = options.fields;
    this.paranoid = options.paranoid || null;
    this.timestamp = options.timestamp || null;
    this.client = null;
  }

  public query() {
    return new QueryBuilder(this);
  }

  public infer(): this['_output'] {
    return null as never;
  }

  public static define<
    DocName extends string,
    Fields extends Record<string, Field>,
    CreatedAt extends string | boolean,
    UpdatedAt extends string | boolean,
    Timestamp extends TimestampOptions<CreatedAt, UpdatedAt> | boolean,
    Paranoid extends string | boolean,
  >(
    options: DocumentOptions<
      DocName,
      Fields,
      CreatedAt,
      UpdatedAt,
      Timestamp,
      Paranoid
    >
  ) {
    const fields = defineFields(options);

    const document = new Document({
      ...options,
      fields,
    });

    return document;
  }
}
