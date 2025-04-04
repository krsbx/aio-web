export function joinPaths(...paths: string[]) {
  return (
    paths
      .map((path) => path.replace(/^\/|\/$/g, ''))
      .filter(Boolean)
      .join('/') || '/'
  );
}
