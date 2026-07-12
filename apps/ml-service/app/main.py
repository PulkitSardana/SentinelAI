from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.api.endpoints import predict, health, monitoring

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Initialize FastAPI App
app = FastAPI(
    title="SentinelAI ML Inference Platform",
    description="Enterprise API for real-time transactional fraud evaluation.",
    version="1.0.0"
)

# CORS Middleware (Configure appropriately for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Node.js backend should be the only allowed origin in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(health.router, prefix="/api/v1", tags=["Health"])
app.include_router(predict.router, prefix="/api/v1", tags=["Prediction"])
app.include_router(monitoring.router, prefix="/api/v1", tags=["Monitoring"])

@app.on_event("startup")
async def startup_event():
    logger.info("SentinelAI ML Service is starting up...")
    # In a real app, model warming (lazy loading) can be triggered here.

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("SentinelAI ML Service is shutting down...")
