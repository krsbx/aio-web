import type { Context } from '@ignisia/core';

export interface ForgeApi {
  GET(context: Context): Promise<Response>;
  POST(context: Context): Promise<Response>;
  PUT(context: Context): Promise<Response>;
  PATCH(context: Context): Promise<Response>;
  DELETE(context: Context): Promise<Response>;
  OPTIONS(context: Context): Promise<Response>;
}
