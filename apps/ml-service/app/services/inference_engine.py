import time
import uuid
import logging
import pandas as pd
from typing import Dict, Any, Tuple
from datetime import datetime, timezone

from .feature_engineering import feature_pipeline
from .model_registry import model_registry

logger = logging.getLogger(__name__)

class InferenceEngine:
    """
    Orchestrates the prediction workflow:
    1. Extracts raw data
    2. Triggers feature engineering
    3. Triggers the active model from the registry
    4. Computes confidence and raw predictions
    """

    def __init__(self):
        # Fraud threshold
        self.FRAUD_THRESHOLD = 0.85
        self.REVIEW_THRESHOLD = 0.65

    def evaluate_transaction(self, raw_transaction: Dict[str, Any]) -> Dict[str, Any]:
        """
        Main execution path for a single prediction request.
        """
        start_time = time.perf_counter()
        request_id = raw_transaction.get("request_id") or str(uuid.uuid4())

        # 1. Feature Engineering
        features = feature_pipeline.transform(raw_transaction)

        # 2. Get Active Model
        model = model_registry.get_active_model()
        model_metadata = model_registry.get_model_metadata()

        # 3. Predict 
        # Convert dictionary to DataFrame for XGBoost to maintain feature names
        df_features = pd.DataFrame([features])
        
        # predict_proba returns a 2D array: [[prob_class_0, prob_class_1]]
        try:
            probabilities = model.predict_proba(df_features)
            risk_score = float(probabilities[0][1])
        except Exception as e:
            logger.error(f"Prediction failed: {e}")
            risk_score = 0.0

        # 4. Post-processing (Thresholding & Confidence)
        prediction_label = "APPROVED"
        if risk_score >= self.FRAUD_THRESHOLD:
            prediction_label = "DECLINED"
        elif risk_score >= self.REVIEW_THRESHOLD:
            prediction_label = "FLAGGED_FOR_REVIEW"

        # Confidence heuristic
        confidence = abs(risk_score - 0.5) * 2.0

        # Calculate latency
        processing_time_ms = round((time.perf_counter() - start_time) * 1000, 2)

        result = {
            "prediction": prediction_label,
            "risk_score": round(risk_score, 4),
            "confidence": round(confidence, 4),
            "raw_features": features,
            "metadata": {
                "model_version": model_metadata["version"],
                "processing_time_ms": processing_time_ms,
                "request_id": request_id,
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
        }

        logger.info(f"Transaction {request_id} evaluated: {prediction_label} (Score: {risk_score:.2f}) in {processing_time_ms}ms")
        return result

# Singleton instance
inference_engine = InferenceEngine()
