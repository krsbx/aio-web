import type { QueryBuilder } from '.';
import type { Field } from '../field';
import type { Document } from '../document';
import type { AcceptedJoin } from './constants';
import type {
  FieldSelector,
  QueryDefinition,
  StrictFieldSelector,
} from './types';

export function addJoin<
  Alias extends string,
  DocRef extends Document<string, Record<string, Field>>,
  JoinedDocs extends Record<string, Document<string, Record<string, Field>>>,
  Definition extends Partial<QueryDefinition<Alias, DocRef, JoinedDocs>>,
  AllowedColumn extends FieldSelector<Alias, DocRef, JoinedDocs>,
  StrictAllowedColumn extends StrictFieldSelector<Alias, DocRef, JoinedDocs>,
  JoinType extends AcceptedJoin,
  JoinTable extends Document<string, Record<string, Field>>,
  JoinAlias extends string,
  BaseColName extends `${Alias}.${keyof DocRef['fields'] & string}`,
  JoinColName extends `${JoinAlias}.${keyof JoinTable['fields'] & string}`,
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
  const [baseTable, correctedColumn] = baseColumn.split('.') as [
    string,
    string,
  ];
  const [aliasTable, aliasColumn] = joinColumn.split('.') as [string, string];

  if (!query.definition.joins) query.definition.joins = [];

  query.definition.joins.push(
    `${joinType} JOIN documents AS ${alias} ON JSON_EXTRACT(${baseTable}.data, '$.${correctedColumn}') = JSON_EXTRACT(${aliasTable}.data, '$.${aliasColumn}')`
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
