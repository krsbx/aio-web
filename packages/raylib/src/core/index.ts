import * as cursor from './cursor';
import * as drawing from './drawing';
import * as window from './window';

export const RayLibCore = {
  ...cursor,
  ...drawing,
  ...window,
};

export type RayLibCore = {
  [key in keyof typeof cursor & string]: (typeof cursor)[key];
} & {
  [key in keyof typeof drawing & string]: (typeof drawing)[key];
} & {
  [key in keyof typeof window & string]: (typeof window)[key];
};
