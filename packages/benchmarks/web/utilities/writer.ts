import autocannon from 'autocannon';
import dayjs from 'dayjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import prettier from 'prettier';
import system from 'systeminformation';
import { BENCHMARK } from './config';

export function constructResult(result: autocannon.Result) {
  return {
    framework: result.title || '',
    total: result.requests.total,
    rps: result.requests.total / result.duration,
    failed: result['4xx'] + result['5xx'],
    latency: {
      p50: result.latency.p50,
      p75: result.latency.p75,
      p90: result.latency.p90,
      p99: result.latency.p99,
      avg: result.latency.average,
      min: result.latency.min,
      max: result.latency.max,
    },
  };
}

export function constructMarkdown(results: autocannon.Result[]) {
  const constructedResults = results.map(constructResult);
  const headers = [
    'Framework',
    'Total Requests',
    'RPS (req/sec)',
    'Failed Requests',
    'P50 Latency (ms)',
    'P75 Latency (ms)',
    'P90 Latency (ms)',
    'P99 Latency (ms)',
    'Avg Latency (ms)',
    'Min Latency (ms)',
    'Max Latency (ms)',
  ];
  const divider = headers.map(() => '---').join(' | ');
  const headerRow = headers.join(' | ');

  const rows = constructedResults.map((result) =>
    [
      result.framework,
      result.total.toFixed(2),
      result.rps.toFixed(2),
      result.failed.toFixed(2),
      `${result.latency.p50} ms`,
      `${result.latency.p75} ms`,
      `${result.latency.p90} ms`,
      `${result.latency.p99} ms`,
      `${result.latency.avg} ms`,
      `${result.latency.min} ms`,
      `${result.latency.max} ms`,
    ].join(' | ')
  );

  return [headerRow, divider, ...rows].join('\n');
}

async function isExists(filePath: string) {
  return Bun.file(filePath).exists();
}

export function prettifyMarkdown(markdown: string) {
  return prettier.format(markdown, { parser: 'markdown' });
}

export async function writeToMarkdown(
  distPath: string,
  results: autocannon.Result[],
  runtime: 'node' | 'bun',
  connections: number = BENCHMARK.CONNECTIONS
) {
  const date = dayjs().format('MMMM D, YYYY hh:mm:ss A Z');
  const markdown = constructMarkdown(results);
  const content = [
    '# Autocannon Benchmarks',
    '',
    `**Runtime**: ${runtime}`,
    `**Date**: ${date}`,
    `**CPU**: ${(await system.cpu()).brand}`,
    `**RAM**: ${((await system.mem()).total / 1024 / 1024).toFixed(2)} MB`,
    `**Connections**: ${connections}`,
    `**Duration**: ${BENCHMARK.DURATION} seconds`,
    `**Pipelining**: ${BENCHMARK.PIPELINING}`,
    '',
    '## Results',
    '',
    markdown,
  ].join('\n');
  const prettifiedMarkdown = await prettifyMarkdown(content);
  const fileName = `benchmark-${connections}.md`;
  const finalPath = path.join(distPath, fileName);

  if (await isExists(finalPath)) {
    await fs.unlink(finalPath);
  }

  await fs.mkdir(distPath, { recursive: true });

  return fs.writeFile(finalPath, prettifiedMarkdown);
}
