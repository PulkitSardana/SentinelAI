# API Documentation

The Node.js Express backend exposes a clean REST API and a Server-Sent Events (SSE) streaming endpoint.

## Core Endpoints

### 1. Ingest Transaction
**POST** `/api/v1/transactions/ingest`
- **Description:** Enqueues a new transaction for fraud evaluation. Returns immediately (does not wait for inference).
- **Body:**
  ```json
  {
    "merchant_id": "M_12345",
    "amount": 250.50,
    "category": "electronics",
    "distance_from_home": 12.5,
    "distance_from_last_txn": 0.5,
    "ratio_to_median_purchase_price": 4.2
  }
  ```
- **Response:** `202 Accepted`
  ```json
  {
    "status": "success",
    "message": "Transaction queued for processing"
  }
  ```

### 2. Stream Live Transactions
**GET** `/api/v1/transactions/stream`
- **Description:** Establishes an SSE connection. Pushes evaluated transactions (with ML risk scores and SHAP values) to the client as soon as they are saved to the database.
- **Response:** `text/event-stream`

### 3. Dashboard Metrics
**GET** `/api/v1/metrics/dashboard`
- **Description:** Returns aggregated statistics from the PostgreSQL database (Fraud Rate, Total Volume, Precision, Recall).
- **Response:** `200 OK`

### 4. Developer Console Logs (Live)
*(Note: In SentinelAI, logs are streamed via SSE alongside transactions for the Developer Tools view, mimicking a live telemetry pipeline).*

## Standard Error Response
All endpoints conform to a standardized error format to ensure predictability:
```json
{
  "status": "error",
  "code": 400,
  "message": "Invalid transaction payload: amount must be positive",
  "timestamp": "2026-07-12T18:00:00Z",
  "requestId": "req-98765"
}
```
