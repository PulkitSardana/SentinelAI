from fastapi import APIRouter

router = APIRouter()

@router.get("/health", status_code=200)
async def health_check():
    """
    K8s / Load Balancer health check endpoint.
    """
    return {"status": "ok", "service": "ml-inference-platform"}
