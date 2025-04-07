# Autocannon Benchmarks

**Runtime**: bun
**Date**: April 7, 2025 02:27:46 PM +07:00
**CPU**: M2
**RAM**: 16384.00 MB
**Connections**: 256
**Duration**: 30 seconds
**Pipelining**: 10

## Results

| Framework   | Total Requests | RPS (req/sec) | Failed Requests | P50 Latency (ms) | P75 Latency (ms) | P90 Latency (ms) | P99 Latency (ms) | Avg Latency (ms) | Min Latency (ms) | Max Latency (ms) |
| ----------- | -------------- | ------------- | --------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- |
| Ignisia     | 1013118.00     | 33759.35      | 0.00            | 1146 ms          | 1639 ms          | 2407 ms          | 4288 ms          | 1347.36 ms       | 15 ms            | 5688 ms          |
| Ignisia-Bun | 1008683.00     | 33600.37      | 0.00            | 1084 ms          | 1505 ms          | 2001 ms          | 3842 ms          | 1188.74 ms       | 12 ms            | 5949 ms          |
| Hono        | 1286839.00     | 42880.34      | 0.00            | 981 ms           | 1567 ms          | 2515 ms          | 5253 ms          | 1252.2 ms        | 11 ms            | 9900 ms          |
| Bun         | 1428823.00     | 47579.85      | 0.00            | 732 ms           | 1120 ms          | 1556 ms          | 2855 ms          | 851.72 ms        | 8 ms             | 5664 ms          |
| Elysia      | 12703.00       | 417.31        | 0.00            | 354 ms           | 738 ms           | 1581 ms          | 14314 ms         | 1263.01 ms       | 23 ms            | 14457 ms         |
