export const ApiMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  OPTIONS: 'OPTIONS',
} as const;

export type ApiMethod = (typeof ApiMethod)[keyof typeof ApiMethod];

export const ApiMethods = Object.values(ApiMethod);
