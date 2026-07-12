import os
import logging
import xgboost as xgb
import pandas as pd
from typing import Dict, Any

logger = logging.getLogger(__name__)

class ModelRegistry:
    """
    Enterprise abstraction for model management.
    Loads the trained XGBoost model from the offline pipeline artifacts.
    """

    def __init__(self):
        # Current active model metadata
        self._active_model_version = "xgb-fraud-v1"
        self._active_algorithm = "XGBoost"
        self._training_date = "2026-07-11T00:00:00Z"
        
        # Load the actual model artifact
        self._model = self._load_model_artifact()

    def _load_model_artifact(self) -> Any:
        """
        Loads the binary model artifact from local storage.
        """
        try:
            # We assume ml-service is running with its root as working directory
            # or we use absolute path based on __file__
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            artifact_path = os.path.join(base_dir, "offline_pipeline", "artifacts", "xgboost_fraud_model.json")
            
            logger.info(f"Loading XGBoost model artifact from {artifact_path}...")
            
            model = xgb.XGBClassifier()
            model.load_model(artifact_path)
            logger.info("Successfully loaded XGBoost model!")
            return model
            
        except Exception as e:
            logger.error(f"Failed to load XGBoost model artifact: {e}")
            logger.warning("Falling back to Mock model!")
            
            # Fallback for local dev if artifact is missing
            class MockXGBoostModel:
                def predict_proba(self, X) -> np.ndarray:
                    # Return shape (N, 2)
                    risk = 0.1
                    return np.array([[1 - risk, risk]])
            return MockXGBoostModel()

    def get_active_model(self) -> Any:
        """Returns the executable model artifact."""
        return self._model

    def get_model_metadata(self) -> Dict[str, str]:
        """Returns metadata for API responses and monitoring."""
        return {
            "version": self._active_model_version,
            "algorithm": self._active_algorithm,
            "training_date": self._training_date
        }

# Singleton instance for the FastAPI application
model_registry = ModelRegistry()
