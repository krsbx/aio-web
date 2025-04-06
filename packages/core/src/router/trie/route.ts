import type { ApiMethod } from '../../app/constants';
import type { MatchResult } from '../../app/types';
import type { Route } from '../types';

export class TrieRouteNode {
  public children: Map<string, TrieRouteNode>;
  public paramChild: TrieRouteNode | null;
  public wildcardChild: TrieRouteNode | null;
  public paramName: string | null;
  public wildcardName: string | null;
  public routes: Map<string, Route>;

  public constructor() {
    this.children = new Map();
    this.paramChild = null;
    this.wildcardChild = null;
    this.paramName = null;
    this.wildcardName = null;
    this.routes = new Map();
  }

  public collectRoutes(path = '') {
    const routes: Route[] = [];

    for (const [, route] of this.routes.entries()) {
      route.path = path;
      routes.push(route);
    }

    for (const [segment, child] of this.children) {
      routes.push(...child.collectRoutes(`${path}/${segment}`));
    }

    if (this.paramChild) {
      const paramPath = `/:${this.paramChild.paramName}`;
      const fullPath = `${path}${paramPath}`;

      routes.push(...this.paramChild.collectRoutes(fullPath));
    }

    if (this.wildcardChild) {
      const fullPath = `${path}/*`;

      routes.push(...this.wildcardChild.collectRoutes(fullPath));
    }

    return routes;
  }

  public insert(parts: string[], route: Route) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let node: TrieRouteNode = this;
    let wildcardIndex = 0;

    for (const part of parts) {
      if (part === '*') {
        if (!node.wildcardChild) node.wildcardChild = new TrieRouteNode();

        node.wildcardChild.wildcardName = `wildcard${wildcardIndex}`;
        wildcardIndex++;

        node = node.wildcardChild;
      } else if (part.startsWith(':')) {
        if (!node.paramChild) node.paramChild = new TrieRouteNode();

        node.paramChild.paramName = part.slice(1);

        node = node.paramChild;
      } else {
        if (!node.children.has(part))
          node.children.set(part, new TrieRouteNode());

        node = node.children.get(part)!;
      }
    }

    node.routes.set(route.method, route);
  }

  public match(parts: string[], method: ApiMethod): MatchResult | null {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let node: TrieRouteNode = this;
    const params: Record<string, string> = {};

    for (const part of parts) {
      if (node.children.has(part)) {
        node = node.children.get(part)!;
      } else if (node.paramChild) {
        params[node.paramChild.paramName!] = part;
        node = node.paramChild;
      } else if (node.wildcardChild) {
        params[node.wildcardChild.wildcardName!] = part;
        node = node.wildcardChild;
      } else {
        return null;
      }
    }

    const route = node.routes.get(method);

    if (!route) return null;

    return { route, params };
  }
}
