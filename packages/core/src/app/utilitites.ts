export function extractPathname(url: string): string {
  const pathStart = url.indexOf('/', url.indexOf('://') + 3);
  const pathname = url.slice(pathStart).split('?')[0]?.replace?.(/\/+$/, '');

  return pathname || '/';
}
