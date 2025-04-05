# Autocannon Benchmarks

**Runtime**: bun
**Date**: April 5, 2025 05:42:58 PM +07:00
**CPU**: M2
**RAM**: 16384.00 MB
**Connections**: 64
**Duration**: 30 seconds
**Pipelining**: 10

## Results

| Framework   | Total Requests | RPS (req/sec) | Failed Requests | P50 Latency (ms) | P75 Latency (ms) | P90 Latency (ms) | P99 Latency (ms) | Avg Latency (ms) | Min Latency (ms) | Max Latency (ms) |
| ----------- | -------------- | ------------- | --------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- |
| Ignisia     | 922796.00      | 30749.62      | 0.00            | 83 ms            | 124 ms           | 136 ms           | 166 ms           | 96.35 ms         | 6 ms             | 229 ms           |
| Ignisia-Bun | 941838.00      | 31384.14      | 0.00            | 366 ms           | 471 ms           | 826 ms           | 2557 ms          | 480.62 ms        | 7 ms             | 6587 ms          |
| Hono        | 1448323.00     | 48261.35      | 0.00            | 460 ms           | 635 ms           | 924 ms           | 2290 ms          | 522.99 ms        | 9 ms             | 2813 ms          |
| Bun         | 1538795.00     | 51276.07      | 0.00            | 193 ms           | 244 ms           | 349 ms           | 779 ms           | 215.12 ms        | 5 ms             | 1862 ms          |
| Elysia      | 8240.00        | 270.52        | 0.00            | 808 ms           | 1356 ms          | 2061 ms          | 16442 ms         | 2124.73 ms       | 134 ms           | 16559 ms         |
