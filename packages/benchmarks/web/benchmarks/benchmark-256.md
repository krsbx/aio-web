# Autocannon Benchmarks

**Runtime**: bun
**Date**: April 5, 2025 05:45:44 PM +07:00
**CPU**: M2
**RAM**: 16384.00 MB
**Connections**: 256
**Duration**: 30 seconds
**Pipelining**: 10

## Results

| Framework   | Total Requests | RPS (req/sec) | Failed Requests | P50 Latency (ms) | P75 Latency (ms) | P90 Latency (ms) | P99 Latency (ms) | Avg Latency (ms) | Min Latency (ms) | Max Latency (ms) |
| ----------- | -------------- | ------------- | --------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- |
| Ignisia     | 989081.00      | 32958.38      | 0.00            | 1040 ms          | 3620 ms          | 5571 ms          | 10056 ms         | 2279.75 ms       | 17 ms            | 15399 ms         |
| Ignisia-Bun | 988829.00      | 32939.01      | 0.00            | 562 ms           | 1962 ms          | 2730 ms          | 3786 ms          | 1200.29 ms       | 10 ms            | 6906 ms          |
| Hono        | 1314940.00     | 43802.13      | 0.00            | 791 ms           | 1540 ms          | 2179 ms          | 3721 ms          | 1061.53 ms       | 5 ms             | 5999 ms          |
| Bun         | 1450842.00     | 48329.18      | 0.00            | 550 ms           | 825 ms           | 1167 ms          | 2128 ms          | 618.84 ms        | 4 ms             | 2702 ms          |
| Elysia      | 20770.00       | 661.68        | 0.00            | 195 ms           | 1525 ms          | 6015 ms          | 11270 ms         | 1648.03 ms       | 18 ms            | 19117 ms         |
