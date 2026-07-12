import os
import time
import uuid
import random
import json
import logging
import requests
import csv
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
import hashlib

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')
logger = logging.getLogger(__name__)

# Constants
API_URL = os.environ.get("API_URL", "http://localhost:4000/api/v1/transactions")
SLEEP_INTERVAL = float(os.environ.get("SLEEP_INTERVAL", 1.0))
DATASET_PATH = os.environ.get("DATASET_PATH", "/Users/dell/.gemini/antigravity-ide/scratch/SentinelAI/Datasets/fraudTest.csv")

BROWSERS = ["Chrome", "Safari", "Firefox", "Edge", "Opera"]
OS_LIST = ["Windows", "macOS", "iOS", "Android", "Linux"]
CHANNELS = ["web", "mobile_app", "in_store", "atm"]
PAYMENT_METHODS = ["credit_card", "debit_card"]

def setup_session():
    session = requests.Session()
    retry = Retry(connect=3, backoff_factor=0.5)
    adapter = HTTPAdapter(max_retries=retry)
    session.mount('http://', adapter)
    session.mount('https://', adapter)
    return session

def generate_deterministic_uuid(value):
    # Generates a valid UUID based on the string value
    return str(uuid.uuid5(uuid.NAMESPACE_OID, str(value)))

def generate_device_id(cc_num):
    # Deterministic device ID based on CC to simulate returning users with same device
    return hashlib.md5(cc_num.encode()).hexdigest()

def generate_ip(cc_num):
    # Deterministic IP based on CC, slightly varied
    seed = int(hashlib.md5(cc_num.encode()).hexdigest()[:8], 16)
    random.seed(seed)
    return f"{random.randint(1, 255)}.{random.randint(0, 255)}.{random.randint(0, 255)}.{random.randint(1, 254)}"

def map_row_to_payload(row):
    try:
        cc_num = row['cc_num']
        merchant_raw = row['merchant']
        merchant_clean = merchant_raw.replace('fraud_', '')
        
        # Reset seed for random choice so we get consistent OS/Browser per CC
        seed = int(hashlib.md5(cc_num.encode()).hexdigest()[:8], 16)
        random.seed(seed)
        
        device_type = random.choice(["desktop", "mobile"])
        browser = random.choice(BROWSERS)
        os_sys = random.choice(OS_LIST)
        channel = random.choice(CHANNELS)
        pay_meth = random.choice(PAYMENT_METHODS)
        
        # Determine if it is actually fraud in dataset (we can log this)
        is_fraud = row.get('is_fraud', '0') == '1'

        payload = {
            "amount": float(row['amt']),
            "currency": "USD", # Defaulting to USD for this US dataset
            "merchant_id": generate_deterministic_uuid(merchant_clean),
            "account_id": generate_deterministic_uuid(cc_num),
            "device_id": generate_deterministic_uuid(cc_num + "_device"),
            "device_type": device_type,
            "ip_address": generate_ip(cc_num),
            "browser": browser,
            "operating_system": os_sys,
            "city": row['city'],
            "country": "US", # Since dataset states are US based
            "payment_method": pay_meth,
            "transaction_channel": channel,
            "is_fraud_ground_truth": is_fraud,
            
            # --- ML Hybrid Fields ---
            "lat": float(row['lat']),
            "long": float(row['long']),
            "merch_lat": float(row['merch_lat']),
            "merch_long": float(row['merch_long']),
            "city_pop": int(row['city_pop']),
            "dob": row['dob']
        }
        return payload, is_fraud
    except Exception as e:
        logger.error(f"Error mapping row: {e}")
        return None, False

def run_simulation():
    logger.info("Starting SentinelAI Transaction Simulator (Kaggle Dataset mode)...")
    logger.info(f"Targeting API: {API_URL}")
    logger.info(f"Dataset Path: {DATASET_PATH}")
    
    if not os.path.exists(DATASET_PATH):
        logger.error(f"Dataset not found at {DATASET_PATH}")
        return

    session = setup_session()

    try:
        with open(DATASET_PATH, mode='r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            
            for row in reader:
                txn, is_fraud = map_row_to_payload(row)
                if not txn:
                    continue
                
                try:
                    response = session.post(API_URL, json=txn, timeout=5)
                    if response.status_code == 201:
                        risk_status = response.json().get('data', {}).get('status')
                        fraud_label = "[FRAUD]" if is_fraud else "[NORMAL]"
                        logger.info(f"SENT: {txn['amount']:>7.2f} USD to {txn['merchant_id'][:12]:<12} | True: {fraud_label:<8} | Risk: {risk_status}")
                    else:
                        logger.error(f"Failed to post transaction: {response.status_code} - {response.text}")
                except Exception as e:
                    logger.error(f"Connection error: {e}")
                
                # Reset random seed back to unseeded for any other needs
                random.seed()
                
                time.sleep(SLEEP_INTERVAL)
                
    except KeyboardInterrupt:
        logger.info("Simulation stopped by user.")
    except Exception as e:
        logger.error(f"Error in simulation: {e}")

if __name__ == "__main__":
    run_simulation()
