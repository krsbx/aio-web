import { Context } from '../context';
import { StatusCode } from '../context/constants';
import type { ComposerOptions } from './types';

export async function composer({
  request,
  params,
  route,
  middlewares,
  pathMiddlewares,
  onError,
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

  try {
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
  } catch (error) {
    if (onError) {
      return onError(error, ctx);
    }

    return Response.json(
      {
        message: 'Internal Server Error',
      },
      {
        status: StatusCode.INTERNAL_SERVER_ERROR,
      }
    );
  }
}
