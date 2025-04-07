# Autocannon Benchmarks

**Runtime**: bun
**Date**: April 7, 2025 05:44:12 PM +07:00
**CPU**: M2
**RAM**: 16384.00 MB
**Connections**: 512
**Duration**: 30 seconds
**Pipelining**: 10

## Results

| Framework   | Total Requests | RPS (req/sec) | Failed Requests | P50 Latency (ms) | P75 Latency (ms) | P90 Latency (ms) | P99 Latency (ms) | Avg Latency (ms) | Min Latency (ms) | Max Latency (ms) |
| ----------- | -------------- | ------------- | --------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- |
| Ignisia     | 952253.00      | 31731.19      | 0.00            | 3639 ms          | 5576 ms          | 7783 ms          | 11221 ms         | 3823.69 ms       | 15 ms            | 15377 ms         |
| Ignisia-Bun | 983248.00      | 32742.19      | 0.00            | 2562 ms          | 3744 ms          | 5278 ms          | 8316 ms          | 2677.15 ms       | 13 ms            | 11669 ms         |
| Hono        | 1156245.00     | 38503.00      | 0.00            | 1643 ms          | 2533 ms          | 3656 ms          | 6196 ms          | 1829.59 ms       | 14 ms            | 14379 ms         |
| Bun         | 1447105.00     | 48188.64      | 0.00            | 1097 ms          | 2507 ms          | 3673 ms          | 5705 ms          | 1606.76 ms       | 9 ms             | 9743 ms          |
| Elysia      | 532401.00      | 17570.99      | 0.00            | 3001 ms          | 5445 ms          | 7503 ms          | 10627 ms         | 3498.48 ms       | 14 ms            | 13417 ms         |
