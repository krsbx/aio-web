# Autocannon Benchmarks

**Runtime**: bun
**Date**: April 5, 2025 04:59:44 PM +07:00
**CPU**: M2
**RAM**: 16384.00 MB
**Connections**: 100
**Duration**: 30 seconds
**Pipelining**: 10

## Results

| Framework   | Total Requests | RPS (req/sec) | P50 Latency (ms) | P75 Latency (ms) | P90 Latency (ms) | P99 Latency (ms) | Avg Latency (ms) | Min Latency (ms) | Max Latency (ms) |
| ----------- | -------------- | ------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- |
| Ignisia     | 936792.00      | 31215.99      | 1578 ms          | 2328 ms          | 3144 ms          | 4719 ms          | 1717.71 ms       | 13 ms            | 6490 ms          |
| Ignisia-Bun | 1531777.00     | 51042.22      | 585 ms           | 1115 ms          | 1546 ms          | 2588 ms          | 762.66 ms        | 9 ms             | 4506 ms          |
| Hono        | 1300693.00     | 43341.99      | 751 ms           | 1283 ms          | 1867 ms          | 3092 ms          | 929.77 ms        | 12 ms            | 5801 ms          |
| Bun         | 1483389.00     | 49429.82      | 473 ms           | 726 ms           | 1150 ms          | 2041 ms          | 560.79 ms        | 8 ms             | 5659 ms          |
| Elysia      | 11359.00       | 367.72        | 523 ms           | 1449 ms          | 16815 ms         | 19007 ms         | 2524.73 ms       | 45 ms            | 19026 ms         |
