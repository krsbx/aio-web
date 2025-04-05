import { Context } from '../context';
import { StatusCode } from '../context/constants';
import type { ComposerOptions } from './types';

export async function composer({
  request,
  params,
  route,
  middlewares,
  onError,
}: ComposerOptions) {
  const ctx = new Context(request, params);

  let i = -1;

  try {
    const dispatch = async (index: number): Promise<void> => {
      if (index <= i) return;

      i = index;

      const fn =
        middlewares[index] ||
        (async () => {
          const res = await route.handler(ctx);
          ctx.res = res;
        });

      await fn(ctx, () => dispatch(index + 1));
    };

    await dispatch(0);

    return ctx.res!;
  } catch (error) {
    ctx.status(StatusCode.INTERNAL_SERVER_ERROR);

    if (onError) {
      return onError(error, ctx);
    }

    return ctx.json({
      message: 'Internal Server Error',
    });
  }
}
