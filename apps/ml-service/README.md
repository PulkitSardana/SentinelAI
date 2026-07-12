# SentinelAI Machine Learning Platform

This is the Enterprise AI Inference Platform for the SentinelAI ecosystem.

## Architecture

*   **API Layer (`app/api`):** FastAPI HTTP endpoints for serving predictions.
*   **Feature Engineering (`app/services/feature_engineering.py`):** Transforms raw financial data into XGBoost-compatible feature vectors.
*   **Model Registry (`app/services/model_registry.py`):** Handles model versioning, loading, and A/B testing logic.
*   **Inference Engine (`app/services/inference_engine.py`):** Executes the model predictions.
*   **Explainability (`app/services/explainability.py`):** Maps SHAP values to human-readable fraud rationales.
*   **Monitoring (`app/services/monitoring.py`):** Telemetry for model drift and API latency.
*   **Offline Pipeline (`offline_pipeline/`):** Strictly separated pipeline for datasets, training, and artifact generation.

## Development

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the API
uvicorn app.main:app --reload --port 8000
```
