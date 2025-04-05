# Autocannon Benchmarks

**Runtime**: bun
**Date**: April 5, 2025 06:09:08 PM +07:00
**CPU**: M2
**RAM**: 16384.00 MB
**Connections**: 512
**Duration**: 30 seconds
**Pipelining**: 10

## Results

| Framework   | Total Requests | RPS (req/sec) | Failed Requests | P50 Latency (ms) | P75 Latency (ms) | P90 Latency (ms) | P99 Latency (ms) | Avg Latency (ms) | Min Latency (ms) | Max Latency (ms) |
| ----------- | -------------- | ------------- | --------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- |
| Ignisia     | 58352.00       | 1890.25       | 0.00            | 722 ms           | 3349 ms          | 7193 ms          | 12064 ms         | 2337.3 ms        | 12 ms            | 28500 ms         |
| Ignisia-Bun | 923194.00      | 30752.63      | 0.00            | 1630 ms          | 2539 ms          | 3681 ms          | 6701 ms          | 1908.21 ms       | 8 ms             | 18565 ms         |
| Hono        | 1040245.00     | 34651.73      | 0.00            | 6222 ms          | 7545 ms          | 9455 ms          | 12283 ms         | 5478.78 ms       | 11 ms            | 19791 ms         |
| Bun         | 1461752.00     | 48676.39      | 0.00            | 517 ms           | 724 ms           | 870 ms           | 1048 ms          | 535.56 ms        | 16 ms            | 1393 ms          |
| Elysia      | 75750.00       | 2429.44       | 0.00            | 1014 ms          | 1937 ms          | 3164 ms          | 7288 ms          | 1446.99 ms       | 28 ms            | 14823 ms         |
