# Autocannon Benchmarks

**Runtime**: bun
**Date**: April 7, 2025 02:30:32 PM +07:00
**CPU**: M2
**RAM**: 16384.00 MB
**Connections**: 512
**Duration**: 30 seconds
**Pipelining**: 10

## Results

| Framework   | Total Requests | RPS (req/sec) | Failed Requests | P50 Latency (ms) | P75 Latency (ms) | P90 Latency (ms) | P99 Latency (ms) | Avg Latency (ms) | Min Latency (ms) | Max Latency (ms) |
| ----------- | -------------- | ------------- | --------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- |
| Ignisia     | 999134.00      | 33293.37      | 0.00            | 1530 ms          | 2524 ms          | 3298 ms          | 6200 ms          | 1670.95 ms       | 19 ms            | 9594 ms          |
| Ignisia-Bun | 872400.00      | 29031.61      | 0.00            | 2523 ms          | 4585 ms          | 7151 ms          | 10586 ms         | 3164.14 ms       | 23 ms            | 15787 ms         |
| Hono        | 1049864.00     | 34937.24      | 0.00            | 1344 ms          | 2626 ms          | 4178 ms          | 7510 ms          | 1923.99 ms       | 14 ms            | 12108 ms         |
| Bun         | 1473857.00     | 49079.49      | 0.00            | 444 ms           | 596 ms           | 795 ms           | 931 ms           | 444.76 ms        | 15 ms            | 1642 ms          |
| Elysia      | 28672.00       | 934.85        | 0.00            | 549 ms           | 1191 ms          | 1982 ms          | 12637 ms         | 958.82 ms        | 16 ms            | 13888 ms         |
