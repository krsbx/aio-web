import { dlopen, type ConvertFns, type Library } from 'bun:ffi';
import { CursorDefinition } from './cursor/defintion';
import { DrawingDefinition } from './drawing/definition';
import { WindowDefinition } from './window/definition';

type RayLibDefinition = typeof WindowDefinition &
  typeof CursorDefinition &
  typeof DrawingDefinition;

export class RayLibClient {
  public client: Library<RayLibDefinition>;
  public symbols: ConvertFns<RayLibDefinition>;

  public constructor(filePath: string) {
    const client = dlopen(filePath, {
      ...WindowDefinition,
      ...CursorDefinition,
      ...DrawingDefinition,
    });

    this.client = client;
    this.symbols = client.symbols;
  }
}
