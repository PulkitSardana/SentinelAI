import pytest
from app.services.feature_engineering import feature_pipeline

def test_feature_engineering_transforms_raw_payload():
    """
    Ensures that raw strings and stateless payloads are converted 
    into numerical/binary ML features.
    """
    raw_payload = {
        "account_id": "test-acc",
        "merchant_id": "test-merch",
        "amount": 241.0,
        "device_id": "device-999", # Note: Mismatch from history ('device-123')
        "country": "US"
    }

    features = feature_pipeline.transform(raw_payload)

    # Assert correct type casting
    assert isinstance(features["amount"], float)
    
    # Assert historical merge (velocity should be history(2) + 1)
    assert features["velocity_1h"] == 3.0

    # Assert anomaly engineering
    # Device ID is different than historical primary, should flag as 1.0
    assert features["is_new_device"] == 1.0 
    
    # Country matches historical, should be 0.0
    assert features["is_foreign_country"] == 0.0

def test_feature_engineering_handles_zero_spend():
    """
    Prevents ZeroDivisionError when calculating spend ratio for brand new users.
    """
    # Temporarily monkey-patch the mock to return 0.0 for average spend
    original_fetch = feature_pipeline._fetch_historical_features
    
    def mock_fetch(account_id):
        return {
            "txn_count_1h": 0,
            "txn_count_24h": 0,
            "avg_spend_30d": 0.0, # Zero spend history
            "last_txn_timestamp": 0,
            "primary_device_id": "device-123",
            "primary_country": "US"
        }
        
    feature_pipeline._fetch_historical_features = mock_fetch

    try:
        features = feature_pipeline.transform({"amount": 50.0})
        # If avg spend is 0, the ratio defaults to 1.0 (baseline)
        assert features["spend_ratio"] == 1.0 
    finally:
        # Restore mock
        feature_pipeline._fetch_historical_features = original_fetch
