import type { MiddlewareComposerOptions } from './types';

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
