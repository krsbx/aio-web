# Autocannon Benchmarks

**Runtime**: bun
**Date**: April 7, 2025 05:41:27 PM +07:00
**CPU**: M2
**RAM**: 16384.00 MB
**Connections**: 256
**Duration**: 30 seconds
**Pipelining**: 10

## Results

| Framework   | Total Requests | RPS (req/sec) | Failed Requests | P50 Latency (ms) | P75 Latency (ms) | P90 Latency (ms) | P99 Latency (ms) | Avg Latency (ms) | Min Latency (ms) | Max Latency (ms) |
| ----------- | -------------- | ------------- | --------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- |
| Ignisia     | 959015.00      | 31956.51      | 0.00            | 1331 ms          | 2130 ms          | 2688 ms          | 4226 ms          | 1498.72 ms       | 12 ms            | 6746 ms          |
| Ignisia-Bun | 1010779.00     | 33681.41      | 0.00            | 1333 ms          | 2004 ms          | 3026 ms          | 5877 ms          | 1557.4 ms        | 18 ms            | 10243 ms         |
| Hono        | 46160.00       | 1507.02       | 0.00            | 345 ms           | 1002 ms          | 2652 ms          | 6142 ms          | 908.16 ms        | 16 ms            | 15495 ms         |
| Bun         | 1441838.00     | 48029.25      | 0.00            | 627 ms           | 885 ms           | 1261 ms          | 2007 ms          | 707.65 ms        | 14 ms            | 3287 ms          |
| Elysia      | 453612.00      | 15015.29      | 0.00            | 12467 ms         | 13631 ms         | 14743 ms         | 16843 ms         | 11128.1 ms       | 16 ms            | 20928 ms         |
