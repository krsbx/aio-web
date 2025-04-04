import path from 'node:path';
import { benchmarks } from './utilities/benchmark';
import { writeToMarkdown } from './utilities/writer';

benchmarks().then(async (result) => {
  await writeToMarkdown(path.resolve(__dirname, 'benchmarks'), result, 'bun');

  process.exit(0);
});
