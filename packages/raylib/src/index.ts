import { dlopen, type ConvertFns, type Library } from 'bun:ffi';
import { CoreDefinition } from './core/definition';
import { RayLibCore, type RayLibCore as RayLibCoreType } from './core/index';

class RayLibClientBase {
  public client: Library<CoreDefinition>;
  public symbols: ConvertFns<CoreDefinition>;

  public constructor(filePath: string) {
    const client = dlopen(filePath, {
      ...CoreDefinition,
    });

    this.client = client;
    this.symbols = client.symbols;

    // Bind all RayLibCore methods to this instance
    Object.entries(RayLibCore).forEach(([name, fn]) => {
      (this as Record<string, unknown>)[name] = fn.bind(this as never);
    });
  }
}

interface RayLibClient extends RayLibClientBase, RayLibCoreType {}

// Export the constructor
export const RayLibClient = RayLibClientBase as new (
  ...args: ConstructorParameters<typeof RayLibClientBase>
) => RayLibClient;
