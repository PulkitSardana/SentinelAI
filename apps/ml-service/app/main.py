from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
import logging
from datetime import datetime, timezone
import uuid

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

# Standardized Error Handling
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    req_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "status": "error",
            "code": 422,
            "message": f"Validation Error: {exc.errors()}",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "requestId": req_id
        }
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception caught: {exc}")
    req_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "status": "error",
            "code": 500,
            "message": "Internal Server Error",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "requestId": req_id
        }
    )

@app.on_event("startup")
async def startup_event():
    logger.info("SentinelAI ML Service is starting up...")
    # In a real app, model warming (lazy loading) can be triggered here.

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("SentinelAI ML Service is shutting down...")
