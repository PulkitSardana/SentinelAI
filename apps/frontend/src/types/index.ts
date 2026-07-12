export interface TransactionAlert {
  id: string;
  amount: number;
  currency: string;
  merchant_id: string;
  account_id: string;
  timestamp: string;
  risk_score: number;
  prediction: 'APPROVED' | 'FLAGGED_FOR_REVIEW' | 'DECLINED';
  confidence: number;
  features: {
    country: string;
    device_id: string;
    [key: string]: any;
  };
  explanation?: {
    human_readable: string;
    recommended_action: string;
    counterfactual_placeholder: string;
  };
  feature_importance?: Array<{
    feature: string;
    contribution: number;
  }>;
}
