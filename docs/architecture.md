# System Architecture

SentinelAI is built upon a distributed, microservices-oriented architecture designed to handle high-throughput financial data while performing computationally expensive Machine Learning inference without blocking the main event loop.

## High-Level Topology

The system comprises five core internal components and one external simulation node:

1. **Transaction Simulator (Python):** A synthetic data generator acting as the upstream payment gateway.
2. **API Gateway (Node.js/Express):** The entry point for the frontend UI and incoming data. It handles routing, authorization, and streaming.
3. **Message Queue (Redis / BullMQ):** A high-performance buffer between ingestion and processing.
4. **Machine Learning Service (Python/FastAPI):** A dedicated microservice exposing the XGBoost inference engine and SHAP explainer over HTTP.
5. **Database (PostgreSQL / Prisma):** The source of truth for transaction logs, audit trails, and model registry metadata.
6. **Frontend Dashboard (Next.js):** The enterprise user interface.

---

## Architectural Flow

### 1. Ingestion Phase
When a transaction occurs, the simulator sends a `POST /api/v1/ingest` request to the Node.js API Gateway. To ensure the API remains responsive during traffic spikes, the gateway **does not** process the transaction synchronously. Instead, it places the payload into a Redis queue using BullMQ and immediately returns a `202 Accepted` response.

### 2. Processing Phase (Asynchronous)
A background worker process running in the Node environment continuously polls the Redis queue. When it picks up a job:
- It formats the payload and issues a fast synchronous HTTP request to the Python ML Service (`/predict`).
- It waits for the inference engine to return the `risk_score` and `feature_importance` (SHAP values).

### 3. Persistence Phase
Upon receiving the ML evaluation, the Node worker uses Prisma to write the complete record (original payload + ML evaluation) into the PostgreSQL database. This ensures ACID compliance and creates a permanent audit trail for investigation.

### 4. Streaming Phase
Once the database commit is successful, the worker emits an internal event (`TransactionProcessed`) via a Node `EventEmitter`. The API Gateway listens for these events and pushes them down an active Server-Sent Events (SSE) connection to all connected frontend clients.

---

## Why Microservices?

By decoupling the system into distinct microservices, SentinelAI achieves:
- **Fault Tolerance:** If the ML Service crashes or goes offline, the Node API Gateway can still accept incoming transactions. They will safely queue in Redis until the ML Service recovers.
- **Independent Scaling:** The ML Service (CPU bound) can be scaled horizontally behind a load balancer independently of the API Gateway (I/O bound).
- **Polyglot Advantage:** We leverage Node.js for its superior async I/O and concurrent connection handling, while using Python for its unrivaled machine learning ecosystem.
