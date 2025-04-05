# Autocannon Benchmarks

**Runtime**: bun
**Date**: April 5, 2025 05:02:29 PM +07:00
**CPU**: M2
**RAM**: 16384.00 MB
**Connections**: 100
**Duration**: 30 seconds
**Pipelining**: 10

## Results

| Framework   | Total Requests | RPS (req/sec) | P50 Latency (ms) | P75 Latency (ms) | P90 Latency (ms) | P99 Latency (ms) | Avg Latency (ms) | Min Latency (ms) | Max Latency (ms) |
| ----------- | -------------- | ------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- |
| Ignisia     | 909786.00      | 30316.09      | 1572 ms          | 2109 ms          | 2616 ms          | 4159 ms          | 1612.17 ms       | 11 ms            | 8482 ms          |
| Ignisia-Bun | 1210898.00     | 40255.92      | 2665 ms          | 6601 ms          | 9963 ms          | 13940 ms         | 3993.52 ms       | 9 ms             | 16972 ms         |
| Hono        | 1231094.00     | 40927.33      | 1133 ms          | 3296 ms          | 5791 ms          | 11321 ms         | 2267.09 ms       | 16 ms            | 16951 ms         |
| Bun         | 1485010.00     | 49450.88      | 393 ms           | 558 ms           | 704 ms           | 908 ms           | 411.4 ms         | 15 ms            | 1209 ms          |
| Elysia      | 712183.00      | 23715.72      | 11106 ms         | 13877 ms         | 15049 ms         | 19063 ms         | 10619.29 ms      | 19 ms            | 22609 ms         |
