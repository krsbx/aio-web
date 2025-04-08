# Autocannon Benchmarks

**Runtime**: bun
**Date**: April 8, 2025 12:28:16 PM +07:00
**CPU**: M2
**RAM**: 16384.00 MB
**Connections**: 256
**Duration**: 30 seconds
**Pipelining**: 10

## Results

| Framework   | Total Requests | RPS (req/sec) | Failed Requests | P50 Latency (ms) | P75 Latency (ms) | P90 Latency (ms) | P99 Latency (ms) | Avg Latency (ms) | Min Latency (ms) | Max Latency (ms) |
| ----------- | -------------- | ------------- | --------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- |
| Ignisia     | 904423.00      | 30137.39      | 0.00            | 1148 ms          | 1716 ms          | 2129 ms          | 3942 ms          | 1305.68 ms       | 17 ms            | 6592 ms          |
| Ignisia-Bun | 977875.00      | 32584.97      | 0.00            | 1237 ms          | 1526 ms          | 1774 ms          | 2831 ms          | 1227.29 ms       | 13 ms            | 5829 ms          |
| Hono        | 1342879.00     | 44747.72      | 0.00            | 596 ms           | 937 ms           | 1423 ms          | 2480 ms          | 737.06 ms        | 9 ms             | 5540 ms          |
| Bun         | 1472338.00     | 49045.24      | 0.00            | 456 ms           | 703 ms           | 941 ms           | 1557 ms          | 508.34 ms        | 5 ms             | 4400 ms          |
| Elysia      | 74975.00       | 2440.59       | 0.00            | 206 ms           | 225 ms           | 253 ms           | 9614 ms          | 529.09 ms        | 35 ms            | 16061 ms         |
