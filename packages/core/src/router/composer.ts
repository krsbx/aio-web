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

  const pathMws = Object.entries(pathMiddlewares).filter(([prefix]) =>
    route.path.startsWith(prefix)
  );

  if (pathMws.length) {
    mws.push(...pathMws.flatMap(([, mws]) => mws));
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
