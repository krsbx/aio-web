# Autocannon Benchmarks

**Runtime**: bun
**Date**: April 5, 2025 02:47:03 PM +07:00
**CPU**: M2
**RAM**: 16384.00 MB
**Connections**: 100
**Duration**: 30 seconds
**Pipelining**: 10

## Results

| Framework   | Total Requests | RPS (req/sec) | P50 Latency (ms) | P75 Latency (ms) | P90 Latency (ms) | P99 Latency (ms) | Avg Latency (ms) | Min Latency (ms) | Max Latency (ms) |
| ----------- | -------------- | ------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- |
| Ignisia     | 932175.00      | 31062.15      | 844 ms           | 2281 ms          | 3365 ms          | 10831 ms         | 1557.76 ms       | 1 ms             | 16522 ms         |
| Ignisia-Bun | 1019364.00     | 33967.48      | 1398 ms          | 2180 ms          | 3493 ms          | 10112 ms         | 1803.68 ms       | 1 ms             | 17293 ms         |
| Hono        | 151125.00      | 4864.02       | 1251 ms          | 2375 ms          | 5932 ms          | 13342 ms         | 2125.52 ms       | 10 ms            | 28777 ms         |
| Bun         | 1396734.00     | 46511.29      | 348 ms           | 470 ms           | 560 ms           | 702 ms           | 359.11 ms        | 7 ms             | 4245 ms          |
| Elysia      | 467211.00      | 15333.48      | 3387 ms          | 4335 ms          | 5096 ms          | 6663 ms          | 3556.43 ms       | 17 ms            | 14449 ms         |
