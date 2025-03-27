import type { QueryBuilder } from '.';
import type { Field } from '../fields';
import type { Documents } from '../documents';
import type { AcceptedJoin } from './constants';
import type {
  FieldSelector,
  QueryDefinition,
  StrictFieldSelector,
} from './types';

export function addJoin<
  Alias extends string,
  DocRef extends Documents<string, Record<string, Field>>,
  JoinedDocs extends Record<string, Documents<string, Record<string, Field>>>,
  Definition extends Partial<QueryDefinition<Alias, DocRef, JoinedDocs>>,
  AllowedColumn extends FieldSelector<Alias, DocRef, JoinedDocs>,
  StrictAllowedColumn extends StrictFieldSelector<Alias, DocRef, JoinedDocs>,
  JoinType extends AcceptedJoin,
  JoinTable extends Documents<string, Record<string, Field>>,
  JoinAlias extends string,
  BaseColName extends `${keyof DocRef['fields'] & string}`,
  JoinColName extends `${keyof JoinTable['fields'] & string}`,
  FinalJoinedDocs extends JoinedDocs & { [K in JoinAlias]: JoinTable },
>(
  query: QueryBuilder<
    Alias,
    DocRef,
    JoinedDocs,
    Definition,
    AllowedColumn,
    StrictAllowedColumn
  >,
  joinType: JoinType,
  alias: JoinAlias,
  joinTable: JoinTable,
  baseColumn: BaseColName,
  joinColumn: JoinColName
) {
  const base = query.definition.baseAlias ?? query.doc.name;

  if (!query.definition.joins) query.definition.joins = [];

  query.definition.joins.push(
    `${joinType} JOIN documents AS ${alias} ON JSON_EXTRACT(${base}.data, '$.${baseColumn}') = JSON_EXTRACT(${alias}.data, '$.${joinColumn}')`
  );

  if (!query.definition.joinedDocs) {
    query.definition.joinedDocs = {} as JoinedDocs;
  }

  query.definition.joinedDocs = {
    ...query.definition.joinedDocs,
    [alias]: joinTable,
  };

  return query as unknown as QueryBuilder<
    Alias,
    DocRef,
    FinalJoinedDocs,
    Omit<Definition, 'joins' | 'joinedDocs'> & {
      joins: string[];
      joinedTables: FinalJoinedDocs;
    }
  >;
}
