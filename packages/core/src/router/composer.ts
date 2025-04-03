import { Context } from '../context';
import type { ComposerOptions } from './types';

export async function composer({
  request,
  params,
  route,
  middlewares,
  pathMiddlewares,
}: ComposerOptions) {
  const ctx = new Context(request, params);

  let i = -1;

  const mws = [...middlewares];

  if (pathMiddlewares[route.path]) {
    mws.push(...pathMiddlewares[route.path]);
  }

  mws.push(...route.middleware);

  const dispatch = async (index: number): Promise<void> => {
    if (index <= i) return;

    i = index;

    const fn =
      mws[index] ||
      (async () => {
        const res = await route.handler(ctx);
        ctx.res = res;
      });

    await fn(ctx, () => dispatch(index + 1));
  };

  await dispatch(0);

  return ctx.res!;
}
