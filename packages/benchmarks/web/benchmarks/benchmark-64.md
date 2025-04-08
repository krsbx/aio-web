# Autocannon Benchmarks

**Runtime**: bun
**Date**: April 8, 2025 12:25:30 PM +07:00
**CPU**: M2
**RAM**: 16384.00 MB
**Connections**: 64
**Duration**: 30 seconds
**Pipelining**: 10

## Results

| Framework   | Total Requests | RPS (req/sec) | Failed Requests | P50 Latency (ms) | P75 Latency (ms) | P90 Latency (ms) | P99 Latency (ms) | Avg Latency (ms) | Min Latency (ms) | Max Latency (ms) |
| ----------- | -------------- | ------------- | --------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- |
| Ignisia     | 903459.00      | 30105.26      | 0.00            | 85 ms            | 126 ms           | 128 ms           | 170 ms           | 95.12 ms         | 11 ms            | 230 ms           |
| Ignisia-Bun | 1056076.00     | 35190.80      | 0.00            | 539 ms           | 761 ms           | 1052 ms          | 2027 ms          | 636.36 ms        | 5 ms             | 4537 ms          |
| Hono        | 1319686.00     | 43974.88      | 0.00            | 533 ms           | 764 ms           | 1056 ms          | 2338 ms          | 638.14 ms        | 12 ms            | 7259 ms          |
| Bun         | 1475961.00     | 49182.31      | 0.00            | 158 ms           | 210 ms           | 371 ms           | 662 ms           | 191.7 ms         | 3 ms             | 1324 ms          |
| Elysia      | 533965.00      | 17722.04      | 0.00            | 2778 ms          | 4604 ms          | 6087 ms          | 9821 ms          | 2773.34 ms       | 6 ms             | 29063 ms         |
