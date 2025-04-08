# Autocannon Benchmarks

**Runtime**: bun
**Date**: April 8, 2025 12:46:02 PM +07:00
**CPU**: M2
**RAM**: 16384.00 MB
**Connections**: 64
**Duration**: 30 seconds
**Pipelining**: 10

## Results

| Framework   | Total Requests | RPS (req/sec) | Failed Requests | P50 Latency (ms) | P75 Latency (ms) | P90 Latency (ms) | P99 Latency (ms) | Avg Latency (ms) | Min Latency (ms) | Max Latency (ms) |
| ----------- | -------------- | ------------- | --------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- |
| Ignisia     | 909886.00      | 30319.43      | 0.00            | 84 ms            | 126 ms           | 127 ms           | 170 ms           | 95.42 ms         | 3 ms             | 231 ms           |
| Ignisia-Bun | 1071574.00     | 35707.23      | 0.00            | 479 ms           | 788 ms           | 1024 ms          | 1924 ms          | 604.95 ms        | 11 ms            | 6024 ms          |
| Hono        | 1377329.00     | 45895.67      | 0.00            | 533 ms           | 603 ms           | 688 ms           | 2290 ms          | 524.73 ms        | 8 ms             | 4429 ms          |
| Bun         | 1413758.00     | 47109.56      | 0.00            | 161 ms           | 271 ms           | 378 ms           | 920 ms           | 217.22 ms        | 10 ms            | 1625 ms          |
| Elysia      | 535813.00      | 17842.59      | 0.00            | 3047 ms          | 5682 ms          | 7059 ms          | 9729 ms          | 3147.36 ms       | 15 ms            | 24273 ms         |
