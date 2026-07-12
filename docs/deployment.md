# Deployment & Docker Setup

SentinelAI is heavily containerized using Docker, ensuring that the development environment perfectly mirrors production.

## Docker Compose Orchestration

The `docker-compose.yml` file sits at the root of the project and orchestrates four primary containers:
1. **postgres**: The PostgreSQL database.
2. **redis**: The Redis message broker for BullMQ.
3. **ml-service**: The FastAPI Python backend.
4. **api-gateway**: The Node.js Express backend.

*(Note: The Next.js frontend is typically run locally during development to utilize Hot Module Replacement (HMR), but can easily be containerized for production).*

## Zero-Configuration Startup

We utilize a `Makefile` to streamline the developer experience. A single `make dev` command will:
1. Spin up the Postgres and Redis containers in the background.
2. Wait for the database to become healthy.
3. Run `prisma migrate dev` to ensure the schema is applied.
4. Start the Node.js API Gateway, BullMQ Worker, Next.js frontend, and the Python ML Service.

This guarantees an exceptional onboarding experience for new engineers joining the project.
