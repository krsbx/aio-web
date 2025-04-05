# Autocannon Benchmarks

**Runtime**: bun
**Date**: April 5, 2025 06:03:35 PM +07:00
**CPU**: M2
**RAM**: 16384.00 MB
**Connections**: 64
**Duration**: 30 seconds
**Pipelining**: 10

## Results

| Framework   | Total Requests | RPS (req/sec) | Failed Requests | P50 Latency (ms) | P75 Latency (ms) | P90 Latency (ms) | P99 Latency (ms) | Avg Latency (ms) | Min Latency (ms) | Max Latency (ms) |
| ----------- | -------------- | ------------- | --------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- |
| Ignisia     | 925659.00      | 30845.02      | 0.00            | 83 ms            | 124 ms           | 166 ms           | 188 ms           | 95.69 ms         | 12 ms            | 310 ms           |
| Ignisia-Bun | 936699.00      | 31212.90      | 0.00            | 444 ms           | 470 ms           | 594 ms           | 1587 ms          | 455.24 ms        | 5 ms             | 5678 ms          |
| Hono        | 1282682.00     | 42741.82      | 0.00            | 533 ms           | 837 ms           | 1127 ms          | 1938 ms          | 621.18 ms        | 10 ms            | 5974 ms          |
| Bun         | 1407790.00     | 46910.70      | 0.00            | 191 ms           | 278 ms           | 375 ms           | 898 ms           | 237.24 ms        | 8 ms             | 1914 ms          |
| Elysia      | 50073.00       | 1645.51       | 0.00            | 349 ms           | 748 ms           | 1536 ms          | 3921 ms          | 631.14 ms        | 10 ms            | 14243 ms         |
