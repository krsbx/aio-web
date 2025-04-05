import autocannon from 'autocannon';
import kill from 'tree-kill-promise';
import { BENCHMARK, FRAMEWORK_PORTS } from './config';
import { loadFramework } from './loader';

export async function benchmark(
  framework: string,
  port: number,
  connections: number = BENCHMARK.CONNECTIONS
) {
  console.log(`Benchmarking ${framework} on port ${port}`);

  const result = await autocannon({
    title: framework,
    url: `http://localhost:${port}`,
    connections: connections,
    duration: BENCHMARK.DURATION,
    pipelining: BENCHMARK.PIPELINING,
  });

  return result;
}

export async function benchmarks(connections: number = BENCHMARK.CONNECTIONS) {
  const results: autocannon.Result[] = [];

  for (const { framework, port } of FRAMEWORK_PORTS) {
    const childProcess = loadFramework(framework.toLowerCase());

    const result = await benchmark(framework, port, connections);

    if (childProcess.pid) kill(childProcess.pid, 'SIGKILL');

    results.push(result);

    console.log();

    // Sleep for 3 seconds
    await Bun.sleep(3000);
  }

  return results;
}
