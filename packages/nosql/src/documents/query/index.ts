import type { Documents } from '../documents';
import type { Field } from '../fields';
import type { QueryTransformerContract } from './contract';
import { alias, clone } from './helper';
import type {
  FieldSelector,
  QueryDefinition,
  StrictFieldSelector,
} from './types';

export class QueryBuilder<
  Alias extends string,
  DocRef extends Documents<string, Record<string, Field>>,
  JoinedDocs extends Record<
    string,
    Documents<string, Record<string, Field>>
  > = NonNullable<unknown>,
  Definition extends Partial<
    QueryDefinition<Alias, DocRef, JoinedDocs>
  > = NonNullable<unknown>,
  AllowedField extends FieldSelector<Alias, DocRef, JoinedDocs> = FieldSelector<
    Alias,
    DocRef,
    JoinedDocs
  >,
  StrictAllowedField extends StrictFieldSelector<
    Alias,
    DocRef,
    JoinedDocs
  > = StrictFieldSelector<Alias, DocRef, JoinedDocs>,
> {
  public readonly doc: DocRef;
  public readonly definition: Definition;

  public alias: QueryTransformerContract<
    Alias,
    DocRef,
    JoinedDocs,
    Definition,
    AllowedField,
    StrictAllowedField
  >['alias'];
  public clone: QueryTransformerContract<
    Alias,
    DocRef,
    JoinedDocs,
    Definition,
    AllowedField,
    StrictAllowedField
  >['clone'];

  constructor(doc: DocRef) {
    this.doc = doc;
    this.definition = {
      queryType: null,
      select: null,
      having: null,
      where: null,
      params: null,
      limit: null,
      offset: null,
      groupBy: null,
      insertValues: null,
      updateValues: null,
      orderBy: null,
      aggregates: null,
      joins: null,
      distinct: null,
      baseAlias: null,
      joinedDocs: null,
      withDeleted: null,
    } as Definition;

    this.alias = alias.bind(this) as this['alias'];
    this.clone = clone.bind(this) as this['clone'];
  }
}
