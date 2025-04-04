# Autocannon Benchmarks

**Runtime**: bun
**Date**: April 4, 2025 04:18:50 PM +07:00
**CPU**: M2
**RAM**: 16384.00 MB
**Connections**: 100
**Duration**: 30 seconds
**Pipelining**: 10

## Results

| Framework | Total Requests | RPS (req/sec) | P50 Latency (ms) | P75 Latency (ms) | P90 Latency (ms) | P99 Latency (ms) | Avg Latency (ms) | Min Latency (ms) | Max Latency (ms) |
| --------- | -------------- | ------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- |
| Ignisia   | 887716.00      | 29580.67      | 53 ms            | 62 ms            | 103 ms           | 124 ms           | 59.65 ms         | 5 ms             | 159 ms           |
| Hono      | 1345204.00     | 44810.26      | 405 ms           | 644 ms           | 1043 ms          | 1827 ms          | 533.56 ms        | 6 ms             | 4927 ms          |
| Bun       | 1391174.00     | 46357.01      | 429 ms           | 697 ms           | 1081 ms          | 1885 ms          | 537.13 ms        | 10 ms            | 5691 ms          |
