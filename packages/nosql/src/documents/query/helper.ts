import { QueryBuilder } from '.';
import { deepClone } from '../../utilities';
import type { Documents } from '../documents';
import type { Field } from '../fields';
import type {
  FieldSelector,
  QueryDefinition,
  StrictFieldSelector,
} from './types';

export function alias<
  Alias extends string,
  DocRef extends Documents<string, Record<string, Field>>,
  JoinedDocs extends Record<string, Documents<string, Record<string, Field>>>,
  Definition extends Partial<QueryDefinition<Alias, DocRef, JoinedDocs>>,
  AllowedField extends FieldSelector<Alias, DocRef, JoinedDocs>,
  StrictAllowedField extends StrictFieldSelector<Alias, DocRef, JoinedDocs>,
  NewAlias extends string,
>(
  this: QueryBuilder<
    Alias,
    DocRef,
    JoinedDocs,
    Definition,
    AllowedField,
    StrictAllowedField
  >,
  alias: NewAlias
) {
  this.definition.baseAlias = alias as unknown as Alias;

  return this as unknown as QueryBuilder<
    NewAlias,
    DocRef,
    JoinedDocs,
    Omit<Definition, 'baseAlias'> & { baseAlias: NewAlias }
  >;
}

export function clone<
  Alias extends string,
  DocRef extends Documents<string, Record<string, Field>>,
  JoinedDocs extends Record<string, Documents<string, Record<string, Field>>>,
  Definition extends Partial<QueryDefinition<Alias, DocRef, JoinedDocs>>,
  AllowedField extends FieldSelector<Alias, DocRef, JoinedDocs>,
  StrictAllowedField extends StrictFieldSelector<Alias, DocRef, JoinedDocs>,
>(
  this: QueryBuilder<
    Alias,
    DocRef,
    JoinedDocs,
    Definition,
    AllowedField,
    StrictAllowedField
  >
) {
  const query = new QueryBuilder<Alias, DocRef, JoinedDocs>(this.doc);

  Object.assign(query.definition, deepClone(this.definition));

  return query;
}
