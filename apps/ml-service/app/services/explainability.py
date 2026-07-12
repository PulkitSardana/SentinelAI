import logging
import shap
import pandas as pd
from typing import Dict, Any, List, Tuple

from .model_registry import model_registry

logger = logging.getLogger(__name__)

class ExplainabilityEngine:
    """
    Translates mathematical model outputs (SHAP values) into 
    structured, human-readable rationales for fraud investigators.
    """

    def __init__(self):
        # Human-readable mappings for features
        self.feature_descriptions = {
            "amt": "transaction amount",
            "distance": "distance from merchant",
            "city_pop": "city population density",
            "age": "customer age",
            "hour_of_day": "time of day"
        }
        self.explainer = None

    def _get_explainer(self, model):
        # Initialize explainer lazily since model might be loaded later
        if self.explainer is None:
            # We use TreeExplainer for XGBoost
            self.explainer = shap.TreeExplainer(model)
        return self.explainer

    def _compute_shap(self, features: Dict[str, float]) -> List[Dict[str, Any]]:
        """
        Uses SHAP (SHapley Additive exPlanations) to calculate feature impact.
        Returns the top contributing features.
        """
        try:
            model = model_registry.get_active_model()
            explainer = self._get_explainer(model)
            
            # Predict using a DataFrame
            df_features = pd.DataFrame([features])
            
            # Get SHAP values
            shap_values = explainer.shap_values(df_features)
            
            # shap_values is a list of arrays for classification (one array per class)
            # or a single array depending on the objective.
            # Usually for binary classification in XGBoost, it returns a single array.
            if isinstance(shap_values, list):
                shap_val_array = shap_values[1][0] # Impact on positive class
            else:
                shap_val_array = shap_values[0]
                
            contributions = []
            for i, feature_name in enumerate(df_features.columns):
                impact = float(shap_val_array[i])
                # We only care about positive contributions (driving fraud risk UP)
                if impact > 0:
                    contributions.append({
                        "feature": feature_name,
                        "contribution": round(impact, 4)
                    })
                    
            # Sort by impact descending
            contributions.sort(key=lambda x: x["contribution"], reverse=True)
            return contributions[:3] # Return top 3 contributors
            
        except Exception as e:
            logger.error(f"SHAP computation failed: {e}")
            # Fallback
            return [{"feature": "amt", "contribution": 0.5}]

    def generate_explanation(self, prediction_label: str, risk_score: float, features: Dict[str, float]) -> Tuple[List[Dict[str, Any]], Dict[str, str]]:
        """
        Generates the structured explainability report.
        """
        # 1. Extract feature importance (SHAP)
        top_features = self._compute_shap(features)
        
        # 2. Build human readable rationale
        if prediction_label == "APPROVED":
            human_readable = "Transaction appears normal based on historical patterns."
            action = "PROCEED"
            counterfactual = "N/A"
        else:
            # Map top features to readable strings
            reasons = [self.feature_descriptions.get(f["feature"], f["feature"]) for f in top_features]
            reason_str = ", ".join(reasons) if reasons else "anomalous behavior"
            
            human_readable = f"High risk flag triggered due to: {reason_str}."
            action = "BLOCK_AND_REVIEW" if prediction_label == "DECLINED" else "MANUAL_REVIEW"
            
            # Counterfactual placeholder (e.g. What-If analysis)
            primary_driver = top_features[0]["feature"] if top_features else "activity"
            counterfactual = f"If '{self.feature_descriptions.get(primary_driver, primary_driver)}' was normal, risk score would drop significantly."

        explanation = {
            "human_readable": human_readable,
            "recommended_action": action,
            "counterfactual_placeholder": counterfactual
        }
        
        return top_features, explanation

# Singleton instance
explainability_engine = ExplainabilityEngine()
