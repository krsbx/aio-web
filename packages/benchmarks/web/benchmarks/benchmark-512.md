# Autocannon Benchmarks

**Runtime**: bun
**Date**: April 17, 2025 02:39:00 PM +07:00
**CPU**: M2
**RAM**: 16384.00 MB
**Connections**: 512
**Duration**: 30 seconds
**Pipelining**: 10

## Results

| Framework | Total Requests | RPS (req/sec) | Failed Requests | P50 Latency (ms) | P75 Latency (ms) | P90 Latency (ms) | P99 Latency (ms) | Avg Latency (ms) | Min Latency (ms) | Max Latency (ms) |
| --------- | -------------- | ------------- | --------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- |
| Ignisia   | 916868.00      | 30541.91      | 0.00            | 2517 ms          | 3298 ms          | 4102 ms          | 5600 ms          | 2366.92 ms       | 20 ms            | 8541 ms          |
| Hono      | 1247137.00     | 41529.70      | 0.00            | 2439 ms          | 3772 ms          | 5025 ms          | 7098 ms          | 2553.87 ms       | 4 ms             | 12637 ms         |
| Bun       | 1321525.00     | 44021.49      | 0.00            | 776 ms           | 1291 ms          | 1443 ms          | 1745 ms          | 829.36 ms        | 15 ms            | 2225 ms          |
| Elysia    | 20330.00       | 667.21        | 0.00            | 569 ms           | 975 ms           | 1445 ms          | 3988 ms          | 821.66 ms        | 26 ms            | 14373 ms         |
