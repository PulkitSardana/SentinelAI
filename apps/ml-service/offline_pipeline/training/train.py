import os
import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))))
DATASET_PATH = os.path.join(BASE_DIR, "Datasets", "fraudTrain.csv")
ARTIFACTS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "artifacts")

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

def engineer_features(df):
    """Extract mathematical features from the Kaggle dataset schema."""
    logger.info("Engineering features...")
    
    # 1. Distance between user and merchant
    df['distance'] = haversine_distance(df['lat'], df['long'], df['merch_lat'], df['merch_long'])
    
    # 2. Time-based features
    df['trans_date'] = pd.to_datetime(df['trans_date_trans_time'])
    df['hour_of_day'] = df['trans_date'].dt.hour
    
    # 3. Demographic features
    df['dob'] = pd.to_datetime(df['dob'])
    df['age'] = (df['trans_date'] - df['dob']).dt.days // 365
    
    # Keep only continuous mathematical features for the ML model
    features = ['amt', 'distance', 'city_pop', 'age', 'hour_of_day']
    X = df[features]
    y = df['is_fraud']
    
    return X, y

def train_model():
    if not os.path.exists(DATASET_PATH):
        logger.error(f"Dataset not found at {DATASET_PATH}")
        return
        
    logger.info(f"Loading dataset from {DATASET_PATH}...")
    
    # Due to potentially limited RAM, let's load a subset for speed in development, 
    # but we have 350MB which is easily manageable in pandas (~500k rows)
    df = pd.read_csv(DATASET_PATH)
    logger.info(f"Loaded {len(df)} transactions.")
    
    X, y = engineer_features(df)
    
    # Split data
    logger.info("Splitting dataset into train/test...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    # Train XGBoost
    # Using scale_pos_weight because fraud datasets are highly imbalanced
    scale_pos_weight = (len(y_train) - sum(y_train)) / sum(y_train)
    logger.info(f"Training XGBoost Classifier (scale_pos_weight={scale_pos_weight:.2f})...")
    
    model = xgb.XGBClassifier(
        n_estimators=100,
        max_depth=5,
        learning_rate=0.1,
        scale_pos_weight=scale_pos_weight,
        use_label_encoder=False,
        eval_metric="logloss",
        random_state=42,
        n_jobs=-1
    )
    
    model.fit(X_train, y_train)
    
    # Evaluate
    logger.info("Evaluating model on test set...")
    y_pred = model.predict(X_test)
    y_pred_proba = model.predict_proba(X_test)[:, 1]
    
    logger.info("\n" + classification_report(y_test, y_pred))
    auc = roc_auc_score(y_test, y_pred_proba)
    logger.info(f"ROC AUC Score: {auc:.4f}")
    
    # Save artifacts
    os.makedirs(ARTIFACTS_DIR, exist_ok=True)
    model_path = os.path.join(ARTIFACTS_DIR, "xgboost_fraud_model.json")
    model.save_model(model_path)
    logger.info(f"Model saved to {model_path}")
    
    logger.info("Training pipeline completed successfully.")

if __name__ == "__main__":
    train_model()
