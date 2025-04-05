# Autocannon Benchmarks

**Runtime**: bun
**Date**: April 5, 2025 05:48:30 PM +07:00
**CPU**: M2
**RAM**: 16384.00 MB
**Connections**: 512
**Duration**: 30 seconds
**Pipelining**: 10

## Results

| Framework   | Total Requests | RPS (req/sec) | Failed Requests | P50 Latency (ms) | P75 Latency (ms) | P90 Latency (ms) | P99 Latency (ms) | Avg Latency (ms) | Min Latency (ms) | Max Latency (ms) |
| ----------- | -------------- | ------------- | --------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- |
| Ignisia     | 929058.00      | 30958.28      | 0.00            | 557 ms           | 806 ms           | 980 ms           | 5111 ms          | 685.03 ms        | 1 ms             | 13781 ms         |
| Ignisia-Bun | 791369.00      | 26361.39      | 0.00            | 4757 ms          | 8275 ms          | 11068 ms         | 15824 ms         | 5176.25 ms       | 20 ms            | 23103 ms         |
| Hono        | 509804.00      | 16858.60      | 0.00            | 6253 ms          | 7978 ms          | 9585 ms          | 12389 ms         | 6167.65 ms       | 23 ms            | 23081 ms         |
| Bun         | 1502209.00     | 50040.27      | 0.00            | 1886 ms          | 3009 ms          | 4082 ms          | 6598 ms          | 2108.85 ms       | 1 ms             | 15173 ms         |
| Elysia      | 10070.00       | 331.14        | 0.00            | 590 ms           | 2280 ms          | 5445 ms          | 11883 ms         | 1827.08 ms       | 19 ms            | 19333 ms         |
