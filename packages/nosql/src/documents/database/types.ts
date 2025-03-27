import type { Documents } from '../documents';
import type { Field } from '../fields';

export interface DatabaseOptions<
  Docs extends Record<string, Documents<string, Record<string, Field>>>,
> {
  docs: Docs;
  filename: string;
}
