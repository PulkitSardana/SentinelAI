"use client"

import { TransactionAlert } from "@/types"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { ShieldAlert, CheckCircle, Clock, MapPin, Monitor, CreditCard, Activity } from "lucide-react"
import { format } from "date-fns"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

interface InvestigationPanelProps {
  transaction: TransactionAlert | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InvestigationPanel({ transaction, open, onOpenChange }: InvestigationPanelProps) {
  if (!transaction) return null

  const isFraud = transaction.prediction === "DECLINED"
  const isReview = transaction.prediction === "FLAGGED_FOR_REVIEW"

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl font-bold">Investigation Report</SheetTitle>
            {isFraud ? (
              <Badge variant="destructive" className="px-3 py-1 text-sm"><ShieldAlert className="w-4 h-4 mr-1" /> BLOCKED</Badge>
            ) : isReview ? (
              <Badge variant="secondary" className="px-3 py-1 text-sm bg-yellow-500/20 text-yellow-600"><Clock className="w-4 h-4 mr-1" /> REVIEW</Badge>
            ) : (
              <Badge variant="outline" className="px-3 py-1 text-sm text-emerald-500 border-emerald-500/20"><CheckCircle className="w-4 h-4 mr-1" /> APPROVED</Badge>
            )}
          </div>
          <SheetDescription>
            ID: {transaction.id} • Evaluated {format(new Date(transaction.timestamp), 'PPpp')}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-8">
          {/* Risk Score Section */}
          <div className="bg-muted/30 p-6 rounded-lg border">
            <div className="flex items-end justify-between mb-2">
              <div>
                <h4 className="font-semibold text-muted-foreground mb-1">AI Risk Score</h4>
                <div className="text-4xl font-bold tracking-tight">
                  <span className={isFraud ? "text-destructive" : isReview ? "text-yellow-500" : "text-emerald-500"}>
                    {(transaction.risk_score * 100).toFixed(0)}
                  </span>
                  <span className="text-xl text-muted-foreground">/100</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Confidence</div>
                <div className="font-medium">{(transaction.confidence * 100).toFixed(1)}%</div>
              </div>
            </div>
            <Progress 
              value={transaction.risk_score * 100} 
              className="h-2"
              indicatorColor={isFraud ? "bg-destructive" : isReview ? "bg-yellow-500" : "bg-emerald-500"}
            />
          </div>

          {/* Explainability / SHAP */}
          {transaction.explanation && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" /> SHAP Explainability
              </h3>
              <div className="p-4 rounded-lg bg-card border text-sm text-muted-foreground italic leading-relaxed">
                "{transaction.explanation.human_readable}"
              </div>
              
              {transaction.feature_importance && transaction.feature_importance.length > 0 && (
                <div className="space-y-3 mt-4">
                  <h4 className="text-sm font-medium">Top Contributing Factors</h4>
                  {transaction.feature_importance.map((feature, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-mono">{feature.feature}</span>
                        <span className={feature.contribution > 0 ? "text-destructive" : "text-emerald-500"}>
                          {feature.contribution > 0 ? "+" : ""}{feature.contribution.toFixed(3)}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden flex">
                        {feature.contribution > 0 ? (
                          <div className="h-full bg-destructive" style={{ width: `${Math.min(100, feature.contribution * 100)}%`, marginLeft: '50%' }} />
                        ) : (
                          <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, Math.abs(feature.contribution) * 100)}%`, marginLeft: `${50 - Math.min(50, Math.abs(feature.contribution) * 100)}%` }} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Raw Metadata */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Transaction Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-card border space-y-1">
                <div className="text-sm text-muted-foreground flex items-center gap-2"><CreditCard className="w-4 h-4" /> Amount</div>
                <div className="font-semibold text-lg">${transaction.amount.toFixed(2)} {transaction.currency}</div>
              </div>
              <div className="p-4 rounded-lg bg-card border space-y-1">
                <div className="text-sm text-muted-foreground flex items-center gap-2"><MapPin className="w-4 h-4" /> Location</div>
                <div className="font-medium">{transaction.features.country}</div>
              </div>
              <div className="p-4 rounded-lg bg-card border space-y-1">
                <div className="text-sm text-muted-foreground flex items-center gap-2"><Monitor className="w-4 h-4" /> Device</div>
                <div className="font-medium truncate">{transaction.features.device_id.substring(0, 15)}...</div>
              </div>
              <div className="p-4 rounded-lg bg-card border space-y-1">
                <div className="text-sm text-muted-foreground flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> Merchant ID</div>
                <div className="font-medium truncate">{transaction.merchant_id.substring(0, 8)}...</div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t mt-8">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
            {isFraud ? (
              <Button variant="secondary" className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20">Override to Safe</Button>
            ) : (
              <Button variant="destructive">Block Account</Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
