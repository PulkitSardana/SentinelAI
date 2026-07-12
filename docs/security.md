# Security Architecture

Security is a primary concern for any financial intelligence platform. SentinelAI integrates several layers of defense across the stack.

## 1. Input Validation (Zod & Pydantic)
- **Node.js API Gateway**: Every incoming request to `/ingest` is strictly validated using Zod. If a payload contains unexpected fields or malformed data types (e.g., passing a string for a transaction amount), it is rejected with a `400 Bad Request` before it even touches the BullMQ queue.
- **Python ML Service**: Uses Pydantic to enforce schema validation on the `POST /predict` endpoint, ensuring the XGBoost model never receives corrupt Pandas DataFrames.

## 2. Secrets Management
- All sensitive configurations (Database URLs, Redis connection strings, API Keys) are loaded exclusively through environment variables.
- We utilize `dotenv` and strict environment validation files (`src/config/env.ts`) to ensure the application immediately crashes on boot if a required secret is missing, rather than failing silently in production.

## 3. Database Security
- **SQL Injection**: Prevented natively by utilizing the Prisma ORM, which automatically parameterizes all queries.
- **Audit Logging**: Any manual overrides (e.g., an analyst changing a transaction status from "Flagged" to "Allowed" via the dashboard) are logged in the `AuditLog` table with a timestamp and User ID, fulfilling compliance requirements.

## 4. Network Boundaries
- In a production Kubernetes or AWS ECS environment, the Redis instance, PostgreSQL database, and Python ML Service would be placed in a private subnet, inaccessible from the public internet. Only the Node.js API Gateway (and Next.js Frontend) would be exposed via a public load balancer.
