# Autocannon Benchmarks

**Runtime**: bun
**Date**: April 8, 2025 12:31:01 PM +07:00
**CPU**: M2
**RAM**: 16384.00 MB
**Connections**: 512
**Duration**: 30 seconds
**Pipelining**: 10

## Results

| Framework   | Total Requests | RPS (req/sec) | Failed Requests | P50 Latency (ms) | P75 Latency (ms) | P90 Latency (ms) | P99 Latency (ms) | Avg Latency (ms) | Min Latency (ms) | Max Latency (ms) |
| ----------- | -------------- | ------------- | --------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- |
| Ignisia     | 965813.00      | 32183.04      | 0.00            | 1735 ms          | 2617 ms          | 3639 ms          | 5673 ms          | 1853.69 ms       | 1 ms             | 14363 ms         |
| Ignisia-Bun | 932893.00      | 31075.72      | 0.00            | 6288 ms          | 9498 ms          | 12969 ms         | 17143 ms         | 6560.56 ms       | 12 ms            | 25195 ms         |
| Hono        | 559731.00      | 18577.20      | 0.00            | 3082 ms          | 5053 ms          | 6536 ms          | 9716 ms          | 3177.25 ms       | 18 ms            | 24030 ms         |
| Bun         | 1384344.00     | 46098.70      | 0.00            | 797 ms           | 1113 ms          | 1848 ms          | 3441 ms          | 950.09 ms        | 14 ms            | 5596 ms          |
| Elysia      | 520321.00      | 17280.67      | 0.00            | 3050 ms          | 5411 ms          | 7206 ms          | 9821 ms          | 3297.66 ms       | 12 ms            | 11433 ms         |
