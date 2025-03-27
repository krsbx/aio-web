import type { Field } from '../fields';
import type { DocumentOptions, TimestampOptions } from './types';
import { defineFields } from './utilities';

export class Documents<
  DocName extends string,
  Fields extends Record<string, Field>,
  CreatedAt extends string,
  UpdatedAt extends string,
  Timestamp extends TimestampOptions<CreatedAt, UpdatedAt> | boolean,
  Paranoid extends string | boolean,
> {
  public readonly name: DocName;
  public readonly fields: Fields;
  public readonly timestamp: Timestamp | null;
  public readonly paranoid: Paranoid | null;

  private constructor(
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
  }

  public static define<
    DocName extends string,
    Fields extends Record<string, Field>,
    CreatedAt extends string,
    UpdatedAt extends string,
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

    const document = new Documents({
      ...options,
      fields,
    });

    return document;
  }
}
