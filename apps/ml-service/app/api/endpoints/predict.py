import logging
from fastapi import APIRouter, HTTPException, status
from app.schemas.prediction import TransactionFeaturesDTO, PredictionResponse
from app.services.inference_engine import inference_engine

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/predict", response_model=PredictionResponse, status_code=status.HTTP_200_OK)
async def predict_fraud(transaction: TransactionFeaturesDTO):
    """
    Evaluates a transaction for financial fraud.
    """
    try:
        # Convert Pydantic model to dictionary for the inference engine
        raw_data = transaction.model_dump(mode='json')
        
        # Execute prediction pipeline
        result = inference_engine.evaluate_transaction(raw_data)
        
        # Execute explainability pipeline
        from app.services.explainability import explainability_engine
        
        top_features, explanation = explainability_engine.generate_explanation(
            prediction_label=result["prediction"],
            risk_score=result["risk_score"],
            features=result["raw_features"]
        )
        
        # Asynchronously log to monitoring system (simulated as sync here)
        from app.services.monitoring import monitoring
        monitoring.log_prediction(
            request_id=result["metadata"]["request_id"],
            risk_score=result["risk_score"],
            prediction=result["prediction"],
            features=result["raw_features"],
            processing_time_ms=result["metadata"]["processing_time_ms"],
            model_version=result["metadata"]["model_version"]
        )
        
        return PredictionResponse(
            prediction=result["prediction"],
            risk_score=result["risk_score"],
            confidence=result["confidence"],
            feature_importance=top_features,
            explanation=explanation,
            metadata=result["metadata"]
        )
        
    except Exception as e:
        logger.error(f"Prediction failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during model inference."
        )
