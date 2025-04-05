export function extractPathname(url: string): string {
  const pathStart = url.indexOf('/', url.indexOf('://') + 3);
  const pathname = url.slice(pathStart).split('?')[0]?.replace?.(/\/+$/, '');

  return pathname || '/';
}

export function extractPathParts(req: Request): string[] {
  const url = req.url;
  const start = url.indexOf('/', url.indexOf('://') + 3);

  let end = url.indexOf('?', start);

  if (end === -1) end = url.length;

  const parts: string[] = [];

  let segmentStart = start + 1;

  for (let i = segmentStart; i <= end; i++) {
    if (i === end || url[i] === '/') {
      if (i > segmentStart) {
        parts.push(url.slice(segmentStart, i));
      }
      segmentStart = i + 1;
    }
  }

  return parts;
}
