export function deepClone<T>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item)) as unknown as T;
  }

  if (obj && typeof obj === 'object') {
    const clonedObj = {} as T;

    for (const key in obj) {
      clonedObj[key] = deepClone(obj[key]);
    }
    return clonedObj;
  }

  return obj;
}
