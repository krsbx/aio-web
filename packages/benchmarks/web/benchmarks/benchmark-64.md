# Autocannon Benchmarks

**Runtime**: bun
**Date**: April 5, 2025 02:41:30 PM +07:00
**CPU**: M2
**RAM**: 16384.00 MB
**Connections**: 100
**Duration**: 30 seconds
**Pipelining**: 10

## Results

| Framework   | Total Requests | RPS (req/sec) | P50 Latency (ms) | P75 Latency (ms) | P90 Latency (ms) | P99 Latency (ms) | Avg Latency (ms) | Min Latency (ms) | Max Latency (ms) |
| ----------- | -------------- | ------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- |
| Ignisia     | 901248.00      | 30031.59      | 85 ms            | 126 ms           | 145 ms           | 174 ms           | 98.98 ms         | 12 ms            | 260 ms           |
| Ignisia-Bun | 899893.00      | 29986.44      | 344 ms           | 400 ms           | 553 ms           | 1050 ms          | 354.36 ms        | 5 ms             | 2708 ms          |
| Hono        | 1237955.00     | 41251.42      | 720 ms           | 1914 ms          | 2582 ms          | 4273 ms          | 1252.65 ms       | 13 ms            | 7465 ms          |
| Bun         | 1425828.00     | 47511.76      | 184 ms           | 238 ms           | 278 ms           | 372 ms           | 179.2 ms         | 8 ms             | 687 ms           |
| Elysia      | 1165126.00     | 38811.66      | 7143 ms          | 9697 ms          | 12125 ms         | 15827 ms         | 6742.5 ms        | 17 ms            | 21082 ms         |
