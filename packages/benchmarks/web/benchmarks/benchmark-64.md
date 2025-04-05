# Autocannon Benchmarks

**Runtime**: bun
**Date**: April 5, 2025 04:56:58 PM +07:00
**CPU**: M2
**RAM**: 16384.00 MB
**Connections**: 100
**Duration**: 30 seconds
**Pipelining**: 10

## Results

| Framework   | Total Requests | RPS (req/sec) | P50 Latency (ms) | P75 Latency (ms) | P90 Latency (ms) | P99 Latency (ms) | Avg Latency (ms) | Min Latency (ms) | Max Latency (ms) |
| ----------- | -------------- | ------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- |
| Ignisia     | 931083.00      | 31025.76      | 47 ms            | 65 ms            | 91 ms            | 117 ms           | 57.4 ms          | 6 ms             | 155 ms           |
| Ignisia-Bun | 1684101.00     | 56117.99      | 244 ms           | 333 ms           | 464 ms           | 705 ms           | 266.59 ms        | 8 ms             | 3611 ms          |
| Hono        | 1290608.00     | 43005.93      | 770 ms           | 1055 ms          | 1461 ms          | 2053 ms          | 791.67 ms        | 2 ms             | 6409 ms          |
| Bun         | 1593302.00     | 53092.37      | 147 ms           | 220 ms           | 241 ms           | 342 ms           | 173.48 ms        | 7 ms             | 695 ms           |
| Elysia      | 40791.00       | 1331.30       | 3385 ms          | 5595 ms          | 7666 ms          | 15664 ms         | 3571.94 ms       | 111 ms           | 16773 ms         |
