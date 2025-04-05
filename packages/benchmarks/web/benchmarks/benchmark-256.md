# Autocannon Benchmarks

**Runtime**: bun
**Date**: April 5, 2025 02:44:16 PM +07:00
**CPU**: M2
**RAM**: 16384.00 MB
**Connections**: 100
**Duration**: 30 seconds
**Pipelining**: 10

## Results

| Framework   | Total Requests | RPS (req/sec) | P50 Latency (ms) | P75 Latency (ms) | P90 Latency (ms) | P99 Latency (ms) | Avg Latency (ms) | Min Latency (ms) | Max Latency (ms) |
| ----------- | -------------- | ------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- |
| Ignisia     | 940790.00      | 31349.22      | 1486 ms          | 2096 ms          | 3010 ms          | 4185 ms          | 1625.76 ms       | 17 ms            | 7165 ms          |
| Ignisia-Bun | 1002426.00     | 33403.07      | 1037 ms          | 1514 ms          | 2032 ms          | 3606 ms          | 1173.1 ms        | 16 ms            | 6558 ms          |
| Hono        | 1328429.00     | 44251.47      | 644 ms           | 860 ms           | 1147 ms          | 1886 ms          | 703.27 ms        | 11 ms            | 5712 ms          |
| Bun         | 1531355.00     | 51028.16      | 505 ms           | 629 ms           | 936 ms           | 1930 ms          | 544.88 ms        | 4 ms             | 3494 ms          |
| Elysia      | 86332.00       | 2788.50       | 1500 ms          | 2598 ms          | 4055 ms          | 7102 ms          | 1921.95 ms       | 18 ms            | 15085 ms         |
