import { CursorDefinition } from './cursor/defintion';
import { DrawingDefinition } from './drawing/definition';
import { WindowDefinition } from './window/definition';

export type CoreDefinition = typeof WindowDefinition &
  typeof CursorDefinition &
  typeof DrawingDefinition;

export const CoreDefinition = {
  ...WindowDefinition,
  ...CursorDefinition,
  ...DrawingDefinition,
};
