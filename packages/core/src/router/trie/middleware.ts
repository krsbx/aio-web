import type { Middleware } from '../types';

export class TrieMiddlewareNode {
  public children: Map<string, TrieMiddlewareNode>;
  public middlewares: Middleware[];

  public constructor() {
    this.children = new Map();
    this.middlewares = [];
  }

  public insert(parts: string[], middlewares: Middleware[]) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let node: TrieMiddlewareNode = this;

    for (const part of parts) {
      if (!node.children.has(part))
        node.children.set(part, new TrieMiddlewareNode());

      node = node.children.get(part)!;
    }

    node.middlewares.push(...middlewares);
  }

  public collect(parts: string[]): Middleware[] {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let node: TrieMiddlewareNode | undefined = this;
    const middlewares: Middleware[] = [];

    for (const part of parts) {
      if (!node) break;

      middlewares.push(...node.middlewares);

      node = node.children.get(part)!;
    }

    return middlewares;
  }
}
