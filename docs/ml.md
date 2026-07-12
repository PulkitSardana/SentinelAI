# Machine Learning & Explainable AI

The core intelligence of SentinelAI is powered by a dedicated Python microservice built with **FastAPI**.

## Model Choice: XGBoost

We use an Extreme Gradient Boosting (`XGBoost`) model for fraud detection rather than a Deep Neural Network. 
- Tabular financial data (transaction amounts, distances, IP discrepancies) typically yields higher performance with tree-based ensemble methods.
- XGBoost offers highly optimized C++ underpinnings for inference, allowing us to generate predictions in under 15ms, a strict requirement for live transaction processing.

## Explainable AI (SHAP)

SentinelAI does not treat the ML model as a black box. Returning a `risk_score` of `0.92` is useless to a fraud investigator if they do not know *why* the transaction was flagged.

We integrated **SHAP (SHapley Additive exPlanations)** natively into the inference pipeline.
- When a transaction is evaluated, the `TreeExplainer` parses the model's decision path.
- It returns an array of `feature_importance` mapping exactly how much each input feature (e.g., `amt`, `city_pop`, `distance`) pushed the final score up or down from the base expected value.
- This data is mathematically consistent (based on game theory) and is passed through the queue to the database and streamed to the frontend to power the **Explainability Studio**.

## The Inference API

The `/predict` endpoint is heavily optimized. It accepts a JSON payload, converts it to a Pandas DataFrame, scales/encodes the categorical features using pre-fitted transformers, and passes it to the `xgboost` model.

**Performance Consideration:**
Because `TreeExplainer` adds overhead to the inference latency, in an ultra-high-scale production environment, SHAP values might be computed asynchronously *after* the initial block/allow decision is made. For SentinelAI, we compute them synchronously to demonstrate the capability in real-time.
