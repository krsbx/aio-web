export const ForgeApiMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  OPTIONS: 'OPTIONS',
} as const;

export type ForgeApiMethod =
  (typeof ForgeApiMethod)[keyof typeof ForgeApiMethod];

export const ForgeApiMethods = Object.values(ForgeApiMethod);

export type ForgeApiMethods = (typeof ForgeApiMethods)[number];
