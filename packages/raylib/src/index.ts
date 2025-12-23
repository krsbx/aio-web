import { dlopen, type ConvertFns, type Library } from 'bun:ffi';
import { CoreDefinition } from './core/definition';
import * as coreFns from './core/index';

export class RayLibClient {
  public client: Library<CoreDefinition>;
  public symbols: ConvertFns<CoreDefinition>;

  public constructor(filePath: string) {
    const client = dlopen(filePath, {
      ...CoreDefinition,
    });

    this.client = client;
    this.symbols = client.symbols;

    Object.entries(coreFns).forEach(([name, fn]) => {
      (this as Record<string, unknown>)[name] = fn.bind(this as never);
    });
  }
}
