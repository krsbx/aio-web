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

  try {
    let index = 0;
    let nextCalled = false;

    async function next() {
      nextCalled = true;
      index++;
    }

    while (index < middlewares.length) {
      const mw = middlewares[index];

      await mw(ctx, next);

      if (!nextCalled) break;
    }

    const res = await route.handler(ctx);
    ctx.res = res;

    return ctx.res;
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
