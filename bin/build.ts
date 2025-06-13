import { $ } from 'bun';

const prerequisites = ['packages/utils'];

const parallels = [
  'packages/encryption',
  'packages/nosql',
  'packages/sql',
  'packages/core',
  'packages/cli-core',
];

const series = ['packages/securedb'];

function logBuild(dir: string | string[]) {
  const dirs = (Array.isArray(dir) ? dir : [dir]).map((dir) =>
    dir.replace('packages/', '')
  );

  const dirCount = dirs.length;

  if (dirCount === 1) {
    console.log(`\x1b[33mBuilding packages/${dirs[0]}...\x1b[0m`);
    return;
  }

  console.log(`\x1b[33mBuilding packages/{${dirs.join(', ')}}...\x1b[0m`);
}

function build(path: string) {
  return $`cd ${path} && bun run build`.quiet();
}

async function buildAll(
  dirs: string[],
  mode: 'series' | 'parallel',
  context: string
) {
  console.log(`\x1b[34mBuilding ${context}...\x1b[0m\n`);

  logBuild(dirs);

  if (mode === 'series') {
    for (const dir of dirs) {
      await build(dir);
    }
  } else {
    await Promise.all(dirs.map(build));
  }

  console.log(
    `\x1b[32m\n${context[0].toUpperCase() + context.slice(1)} built.\x1b[0m\n`
  );
}

await buildAll(prerequisites, 'series', 'pre-requisites');
await buildAll(parallels, 'parallel', 'parallel');
await buildAll(series, 'series', 'series');
