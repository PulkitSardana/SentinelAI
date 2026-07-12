# System Design: SentinelAI

This document outlines the high-level system design of SentinelAI, demonstrating how the platform meets enterprise requirements for scalability, availability, and explainability.

## 1. Requirements

**Functional Requirements:**
- Ingest credit card transactions in real-time.
- Evaluate each transaction using a Machine Learning model (XGBoost) for fraud detection.
- Generate Explainable AI metrics (SHAP values) for every transaction.
- Stream the results and analytical dashboards in real-time to fraud investigators.
- Maintain a historical audit log and model registry.

**Non-Functional Requirements:**
- **High Availability:** The ingestion API must not drop payloads even if the ML service experiences a latency spike.
- **Low Latency:** Inference should complete in <50ms.
- **Scalability:** The system must handle high-throughput bursts (e.g., Black Friday traffic).

## 2. Capacity Planning & Constraints
Assume a peak load of 1,000 Transactions Per Second (TPS).
- 1,000 TPS requires a decoupling buffer. If the ML service takes 15ms per inference (max 66 requests/sec per CPU core), a single instance cannot handle 1,000 TPS synchronously. 
- **Solution:** Introduce a Message Queue (BullMQ/Redis) and horizontally scale the Python ML Service workers.

## 3. High-Level Design

1. **Client (Simulator):** Generates synthetic payloads mimicking a payment processor.
2. **Load Balancer (Nginx/ALB):** Distributes incoming traffic across API Gateway instances.
3. **API Gateway (Node.js/Express):** Validates the payload and pushes it to Redis. Responds with `202 Accepted`.
4. **Message Broker (Redis):** Stores the high-throughput incoming events.
5. **Worker Nodes (Node.js):** Pull events from Redis at a controlled concurrency rate and forward them to the ML Service.
6. **ML Inference Service (Python/FastAPI):** Computes risk scores and SHAP values.
7. **Database (PostgreSQL):** Stores the evaluated transactions and audit logs.
8. **Real-time Streaming (SSE):** API Gateway streams the evaluated transactions to the Next.js Dashboard.

## 4. Why this architecture?

By isolating the ML inference (CPU bound) from the API Gateway (I/O bound) using a Redis Queue, we implement the **Asynchronous Request-Reply Pattern**. This prevents backpressure from crashing the Node.js event loop during traffic spikes. If the ML service goes down, the API Gateway still accepts payments, queuing them safely until the ML service recovers.
