# Autocannon Benchmarks

**Runtime**: bun
**Date**: April 17, 2025 02:34:35 PM +07:00
**CPU**: M2
**RAM**: 16384.00 MB
**Connections**: 64
**Duration**: 30 seconds
**Pipelining**: 10

## Results

| Framework | Total Requests | RPS (req/sec) | Failed Requests | P50 Latency (ms) | P75 Latency (ms) | P90 Latency (ms) | P99 Latency (ms) | Avg Latency (ms) | Min Latency (ms) | Max Latency (ms) |
| --------- | -------------- | ------------- | --------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- |
| Ignisia   | 916786.00      | 30549.35      | 0.00            | 84 ms            | 125 ms           | 130 ms           | 169 ms           | 97.33 ms         | 3 ms             | 229 ms           |
| Hono      | 1384672.00     | 46140.35      | 0.00            | 379 ms           | 680 ms           | 871 ms           | 1663 ms          | 497.23 ms        | 6 ms             | 2987 ms          |
| Bun       | 1406362.00     | 46863.11      | 0.00            | 183 ms           | 249 ms           | 415 ms           | 1048 ms          | 221.77 ms        | 4 ms             | 1269 ms          |
| Elysia    | 490166.00      | 16306.25      | 0.00            | 4404 ms          | 6696 ms          | 8188 ms          | 9956 ms          | 3852.49 ms       | 10 ms            | 11840 ms         |
