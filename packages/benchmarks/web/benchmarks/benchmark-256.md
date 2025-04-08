# Autocannon Benchmarks

**Runtime**: bun
**Date**: April 8, 2025 12:48:48 PM +07:00
**CPU**: M2
**RAM**: 16384.00 MB
**Connections**: 256
**Duration**: 30 seconds
**Pipelining**: 10

## Results

| Framework   | Total Requests | RPS (req/sec) | Failed Requests | P50 Latency (ms) | P75 Latency (ms) | P90 Latency (ms) | P99 Latency (ms) | Avg Latency (ms) | Min Latency (ms) | Max Latency (ms) |
| ----------- | -------------- | ------------- | --------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- |
| Ignisia     | 940955.00      | 31354.72      | 0.00            | 1450 ms          | 2729 ms          | 4007 ms          | 6904 ms          | 1937.12 ms       | 14 ms            | 12196 ms         |
| Ignisia-Bun | 1001763.00     | 33369.85      | 0.00            | 1104 ms          | 1418 ms          | 1805 ms          | 3703 ms          | 1117.7 ms        | 15 ms            | 5540 ms          |
| Hono        | 1318356.00     | 43915.92      | 0.00            | 909 ms           | 1260 ms          | 1823 ms          | 3088 ms          | 1022.92 ms       | 10 ms            | 5765 ms          |
| Bun         | 1409658.00     | 46957.30      | 0.00            | 710 ms           | 994 ms           | 1446 ms          | 2774 ms          | 806.92 ms        | 15 ms            | 5749 ms          |
| Elysia      | 38833.00       | 1279.51       | 0.00            | 139 ms           | 1129 ms          | 5071 ms          | 10160 ms         | 1349.36 ms       | 13 ms            | 18552 ms         |
