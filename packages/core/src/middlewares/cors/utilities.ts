import type { CorsOrigins } from './types';

export function resolveOrigin(
  allowedOrigins: CorsOrigins,
  reqOrigin: string | null
) {
  if (typeof allowedOrigins === 'function') {
    return allowedOrigins(reqOrigin);
  }

  if (Array.isArray(allowedOrigins)) {
    return allowedOrigins.includes(reqOrigin || '') ? reqOrigin || '' : false;
  }

  return allowedOrigins || '*';
}
