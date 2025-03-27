import type { QueryBuilder } from '.';
import type { Documents } from '../documents';
import type { Field } from '../fields';
import type {
  FieldSelector,
  QueryDefinition,
  StrictFieldSelector,
} from './types';

export interface QueryTransformerContract<
  Alias extends string,
  DocRef extends Documents<string, Record<string, Field>>,
  JoinedDocs extends Record<string, Documents<string, Record<string, Field>>>,
  Definition extends Partial<QueryDefinition<Alias, DocRef, JoinedDocs>>,
  AllowedField extends FieldSelector<Alias, DocRef, JoinedDocs>,
  StrictAllowedField extends StrictFieldSelector<Alias, DocRef, JoinedDocs>,
> {
  toQuery(
    this: QueryBuilder<
      Alias,
      DocRef,
      JoinedDocs,
      Definition,
      AllowedField,
      StrictAllowedField
    >
  ): {
    query: string;
    params: unknown[] | null | undefined;
  };

  toString(
    this: QueryBuilder<
      Alias,
      DocRef,
      JoinedDocs,
      Definition,
      AllowedField,
      StrictAllowedField
    >
  ): string;

  clone(
    this: QueryBuilder<
      Alias,
      DocRef,
      JoinedDocs,
      Definition,
      AllowedField,
      StrictAllowedField
    >
  ): typeof this;

  alias<NewAlias extends string>(
    alias: NewAlias
  ): QueryBuilder<
    NewAlias,
    DocRef,
    JoinedDocs,
    Omit<Definition, 'baseAlias'> & { baseAlias: NewAlias }
  >;
}
