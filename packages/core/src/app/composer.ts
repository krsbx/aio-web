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

    function next() {
      nextCalled = true;
    }

    while (index < middlewares.length) {
      nextCalled = false;

      const res = await middlewares[index](ctx, next);

      if (res instanceof Response) {
        return res;
      }

      if (!nextCalled) break;

      index++;
    }

    const res = await route.handler(ctx);
    ctx.res = res;

    return ctx.res;
  } catch (error) {
    if (onError) {
      return onError(error, ctx);
    }

    return Response.json(
      { message: 'Internal Server Error' },
      {
        status: StatusCode.INTERNAL_SERVER_ERROR,
      }
    );
  }
}
