.PHONY: help dev up down clean migrate logs ui api ml sim

help:
	@echo "SentinelAI Developer Commands:"
	@echo "  make dev      - Start the entire platform (infra, backend, ml-service, frontend, simulator)"
	@echo "  make up       - Start only the infrastructure (Postgres, Redis)"
	@echo "  make down     - Stop all containers and clean up"
	@echo "  make clean    - Stop all containers and wipe database volumes (reset everything)"
	@echo "  make migrate  - Run Prisma database migrations"
	@echo "  make logs     - Tail logs from all docker containers"
	@echo "  make ui       - Start Next.js frontend only"
	@echo "  make api      - Start Node.js backend only"
	@echo "  make ml       - Start Python ML service only"
	@echo "  make sim      - Run the transaction simulator"

# The ultimate 1-click startup command
dev: up migrate
	@echo "Starting Microservices..."
	docker compose up api-gateway ml-service simulator -d
	@echo "\n========================================================"
	@echo "SentinelAI is running!"
	@echo "Frontend:  http://localhost:3000 (run 'make ui' if developing locally)"
	@echo "Backend:   http://localhost:4000"
	@echo "ML Service: http://localhost:8000"
	@echo "========================================================"

up:
	docker compose up postgres redis -d
	@echo "Waiting for PostgreSQL to be ready..."
	sleep 3

down:
	docker compose down

clean:
	docker compose down -v

migrate:
	cd apps/backend && npx prisma migrate deploy

logs:
	docker compose logs -f

# Local Development Commands
ui:
	cd apps/frontend && npm run dev

api:
	cd apps/backend && npm run dev

ml:
	cd apps/ml-service && source venv/bin/activate && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

sim:
	cd apps/simulator && source venv/bin/activate && python simulator.py
