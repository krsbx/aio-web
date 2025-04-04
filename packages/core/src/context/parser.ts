import { FormValueMap } from './constants';
import type {
  ParsedForm,
  ParsedFormValue,
  ParsedQuery,
  ParsedQueryValue,
} from './types';

function castValue(value: string | File): ParsedFormValue | ParsedQueryValue {
  if (value instanceof File) return value;

  const primitive = FormValueMap[value as keyof typeof FormValueMap];

  if (primitive !== undefined) return primitive;

  const number = +value;

  return !isNaN(number) ? number : value;
}

function assignDeep(obj: ParsedForm, keys: string[], value: ParsedFormValue) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = obj;

  for (let i = 0; i < keys.length; i++) {
    const rawKey = keys[i];
    const isArray = rawKey.endsWith('[]');
    const key = isArray ? rawKey.slice(0, -2) : rawKey;
    const isLast = i === keys.length - 1;

    if (isLast) {
      if (isArray) {
        if (!Array.isArray(current[key])) current[key] = [];
        current[key].push(value);
      } else {
        current[key] = value;
      }
    } else {
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }
  }
}

function parsePath(key: string): string[] {
  const path: string[] = [];
  let buffer = '';

  for (let i = 0; i < key.length; i++) {
    const char = key[i];
    if (char === '[' || char === ']') {
      if (buffer) {
        path.push(buffer);
        buffer = '';
      }
    } else {
      buffer += char;
    }
  }

  if (buffer) path.push(buffer);

  return path;
}

export function parseFormData(form: FormData): ParsedForm {
  const result: ParsedForm = {};

  for (const [key, value] of form.entries()) {
    assignDeep(result, parsePath(key), castValue(value));
  }

  return result;
}

export function parseQuery(query: URLSearchParams): ParsedQuery {
  const result: ParsedQuery = {};

  for (const [key, value] of query.entries()) {
    assignDeep(result, parsePath(key), castValue(value));
  }

  return result;
}

export function parseCookies(
  cookieHeader: string | null
): Record<string, string> {
  const cookies: Record<string, string> = {};

  if (!cookieHeader) return cookies;

  for (const cookie of cookieHeader.split(';')) {
    const [key, value] = cookie.trim().split('=');

    if (key && value !== undefined) {
      cookies[key] = decodeURIComponent(value);
    }
  }

  return cookies;
}
