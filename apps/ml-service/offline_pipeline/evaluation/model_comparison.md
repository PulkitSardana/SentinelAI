# Model Evaluation & Algorithm Selection

As part of the offline training pipeline, we evaluated four distinct algorithms for the task of real-time transactional fraud detection.

## Evaluation Metrics Summary

| Algorithm | Precision | Recall | F1-Score | ROC-AUC | PR-AUC | Inference Latency (p99) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Logistic Regression** | 0.82 | 0.65 | 0.72 | 0.89 | 0.75 | ~2ms |
| **Random Forest** | 0.95 | 0.78 | 0.85 | 0.94 | 0.88 | ~25ms |
| **LightGBM** | 0.93 | 0.84 | 0.88 | 0.96 | 0.91 | ~12ms |
| **XGBoost (Champion)** | **0.94** | **0.86** | **0.90** | **0.97** | **0.93** | **~15ms** |

*Note: Fraud detection datasets are highly imbalanced (e.g., 0.1% fraud rate). Therefore, `PR-AUC` (Precision-Recall Area Under Curve) and `Recall` were heavily weighted during selection.*

## Why XGBoost was Selected

1.  **Imbalanced Data Handling:** XGBoost natively supports `scale_pos_weight`, allowing it to aggressively penalize false negatives (missed fraud) in highly imbalanced datasets.
2.  **Explainability:** XGBoost integrates seamlessly with TreeSHAP. For compliance and financial regulations, we *must* be able to explain exactly which features drove a high-risk score. Neural Networks are generally too opaque for this requirement.
3.  **Non-Linearity:** Unlike Logistic Regression, XGBoost captures complex non-linear relationships (e.g., high transaction velocity is normal for a merchant, but highly anomalous for a personal checking account).
4.  **Latency vs Performance:** While LightGBM is slightly faster, XGBoost provided a 2% lift in Recall and PR-AUC. A 15ms p99 inference latency is well within our 50ms total API SLA budget. Random Forest was discarded due to its larger memory footprint and slower inference time at scale.

## Future Exploration
We will monitor the XGBoost model in production. If data volume increases by 10x, we will revisit **LightGBM** due to its histogram-based training optimizations, which scale better on massive datasets.
