import type { Context } from '@ignisia/core';

export interface ForgeApi {
  GET?(ctx: Context): Promise<Response>;
  POST?(ctx: Context): Promise<Response>;
  PUT?(ctx: Context): Promise<Response>;
  PATCH?(ctx: Context): Promise<Response>;
  DELETE?(ctx: Context): Promise<Response>;
  OPTIONS?(ctx: Context): Promise<Response>;
}
