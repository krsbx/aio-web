# Autocannon Benchmarks

**Runtime**: bun
**Date**: April 7, 2025 02:25:01 PM +07:00
**CPU**: M2
**RAM**: 16384.00 MB
**Connections**: 64
**Duration**: 30 seconds
**Pipelining**: 10

## Results

| Framework   | Total Requests | RPS (req/sec) | Failed Requests | P50 Latency (ms) | P75 Latency (ms) | P90 Latency (ms) | P99 Latency (ms) | Avg Latency (ms) | Min Latency (ms) | Max Latency (ms) |
| ----------- | -------------- | ------------- | --------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- |
| Ignisia     | 942333.00      | 31390.17      | 0.00            | 82 ms            | 123 ms           | 164 ms           | 225 ms           | 101.3 ms         | 5 ms             | 300 ms           |
| Ignisia-Bun | 955357.00      | 31834.62      | 0.00            | 417 ms           | 465 ms           | 617 ms           | 1237 ms          | 421.61 ms        | 10 ms            | 5400 ms          |
| Hono        | 1264342.00     | 42130.69      | 0.00            | 804 ms           | 1230 ms          | 1643 ms          | 2974 ms          | 946.19 ms        | 5 ms             | 8370 ms          |
| Bun         | 1426426.00     | 47531.69      | 0.00            | 239 ms           | 296 ms           | 360 ms           | 696 ms           | 257.06 ms        | 12 ms            | 1002 ms          |
| Elysia      | 30744.00       | 1024.12       | 0.00            | 253 ms           | 365 ms           | 821 ms           | 1617 ms          | 359.93 ms        | 56 ms            | 2994 ms          |
