import { $ } from 'bun';

const prerequisites = ['packages/utils'];

const parallels = ['packages/encryption', 'packages/nosql', 'packages/sql'];

const series = ['packages/securedb'];

function build(path: string) {
  console.log(`\x1b[33mBuilding ${path}...\x1b[0m`);

  return $`cd ${path} && bun run build`.quiet();
}

console.log('\x1b[34mBuilding pre-requisites...\x1b[0m\n');

for (const dir of prerequisites) {
  await build(dir);
}

console.log('\x1b[32m\nPre-requisites built.\x1b[0m');

console.log('\n\x1b[34mBuilding in parallel...\x1b[0m\n');

await Promise.all(parallels.map(build));

console.log('\x1b[32m\nParallel built.\x1b[0m');

console.log('\n\x1b[34mBuilding in series...\x1b[0m\n');

for (const dir of series) {
  await build(dir);
}

console.log('\x1b[32m\nSeries built.\x1b[0m');
