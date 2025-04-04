# Autocannon Benchmarks

**Runtime**: bun
**Date**: April 4, 2025 02:24:41 PM +07:00
**CPU**: M2
**RAM**: 16384.00 MB
**Connections**: 100
**Duration**: 30 seconds
**Pipelining**: 10

## Results

| Framework | Total Requests | RPS (req/sec) | P50 Latency (ms) | P75 Latency (ms) | P90 Latency (ms) | P99 Latency (ms) | Avg Latency (ms) | Min Latency (ms) | Max Latency (ms) |
| --------- | -------------- | ------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- |
| Ignisia   | 463655.00      | 15434.59      | 77 ms            | 86 ms            | 120 ms           | 205 ms           | 82.28 ms         | 18 ms            | 563 ms           |
| Hono      | 664223.00      | 22089.23      | 271 ms           | 351 ms           | 429 ms           | 748 ms           | 276.59 ms        | 10 ms            | 2478 ms          |
| Bun       | 772145.00      | 25669.71      | 147 ms           | 229 ms           | 288 ms           | 476 ms           | 172.85 ms        | 6 ms             | 2161 ms          |
