# AI Coding Guidelines for aio-web (Ignisia)

## Architecture Overview

This is a Bun-based monorepo providing all-in-one web development tooling. Key packages:

- `ignisia`: Web framework using Bun's HTTP/WebSocket servers
- `sql`: Query builders for SQL databases (SQLite, MySQL, PostgreSQL)
- `nosql`: Query builder for SQLite mimicking NoSQL behavior
- `securedb`: Encrypted SQLite wrapper for `sql` and `nosql`
- `replica`: Replication mechanism for `sql`, `nosql`, and `securedb`
- `encryption`: Crypto utilities
- `benchmarks`: Performance comparisons across runtimes (Bun, Deno, Hono, Elysia)

Packages are interdependent; e.g., `securedb` extends `sql`/`nosql` with encryption.

## Developer Workflows

- **Build**: Run `bun run build` from root to build all packages in series (utils → cli-core → encryption → nosql → sql → ignisia → securedb). Each package's `build.ts` uses `@ignisia/utils/build` to generate ESM/CJS outputs.
- **Run**: Use `bun run` for scripts; benchmarks export `{fetch, port}` config for runtime-specific serving (e.g., `Bun.serve` for Bun, `Deno.serve` for Deno).
- **Debug**: No custom debug setup; rely on Bun's built-in tools.

## Conventions & Patterns

- **Structure**: Each package has `src/`, `build.ts`, `package.json`, `README.md`, `tsconfig.json`. Exports from `src/index.ts`.
- **Modules**: ES modules only; use `import`/`export`.
- **Web Framework**: Routes use `app.get/post/etc.` with context (`ctx`) for request/response. Middlewares via `app.use()` or per-route arrays.
- **Databases**: SQLite-based; query builders return SQL strings, not executed queries. Use Bun's SQLite API for execution.
- **Benchmarks**: Frameworks export `config = {fetch: app.fetch, port}`; runners handle serving (e.g., separate `deno-runner.ts` for Deno compatibility).
- **Errors**: Throw/custom responses; no global error handler by default.

## Integration Points

- **Bun APIs**: Heavy reliance on Bun's `serve`, `file()`, `sqlite` (not Node.js equivalents).
- **Dependencies**: Minimal; crypto via Web Crypto API, no external DB drivers.
- **Cross-Package**: Import via relative paths (e.g., `../../../ignisia/src`); build ensures correct resolution.

Reference: [packages/ignisia/src/app/index.ts](packages/ignisia/src/app/index.ts) for framework core; [bin/build.ts](bin/build.ts) for build orchestration.
