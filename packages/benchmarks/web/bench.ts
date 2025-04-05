import path from 'node:path';
import { benchmarks } from './utilities/benchmark';
import { writeToMarkdown } from './utilities/writer';

const connections = [64, 256, 512];

for (const connection of connections) {
  const result = await benchmarks(connection);

  await writeToMarkdown(
    path.resolve(__dirname, 'benchmarks'),
    result,
    'bun',
    connection.toString()
  );
}

process.exit(0);
