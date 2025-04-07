# Autocannon Benchmarks

**Runtime**: bun
**Date**: April 7, 2025 05:38:41 PM +07:00
**CPU**: M2
**RAM**: 16384.00 MB
**Connections**: 64
**Duration**: 30 seconds
**Pipelining**: 10

## Results

| Framework   | Total Requests | RPS (req/sec) | Failed Requests | P50 Latency (ms) | P75 Latency (ms) | P90 Latency (ms) | P99 Latency (ms) | Avg Latency (ms) | Min Latency (ms) | Max Latency (ms) |
| ----------- | -------------- | ------------- | --------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- |
| Ignisia     | 935853.00      | 31184.71      | 0.00            | 82 ms            | 123 ms           | 125 ms           | 166 ms           | 94.02 ms         | 11 ms            | 224 ms           |
| Ignisia-Bun | 990651.00      | 33010.70      | 0.00            | 1159 ms          | 1656 ms          | 2249 ms          | 3657 ms          | 1166.71 ms       | 14 ms            | 5214 ms          |
| Hono        | 1347402.00     | 44898.43      | 0.00            | 579 ms           | 991 ms           | 1409 ms          | 2810 ms          | 756.91 ms        | 8 ms             | 5617 ms          |
| Bun         | 1553492.00     | 51765.81      | 0.00            | 407 ms           | 461 ms           | 607 ms           | 777 ms           | 382.37 ms        | 7 ms             | 2310 ms          |
| Elysia      | 35723.00       | 1170.48       | 0.00            | 295 ms           | 485 ms           | 1240 ms          | 5615 ms          | 677.6 ms         | 17 ms            | 14236 ms         |
