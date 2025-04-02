import { $ } from 'bun';

const builds = (await $`find packages -type d -name dist`.text())
  .trim()
  .split('\n');

const hasBuild = builds.length > 0;

if (hasBuild) {
  await $`rm -rf packages/*/dist`;
}
