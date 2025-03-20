import type { Column } from '../column';
import type { Dialect } from './constants';

export type Dialect = (typeof Dialect)[keyof typeof Dialect];

export type TimestampOptions =
  | boolean
  | {
      createdAt?: string;
      updatedAt?: string;
    };

export type TableOptions<T extends string, U extends Record<string, Column>> = {
  name: T;
  columns: U;
  paranoid?: boolean;
  timestamp?: TimestampOptions;
};
