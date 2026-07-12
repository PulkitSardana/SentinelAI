import logging
import numpy as np
from datetime import datetime
from typing import Dict, Any

logger = logging.getLogger(__name__)

def haversine_distance(lat1, lon1, lat2, lon2):
    """Calculate the great circle distance in kilometers between two points on the earth."""
    # Convert latitude and longitude to radians
    lat1, lon1, lat2, lon2 = map(np.radians, [lat1, lon1, lat2, lon2])
    
    # Haversine formula
    dlat = lat2 - lat1 
    dlon = lon2 - lon1 
    a = np.sin(dlat/2)**2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlon/2)**2
    c = 2 * np.arcsin(np.sqrt(a)) 
    r = 6371 # Radius of earth in kilometers
    return c * r

class FeatureEngineeringPipeline:
    """
    Transforms raw transactional payloads into machine learning feature vectors.
    Matches the Kaggle training dataset schema.
    """
    
    def transform(self, raw_payload: Dict[str, Any]) -> Dict[str, float]:
        """
        Executes the feature engineering pipeline.
        Returns a dictionary that strictly matches the XGBoost training features:
        ['amt', 'distance', 'city_pop', 'age', 'hour_of_day']
        """
        try:
            # Extract raw fields (using defaults if missing in the live stream payload)
            amt = float(raw_payload.get("amount", 0.0))
            
            lat = float(raw_payload.get("lat", 36.0788))
            lon = float(raw_payload.get("long", -81.1781))
            merch_lat = float(raw_payload.get("merch_lat", 36.0112))
            merch_long = float(raw_payload.get("merch_long", -82.0483))
            
            city_pop = float(raw_payload.get("city_pop", 100000))
            
            dob_str = raw_payload.get("dob", "1980-01-01")
            
            # Compute distance
            distance = haversine_distance(lat, lon, merch_lat, merch_long)
            
            # Compute age
            dob = datetime.strptime(dob_str, "%Y-%m-%d")
            now = datetime.utcnow()
            age = (now - dob).days // 365
            
            # Compute hour of day
            hour_of_day = now.hour
            
            # Construct final feature vector EXACTLY as trained
            features = {
                "amt": amt,
                "distance": distance,
                "city_pop": city_pop,
                "age": float(age),
                "hour_of_day": float(hour_of_day)
            }
            
            logger.debug(f"Engineered features: {features}")
            return features
            
        except Exception as e:
            logger.error(f"Feature engineering failed: {str(e)}")
            # Return safe default features so the model doesn't crash on bad payloads
            return {
                "amt": float(raw_payload.get("amount", 0.0)),
                "distance": 0.0,
                "city_pop": 10000.0,
                "age": 30.0,
                "hour_of_day": 12.0
            }

# Singleton instance
feature_pipeline = FeatureEngineeringPipeline()
