# Autocannon Benchmarks

**Runtime**: bun
**Date**: April 8, 2025 12:51:34 PM +07:00
**CPU**: M2
**RAM**: 16384.00 MB
**Connections**: 512
**Duration**: 30 seconds
**Pipelining**: 10

## Results

| Framework   | Total Requests | RPS (req/sec) | Failed Requests | P50 Latency (ms) | P75 Latency (ms) | P90 Latency (ms) | P99 Latency (ms) | Avg Latency (ms) | Min Latency (ms) | Max Latency (ms) |
| ----------- | -------------- | ------------- | --------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- |
| Ignisia     | 937590.00      | 31242.59      | 0.00            | 2230 ms          | 4294 ms          | 6177 ms          | 11625 ms         | 2856.23 ms       | 26 ms            | 20110 ms         |
| Ignisia-Bun | 797157.00      | 26518.86      | 0.00            | 10091 ms         | 13702 ms         | 18521 ms         | 22911 ms         | 9733.77 ms       | 25 ms            | 25439 ms         |
| Hono        | 30053.00       | 983.09        | 0.00            | 973 ms           | 1563 ms          | 2265 ms          | 4345 ms          | 1187.84 ms       | 19 ms            | 16181 ms         |
| Bun         | 1370207.00     | 45627.94      | 0.00            | 1534 ms          | 2995 ms          | 4568 ms          | 8620 ms          | 2057.34 ms       | 15 ms            | 13126 ms         |
| Elysia      | 548099.00      | 18227.44      | 0.00            | 3270 ms          | 5797 ms          | 7953 ms          | 10314 ms         | 3423.81 ms       | 10 ms            | 13586 ms         |
