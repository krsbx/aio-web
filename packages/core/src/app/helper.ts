import type { Ignisia } from '.';
import type { Route } from '../router/types';

function findRoutes(routes: Route[], method: string, url: string) {
  for (const route of routes) {
    if (route.method !== method) continue;

    const match = route.pattern.exec(url);

    if (!match) continue;

    const params: Record<string, string> = {};

    route.keys.forEach((key, i) => {
      const value = match[i + 1];
      if (value !== undefined) {
        params[key] = decodeURIComponent(value);
      }
    });

    return { route, params };
  }

  return null;
}

export function match<BasePath extends string>(
  this: Ignisia<BasePath>,
  method: string,
  url: string
) {
  const staticHit = this.staticRoutesMap.get(`${method}:${url}`);

  if (staticHit) return { route: staticHit, params: {} };

  const dynamicHit = findRoutes(this.dynamicRoutes, method, url);

  if (dynamicHit) return dynamicHit;

  const wildcardHit = findRoutes(this.wildcardRoutes, method, url);

  if (wildcardHit) return wildcardHit;

  return null;
}
