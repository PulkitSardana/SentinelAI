from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, UUID4
from datetime import datetime

class TransactionFeaturesDTO(BaseModel):
    """
    Input schema mirroring the data sent by the Node.js backend.
    """
    request_id: Optional[str] = Field(None, description="Trace ID for logging")
    amount: float = Field(..., gt=0, description="Transaction amount")
    currency: str = Field(..., min_length=3, max_length=3)
    merchant_id: UUID4
    account_id: UUID4
    
    # Feature Engineering Attributes
    device_id: Optional[str] = None
    device_type: Optional[str] = None
    ip_address: Optional[str] = None
    browser: Optional[str] = None
    operating_system: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = Field(None, min_length=2, max_length=2)
    payment_method: Optional[str] = None
    transaction_channel: Optional[str] = None
    
    # ML Hybrid Fields
    lat: Optional[float] = None
    long: Optional[float] = None
    merch_lat: Optional[float] = None
    merch_long: Optional[float] = None
    city_pop: Optional[float] = None
    dob: Optional[str] = None

class FeatureImportance(BaseModel):
    feature: str
    contribution: float

class Explanation(BaseModel):
    human_readable: str
    recommended_action: str
    counterfactual_placeholder: str

class PredictionMetadata(BaseModel):
    model_version: str
    processing_time_ms: float
    request_id: str
    timestamp: datetime

class PredictionResponse(BaseModel):
    """
    Strict output schema for enterprise downstream consumers.
    """
    prediction: str = Field(..., description="APPROVED, FLAGGED_FOR_REVIEW, or DECLINED")
    risk_score: float = Field(..., ge=0.0, le=1.0)
    confidence: float = Field(..., ge=0.0, le=1.0)
    
    # These will be populated in Task 6 (Explainability)
    feature_importance: Optional[List[FeatureImportance]] = []
    explanation: Optional[Explanation] = None
    
    metadata: PredictionMetadata
