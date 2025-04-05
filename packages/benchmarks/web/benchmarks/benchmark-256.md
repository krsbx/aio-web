# Autocannon Benchmarks

**Runtime**: bun
**Date**: April 5, 2025 06:06:21 PM +07:00
**CPU**: M2
**RAM**: 16384.00 MB
**Connections**: 256
**Duration**: 30 seconds
**Pipelining**: 10

## Results

| Framework   | Total Requests | RPS (req/sec) | Failed Requests | P50 Latency (ms) | P75 Latency (ms) | P90 Latency (ms) | P99 Latency (ms) | Avg Latency (ms) | Min Latency (ms) | Max Latency (ms) |
| ----------- | -------------- | ------------- | --------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- |
| Ignisia     | 980175.00      | 32661.61      | 0.00            | 801 ms           | 1069 ms          | 1504 ms          | 2587 ms          | 872.86 ms        | 7 ms             | 5464 ms          |
| Ignisia-Bun | 973493.00      | 32428.15      | 0.00            | 997 ms           | 1255 ms          | 1746 ms          | 2495 ms          | 1038.41 ms       | 11 ms            | 5319 ms          |
| Hono        | 1341078.00     | 44672.82      | 0.00            | 1099 ms          | 1816 ms          | 2680 ms          | 5304 ms          | 1404.15 ms       | 9 ms             | 14821 ms         |
| Bun         | 1481241.00     | 49341.81      | 0.00            | 558 ms           | 768 ms           | 1092 ms          | 1988 ms          | 641.59 ms        | 6 ms             | 4063 ms          |
| Elysia      | 1360119.00     | 45292.01      | 0.00            | 480 ms           | 645 ms           | 2530 ms          | 5643 ms          | 905.55 ms        | 4 ms             | 11566 ms         |
