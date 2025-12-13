import { build } from '@ignisia/utils';

await build(__dirname, {
  buildEsm: true,
  buildCjs: true,
});
