import type { Context } from '@ignisia/core';
import type { ApiMethod } from '@ignisia/core/app/constants';

export type ForgeApi = {
  [key in ApiMethod]?: (ctx: Context) => Promise<Response>;
};
