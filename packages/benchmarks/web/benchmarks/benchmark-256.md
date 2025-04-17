# Autocannon Benchmarks

**Runtime**: bun
**Date**: April 17, 2025 02:36:48 PM +07:00
**CPU**: M2
**RAM**: 16384.00 MB
**Connections**: 256
**Duration**: 30 seconds
**Pipelining**: 10

## Results

| Framework | Total Requests | RPS (req/sec) | Failed Requests | P50 Latency (ms) | P75 Latency (ms) | P90 Latency (ms) | P99 Latency (ms) | Avg Latency (ms) | Min Latency (ms) | Max Latency (ms) |
| --------- | -------------- | ------------- | --------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- |
| Ignisia   | 975016.00      | 32489.70      | 0.00            | 456 ms           | 622 ms           | 1229 ms          | 2177 ms          | 621.15 ms        | 7 ms             | 4473 ms          |
| Hono      | 1323914.00     | 44101.07      | 0.00            | 723 ms           | 1188 ms          | 1658 ms          | 2897 ms          | 888.74 ms        | 8 ms             | 5697 ms          |
| Bun       | 1448783.00     | 48260.59      | 0.00            | 506 ms           | 759 ms           | 1131 ms          | 1824 ms          | 605.35 ms        | 6 ms             | 2433 ms          |
| Elysia    | 6306.00        | 206.28        | 0.00            | 354 ms           | 901 ms           | 1202 ms          | 1977 ms          | 562.45 ms        | 41 ms            | 2503 ms          |
