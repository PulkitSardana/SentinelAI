import pytest
from fastapi.testclient import TestClient
from app.main import app
import uuid

client = TestClient(app)

def test_health_check():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_predict_endpoint_returns_structured_contract():
    """
    Validates that the API fulfills the strict enterprise JSON contract.
    """
    payload = {
        "request_id": str(uuid.uuid4()),
        "amount": 1000.00,
        "currency": "USD",
        "merchant_id": str(uuid.uuid4()),
        "account_id": str(uuid.uuid4()),
        "device_id": "hacker-device",
        "country": "RU"
    }

    response = client.post("/api/v1/predict", json=payload)
    assert response.status_code == 200
    
    data = response.json()
    
    # Assert top-level keys
    assert "prediction" in data
    assert "risk_score" in data
    assert "confidence" in data
    assert "feature_importance" in data
    assert "explanation" in data
    assert "metadata" in data
    
    # Assert explainability structure
    assert "human_readable" in data["explanation"]
    assert "recommended_action" in data["explanation"]
    
    # Assert prediction label is bounded to our ENUM-like structure
    assert data["prediction"] in ["APPROVED", "FLAGGED_FOR_REVIEW", "DECLINED"]

def test_predict_endpoint_rejects_invalid_schema():
    """
    Validates Pydantic schema rejection.
    """
    # Missing required amount and merchant_id
    payload = {
        "currency": "USD",
        "account_id": str(uuid.uuid4())
    }

    response = client.post("/api/v1/predict", json=payload)
    assert response.status_code == 422 # Unprocessable Entity (Pydantic Error)
