from fastapi import APIRouter
from typing import List, Dict

router = APIRouter()

@router.get("/monitoring/drift")
async def get_model_drift():
    # In a real system, this would query a metrics database (e.g., Prometheus, MLflow)
    return {
        "data": [
            { "date": "Oct 01", "accuracy": 98.2, "fpr": 2.1 },
            { "date": "Oct 05", "accuracy": 97.9, "fpr": 2.3 },
            { "date": "Oct 10", "accuracy": 97.5, "fpr": 2.8 },
            { "date": "Oct 15", "accuracy": 96.8, "fpr": 3.5 },
            { "date": "Oct 20", "accuracy": 94.2, "fpr": 5.2 },
            { "date": "Oct 25", "accuracy": 91.5, "fpr": 8.4 },
            { "date": "Oct 30", "accuracy": 88.3, "fpr": 12.1 }
        ]
    }

@router.get("/monitoring/feature-importance")
async def get_feature_importance():
    return {
        "data": [
            { "feature": "Device ID", "baseline": 0.85, "current": 0.82 },
            { "feature": "IP Velocity", "baseline": 0.78, "current": 0.41 },
            { "feature": "Txn Amount", "baseline": 0.65, "current": 0.68 },
            { "feature": "Time of Day", "baseline": 0.42, "current": 0.88 },
            { "feature": "Location", "baseline": 0.55, "current": 0.52 }
        ]
    }

@router.get("/monitoring/health")
async def get_model_health():
    return {
        "data": [
            {
                "id": "model_1",
                "name": "LightGBM Core",
                "version": "v4.2.1",
                "deployed": "12d ago",
                "status": "Healthy"
            },
            {
                "id": "model_2",
                "name": "Transformer (Sequence)",
                "version": "v2.0.4",
                "deployed": "45d ago",
                "status": "Drift Detected"
            },
            {
                "id": "model_3",
                "name": "Isolation Forest (Anomaly)",
                "version": "v1.1.0",
                "deployed": "5d ago",
                "status": "Calibrating"
            }
        ]
    }
