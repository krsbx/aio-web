import type { Router } from '../router';
import type { Route } from '../router/types';

export interface AppHelperContract<BasePath extends string> {
  match(
    this: Router<BasePath>,
    method: string,
    url: string
  ): {
    route: Route;
    params: Record<string, string>;
  } | null;
}
