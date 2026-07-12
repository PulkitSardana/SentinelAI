# Backend Engineering

The SentinelAI backend is written in TypeScript on top of Node.js and Express. It serves as the orchestration layer between the external world (clients, simulators), the database, and the Machine Learning inference engine.

## API Gateway Pattern

The Express application acts as an API Gateway. It does not perform heavy computation itself; instead, it handles:
1. **Authentication & Authorization** (Stubbed for demo purposes, ready for JWT integration).
2. **Request Validation** using Zod schemas to ensure malformed transactions are rejected before they reach the queue.
3. **Routing** to internal microservices or database queries.

## Event-Driven Asynchronous Processing

To guarantee high availability, the `/ingest` route does not wait for the ML Service to respond. 

**Workflow:**
1. Transaction arrives at `POST /api/v1/transactions/ingest`.
2. Zod validates the schema.
3. The payload is pushed to Redis via BullMQ (`transactionQueue.add()`).
4. Express immediately responds with `202 Accepted`.

This pattern ensures that if the ML Service experiences a massive latency spike (e.g., model reloading or traffic surge), the API Gateway will not block connections or timeout. The transactions simply buffer in Redis.

## Streaming via Server-Sent Events (SSE)

Real-time capabilities are achieved using Server-Sent Events rather than WebSockets.
When the BullMQ worker completes a job, it inserts the record into PostgreSQL and emits an internal Node.js event:

```typescript
eventEmitter.emit('new_transaction', savedTransaction);
```

The SSE endpoint (`GET /api/v1/transactions/stream`) maintains open HTTP connections to the Next.js frontend clients and pipes these events down the wire instantly.

## Standardized Error Handling

All API errors are processed through a global error-handling middleware (`error.middleware.ts`). This ensures every error returned by the API strictly adheres to this structure:

```json
{
  "status": "error",
  "code": 400,
  "message": "Invalid transaction payload",
  "timestamp": "2026-07-12T18:00:00Z",
  "requestId": "req-12345"
}
```
This predictability is essential for enterprise frontend consumers and MLOps monitoring tools.
