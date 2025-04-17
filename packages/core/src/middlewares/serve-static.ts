import type { Middleware } from '../router/types';
import { getMimeType } from '../utilities';

interface ServeStaticOptions {
  root: string; // e.g. './public'
  index?: string; // default index file, e.g. 'index.html'
  ignorePatterns?: RegExp[]; // optional: to skip some files like dotfiles
}

export function serveStatic(options: ServeStaticOptions): Middleware {
  const { root, index = 'index.html', ignorePatterns = [] } = options;

  return async (ctx, next) => {
    const reqPath = ctx.req.url.pathname || '/';
    let filePath = `${root}${reqPath}`;

    // If directory, try to serve index.html
    if (filePath.endsWith('/')) {
      filePath += index;
    }

    // Ignore certain patterns (optional)
    for (const pattern of ignorePatterns) {
      if (pattern.test(filePath)) return next();
    }

    try {
      const file = Bun.file(filePath);
      if (!(await file.exists())) {
        return next();
      }

      const contentType = getMimeType(filePath);
      ctx.header('Content-Type', contentType, false);

      return new Response(file);
    } catch {
      return next(); // fallback if file not found or error
    }
  };
}
