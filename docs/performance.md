# Performance & Scalability

SentinelAI is built to handle high-throughput financial data without sacrificing response latency or user experience.

## Backend Performance
1. **Asynchronous Queuing:** By utilizing BullMQ and Redis, the Node.js API Gateway acts purely as an I/O router. It can accept thousands of requests per second and push them to Redis without waiting for the CPU-bound XGBoost inference to finish.
2. **Worker Concurrency:** The BullMQ worker is configured to process multiple jobs concurrently (`concurrency: 10`). This ensures that the queue drains rapidly even during traffic spikes from the Transaction Simulator.

## Frontend Performance
1. **Server-Sent Events (SSE):** SSE is vastly superior to HTTP Long Polling for live dashboards. It maintains a single HTTP connection, eliminating the overhead of repeated TCP handshakes and HTTP headers.
2. **State Management (Zustand):** The Next.js dashboard uses Zustand to manage the live transaction stream. We strictly enforce a sliding window (maximum 100 transactions in state) to prevent browser memory bloat and DOM rendering lag when processing thousands of events.
3. **Optimized React Rendering:** The Recharts visualizations and Live Tables are memoized and decoupled where appropriate to ensure that high-frequency SSE updates do not cause unnecessary re-renders of the entire dashboard layout.

## Database Performance
1. **Prisma Connection Pooling:** Prevents connection exhaustion on the PostgreSQL database during high worker concurrency.
2. **Indexing:** Critical lookups (like querying historical transactions by `status` or `created_at` for the dashboard analytics) are indexed in the Prisma schema to ensure fast reads.
