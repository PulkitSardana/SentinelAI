"use client"

import { useLiveTransactions } from "@/hooks/use-live-transactions"
import { useTransactionStore } from "@/store/use-transaction-store"
import { Badge } from "@/components/ui/badge"
import { ShieldAlert, CheckCircle, Clock } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { format } from "date-fns"
import { TransactionAlert } from "@/types"
import { InvestigationPanel } from "@/components/dashboard/InvestigationPanel"
import { motion, AnimatePresence } from "framer-motion"

const MOCK_MERCHANTS = ["Amazon", "Apple", "Walmart", "Target", "Best Buy", "Netflix", "Uber", "Airbnb"]
const MOCK_COUNTRIES = ["US", "GB", "CA", "AU", "DE", "FR", "JP", "BR"]

function generateMockTransaction(): TransactionAlert {
  const risk = Math.random()
  let prediction: "DECLINED" | "FLAGGED_FOR_REVIEW" | "APPROVED" = "APPROVED"
  if (risk > 0.85) prediction = "DECLINED"
  else if (risk > 0.65) prediction = "FLAGGED_FOR_REVIEW"

  return {
    id: `TXN-${Math.floor(Math.random() * 1000000)}`,
    account_id: `USR-${Math.floor(Math.random() * 10000)}`,
    merchant_id: MOCK_MERCHANTS[Math.floor(Math.random() * MOCK_MERCHANTS.length)],
    amount: Math.floor(Math.random() * 50000) + 1000,
    currency: "USD",
    timestamp: new Date().toISOString(),
    risk_score: risk,
    prediction: prediction,
    confidence: Math.random() * 0.5 + 0.5,
    features: { 
      country: MOCK_COUNTRIES[Math.floor(Math.random() * MOCK_COUNTRIES.length)],
      device_id: `DEV-${Math.floor(Math.random() * 10000)}` 
    },
    processing_time_ms: Math.floor(Math.random() * 30) + 10,
    explanation: {
      human_readable: "Automated alert",
      recommended_action: "Review",
      counterfactual_placeholder: "N/A"
    },
  }
}

export function LiveTable() {
  // Initialize connection
  useLiveTransactions()
  const { transactions } = useTransactionStore()
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionAlert | null>(null)
  const [displayTx, setDisplayTx] = useState<TransactionAlert[]>([])
  const isAutoGenerating = useRef(true)

  // Auto-generate realistic demo data if no real transactions exist
  useEffect(() => {
    if (transactions.length > 0) {
      isAutoGenerating.current = false
      setDisplayTx(transactions.slice(0, 15))
      return
    }

    if (isAutoGenerating.current) {
      const interval = setInterval(() => {
        setDisplayTx(prev => [generateMockTransaction(), ...prev].slice(0, 15))
      }, Math.random() * 2000 + 1000)
      
      return () => clearInterval(interval)
    }
  }, [transactions])

  return (
    <>
      <div className="h-[400px] w-full rounded-md border border-slate-800 bg-slate-950/50 backdrop-blur text-slate-100 shadow-xl overflow-hidden flex flex-col">
        <div className="grid grid-cols-6 border-b border-slate-800 bg-slate-900/80 p-4 text-sm font-medium text-slate-400 sticky top-0 z-10">
          <div className="col-span-1">Time</div>
          <div className="col-span-1">ID</div>
          <div className="col-span-1">Merchant</div>
          <div className="col-span-1">Amount</div>
          <div className="col-span-1">Risk Score</div>
          <div className="col-span-1 text-right">Action</div>
        </div>
        
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-2">
          <AnimatePresence initial={false}>
            {displayTx.map((transaction) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="grid grid-cols-6 border-b border-slate-800/50 p-3 text-sm items-center hover:bg-slate-800/50 transition-colors cursor-pointer group rounded-lg mb-1"
                onClick={() => setSelectedTransaction(transaction)}
              >
                <div className="col-span-1 text-slate-400 font-mono text-xs">
                  {format(new Date(transaction.timestamp), 'HH:mm:ss')}
                </div>
                <div className="col-span-1 font-mono text-xs text-blue-400">
                  {transaction.id}
                </div>
                <div className="col-span-1 truncate pr-2 font-medium">
                  {transaction.merchant_id}
                </div>
                <div className="col-span-1 font-mono">
                  ${(transaction.amount / 100).toFixed(2)}
                </div>
                <div className="col-span-1">
                  <span className={`font-medium px-2 py-0.5 rounded-full text-xs ${transaction.risk_score > 0.85 ? 'bg-red-500/10 text-red-500' : transaction.risk_score > 0.65 ? 'bg-yellow-500/10 text-yellow-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                    {(transaction.risk_score * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="col-span-1 text-right">
                  {transaction.prediction === "DECLINED" ? (
                    <Badge variant="destructive" className="flex items-center justify-center gap-1 w-24 ml-auto bg-red-500/20 text-red-500 border-none">
                      <ShieldAlert className="h-3 w-3" /> Blocked
                    </Badge>
                  ) : transaction.prediction === "FLAGGED_FOR_REVIEW" ? (
                    <Badge variant="secondary" className="flex items-center justify-center gap-1 w-24 ml-auto bg-yellow-500/20 text-yellow-500 border-none">
                      <Clock className="h-3 w-3" /> Review
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="flex items-center justify-center gap-1 w-24 ml-auto bg-emerald-500/10 text-emerald-500 border-none">
                      <CheckCircle className="h-3 w-3" /> Approved
                    </Badge>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <InvestigationPanel 
        transaction={selectedTransaction} 
        open={!!selectedTransaction} 
        onOpenChange={(open) => !open && setSelectedTransaction(null)} 
      />
    </>
  )
}
