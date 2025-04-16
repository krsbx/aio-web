import { Context } from '../context';
import { StatusCode } from '../context/constants';
import type {
  ComposerOptions,
  MiddlewareComposerOptions,
  OnError,
} from './types';

async function handleError(
  err: unknown,
  onError: OnError | null,
  ctx: Context
) {
  if (onError) {
    return onError(err, ctx);
  }

  return Response.json(
    { message: 'Internal Server Error' },
    {
      status: StatusCode.INTERNAL_SERVER_ERROR,
    }
  );
}

export async function mwComposer({
  ctx,
  middlewares,
}: MiddlewareComposerOptions) {
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
}

export async function composer({ ctx, route, middlewares }: ComposerOptions) {
  const mwRes = await mwComposer({
    ctx,
    middlewares,
  });

  if (mwRes) return mwRes;

  const res = await route.handler(ctx);
  ctx.res = res;

  return ctx.res;
}

export function wrapComposer(ctx: Context, onError: OnError | null) {
  return async <T>(fn: T) => {
    try {
      return await fn;
    } catch (error) {
      return handleError(error, onError, ctx);
    }
  };
}
