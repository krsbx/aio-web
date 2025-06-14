import { build } from './src';

await build(__dirname, {
  buildCjs: true,
  buildEsm: true,
});
