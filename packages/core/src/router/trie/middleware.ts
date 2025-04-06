import type { Middleware } from '../types';

export class TrieMiddlewareNode {
  public children: Record<string, TrieMiddlewareNode>;
  public middlewares: Middleware[];

  public constructor() {
    this.children = Object.create(null);
    this.middlewares = [];
  }

  public insert(parts: string[], middlewares: Middleware[]) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let node: TrieMiddlewareNode = this;

    for (const part of parts) {
      if (!node.children[part]) node.children[part] = new TrieMiddlewareNode();

      node = node.children[part];
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

      node = node.children[part];
    }

    return middlewares;
  }
}
