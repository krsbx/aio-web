export function joinPaths(...paths: string[]) {
  return paths
    .map((p) => p.replace(/(^\/+|\/+$)/g, '')) // trim slashes
    .filter(Boolean)
    .join('/')
    .replace(/^/, '/');
}

export function extractPathname(url: string): string {
  const pathStart = url.indexOf('/', url.indexOf('://') + 3);
  const pathname = url.slice(pathStart).split('?')[0]?.replace?.(/\/+$/, '');

  return pathname || '/';
}

export function extractPathPartsForRegister(path: string): string[] {
  const parts: string[] = [];

  let segmentStart = 1;

  for (let i = segmentStart; i <= path.length; i++) {
    if (i === path.length || path[i] === '/') {
      if (i > segmentStart) {
        parts.push(path.slice(segmentStart, i));
      }

      segmentStart = i + 1;
    }
  }

  return parts;
}

export function extractRegisteredPathParts(url: string) {
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

export function generateHeaderEntries(
  headers: Record<string, string[]>
): [string, string][] {
  const entries: [string, string][] = [];

  for (const key in headers) {
    const values = headers[key];

    for (let i = 0; i < values.length; i++) {
      entries.push([key, values[i]]);
    }
  }

  return entries;
}

export function getMimeType(filePath: string) {
  return Bun.file(filePath).type || 'application/octet-stream';
}
