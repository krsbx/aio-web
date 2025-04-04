# Autocannon Benchmarks

**Runtime**: bun
**Date**: April 4, 2025 05:10:46 PM +07:00
**CPU**: M2
**RAM**: 16384.00 MB
**Connections**: 100
**Duration**: 30 seconds
**Pipelining**: 10

## Results

| Framework | Total Requests | RPS (req/sec) | P50 Latency (ms) | P75 Latency (ms) | P90 Latency (ms) | P99 Latency (ms) | Avg Latency (ms) | Min Latency (ms) | Max Latency (ms) |
| --------- | -------------- | ------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- |
| Ignisia   | 928373.00      | 30925.15      | 31 ms            | 35 ms            | 93 ms            | 111 ms           | 43.08 ms         | 6 ms             | 229 ms           |
| Hono      | 1267747.00     | 42230.08      | 476 ms           | 934 ms           | 1757 ms          | 3869 ms          | 756.57 ms        | 18 ms            | 8318 ms          |
| Bun       | 1467198.00     | 48890.30      | 255 ms           | 314 ms           | 435 ms           | 703 ms           | 250.22 ms        | 9 ms             | 2920 ms          |
| Elysia    | 22247.00       | 715.57        | 422 ms           | 2464 ms          | 7471 ms          | 8287 ms          | 2158.04 ms       | 18 ms            | 15330 ms         |
