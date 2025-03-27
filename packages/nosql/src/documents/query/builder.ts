import { randomUUIDv7 } from 'bun';
import type { QueryBuilder } from '.';
import type { Documents } from '../documents';
import type { Field } from '../fields';
import type {
  FieldSelector,
  QueryDefinition,
  StrictFieldSelector,
} from './types';
import { quoteIdentifier } from '../../utilities';
import { getTableSelectName } from './utilities';

export function buildSelectQuery<
  Alias extends string,
  DocRef extends Documents<string, Record<string, Field>>,
  JoinedDocs extends Record<string, Documents<string, Record<string, Field>>>,
  Definition extends Partial<QueryDefinition<Alias, DocRef, JoinedDocs>>,
  AllowedField extends FieldSelector<Alias, DocRef, JoinedDocs>,
  StrictAllowedField extends StrictFieldSelector<Alias, DocRef, JoinedDocs>,
>(
  q: QueryBuilder<
    Alias,
    DocRef,
    JoinedDocs,
    Definition,
    AllowedField,
    StrictAllowedField
  >
) {
  const from = getTableSelectName(q);
  const fields: string[] = [];

  if (q.definition.select?.length) {
    for (const col of q.definition.select) {
      if (typeof col === 'object') {
        const [doc, field] = col.field.split('.');

        fields.push(
          `JSON_EXTRACT(${doc}.data, '$.${field}') AS ${quoteIdentifier(col.as)}`
        );
        continue;
      }

      if (!col.endsWith('*')) {
        const [doc, field] = col.split('.');

        fields.push(
          `JSON_EXTRACT(${doc}.data, '$.${field}') AS ${quoteIdentifier(col)}`
        );
        continue;
      }

      fields.push(col);
    }
  }

  if (q.definition?.aggregates) {
    for (const aggregate of q.definition.aggregates) {
      const [doc, field] = aggregate.field.split('.');

      fields.push(
        `(SELECT ${aggregate.fn}(*) FROM ${from} WHERE ${doc}.collection = '${doc}' JSON_EXTRACT(${doc}.data, $.${field})) AS ${aggregate.as}`
      );
    }
  }

  const distinct = q.definition.distinct ? 'DISTINCT ' : '';

  return `SELECT ${distinct}${fields.join(', ')} FROM ${from}`;
}

export function buildInsertQuery<
  Alias extends string,
  DocRef extends Documents<string, Record<string, Field>>,
  JoinedDocs extends Record<string, Documents<string, Record<string, Field>>>,
  Definition extends Partial<QueryDefinition<Alias, DocRef, JoinedDocs>>,
  AllowedField extends FieldSelector<Alias, DocRef, JoinedDocs>,
  StrictAllowedField extends StrictFieldSelector<Alias, DocRef, JoinedDocs>,
>(
  q: QueryBuilder<
    Alias,
    DocRef,
    JoinedDocs,
    Definition,
    AllowedField,
    StrictAllowedField
  >
) {
  const rows = q.definition?.insertValues;

  if (!rows?.length) {
    throw new Error(`INSERT requires values`);
  }

  const ids = rows.map((row) => {
    if ('_id' in row) {
      return row._id as string;
    }

    const _id = randomUUIDv7();

    (row as Record<string, unknown>)._id = _id;

    return _id;
  });

  const rowPlaceholders = `(?, ?, ?)`;
  const placeholders = rows.map(() => rowPlaceholders).join(', ');
  const returnings = Object.keys(q.doc.fields).map(
    (key) =>
      `JSON_EXTRACT(data, '$.${key}') AS "${q.definition.baseAlias ?? q.doc.name}.${key}"`
  );

  q.definition.params = rows
    .map((row, index) => [ids[index], q.doc.name, JSON.stringify(row)])
    .flat(1);

  return `INSERT INTO documents (id, collection, data) VALUES ${placeholders} RETURNING ${returnings.join(', ')}`;
}

export function buildUpdateQuery<
  Alias extends string,
  DocRef extends Documents<string, Record<string, Field>>,
  JoinedDocs extends Record<string, Documents<string, Record<string, Field>>>,
  Definition extends Partial<QueryDefinition<Alias, DocRef, JoinedDocs>>,
  AllowedField extends FieldSelector<Alias, DocRef, JoinedDocs>,
  StrictAllowedField extends StrictFieldSelector<Alias, DocRef, JoinedDocs>,
>(
  q: QueryBuilder<
    Alias,
    DocRef,
    JoinedDocs,
    Definition,
    AllowedField,
    StrictAllowedField
  >
) {
  if (!q.definition?.updateValues) {
    throw new Error(`UPDATE requires values`);
  }

  let keys = Object.keys(q.definition.updateValues);

  const updateParams = keys.map(
    (key) => q.definition.updateValues![key] as unknown
  );

  keys = keys.map((key) => `$.${key}`);

  if (q.definition?.params) {
    q.definition.params = [...updateParams, ...q.definition.params];
  } else {
    q.definition.params = updateParams;
  }

  return `UPDATE documents SET data = JSON_SET(data, ${keys.map((key) => [key, '?'].join(', ')).join(', ')})`;
}

export function buildDeleteQuery<
  Alias extends string,
  DocRef extends Documents<string, Record<string, Field>>,
  JoinedDocs extends Record<string, Documents<string, Record<string, Field>>>,
  Definition extends Partial<QueryDefinition<Alias, DocRef, JoinedDocs>>,
  AllowedField extends FieldSelector<Alias, DocRef, JoinedDocs>,
  StrictAllowedField extends StrictFieldSelector<Alias, DocRef, JoinedDocs>,
>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  q: QueryBuilder<
    Alias,
    DocRef,
    JoinedDocs,
    Definition,
    AllowedField,
    StrictAllowedField
  >
) {
  return `DELETE FROM documents`;
}
