"use client"

import { useLiveTransactions } from "@/hooks/use-live-transactions"
import { useTransactionStore } from "@/store/use-transaction-store"
import { Virtuoso } from "react-virtuoso"
import { Badge } from "@/components/ui/badge"
import { ShieldAlert, CheckCircle, Clock } from "lucide-react"
import { useState } from "react"
import { format } from "date-fns"
import { TransactionAlert } from "@/types"
import { InvestigationPanel } from "@/components/dashboard/InvestigationPanel"

export function LiveTable() {
  // Initialize connection
  useLiveTransactions()
  const { transactions } = useTransactionStore()
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionAlert | null>(null)
  
  if (transactions.length === 0) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center text-muted-foreground border-dashed border-2 rounded-lg bg-muted/20">
        <Clock className="h-10 w-10 mb-4 opacity-50 animate-pulse" />
        <p>Waiting for live stream data...</p>
      </div>
    )
  }

  return (
    <>
      <div className="h-[400px] w-full rounded-md border bg-card text-card-foreground shadow-sm">
        <div className="grid grid-cols-6 border-b bg-muted/50 p-4 text-sm font-medium text-muted-foreground sticky top-0">
          <div className="col-span-1">Time</div>
          <div className="col-span-1">Amount</div>
          <div className="col-span-1">Merchant</div>
          <div className="col-span-1">Location</div>
          <div className="col-span-1">Risk Score</div>
          <div className="col-span-1 text-right">Action</div>
        </div>
        
        <Virtuoso
          style={{ height: "calc(400px - 53px)" }}
          data={transactions}
          itemContent={(_, transaction) => (
            <div 
              className="grid grid-cols-6 border-b p-4 text-sm items-center hover:bg-muted/30 transition-colors cursor-pointer group"
              onClick={() => setSelectedTransaction(transaction)}
            >
              <div className="col-span-1 text-muted-foreground font-mono">
                {format(new Date(transaction.timestamp), 'HH:mm:ss')}
              </div>
              <div className="col-span-1 font-semibold">
                ${transaction.amount.toFixed(2)}
              </div>
              <div className="col-span-1 truncate pr-2">
                {transaction.merchant_id.substring(0, 8)}...
              </div>
              <div className="col-span-1 truncate pr-2">
                {transaction.country}
              </div>
              <div className="col-span-1">
                <span className={`font-medium ${transaction.risk_score > 0.85 ? 'text-destructive' : transaction.risk_score > 0.65 ? 'text-yellow-500' : 'text-emerald-500'}`}>
                  {(transaction.risk_score * 100).toFixed(0)}
                </span>
              </div>
              <div className="col-span-1 text-right">
                {transaction.prediction === "DECLINED" ? (
                  <Badge variant="destructive" className="flex items-center justify-center gap-1 w-24 ml-auto">
                    <ShieldAlert className="h-3 w-3" /> Block
                  </Badge>
                ) : transaction.prediction === "FLAGGED_FOR_REVIEW" ? (
                  <Badge variant="secondary" className="flex items-center justify-center gap-1 w-24 ml-auto bg-yellow-500/20 text-yellow-600 hover:bg-yellow-500/30">
                    <Clock className="h-3 w-3" /> Review
                  </Badge>
                ) : (
                  <Badge variant="outline" className="flex items-center justify-center gap-1 w-24 ml-auto text-emerald-500 border-emerald-500/20">
                    <CheckCircle className="h-3 w-3" /> Allow
                  </Badge>
                )}
              </div>
            </div>
          )}
        />
      </div>

      <InvestigationPanel 
        transaction={selectedTransaction} 
        open={!!selectedTransaction} 
        onOpenChange={(open) => !open && setSelectedTransaction(null)} 
      />
    </>
  )
}
