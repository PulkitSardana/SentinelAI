"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useLiveTransactions } from "@/hooks/use-live-transactions"
import { Activity, Database, CheckCircle2, AlertTriangle, XCircle, BrainCircuit, Lock, Network, Cpu } from "lucide-react"

export default function PipelinePage() {
  const { transactions } = useLiveTransactions()
  const [activeNode, setActiveNode] = useState(0)
  const [lastProcessed, setLastProcessed] = useState<any>(null)

  useEffect(() => {
    if (transactions.length > 0) {
      const latest = transactions[0]
      if (!lastProcessed || latest.id !== lastProcessed.id) {
        setLastProcessed(latest)
        // Trigger animation sequence
        setActiveNode(1)
        setTimeout(() => setActiveNode(2), 300)
        setTimeout(() => setActiveNode(3), 600)
        setTimeout(() => setActiveNode(4), 900)
        setTimeout(() => setActiveNode(5), 1200)
        setTimeout(() => setActiveNode(6), 1500)
        setTimeout(() => setActiveNode(7), 1800)
        setTimeout(() => setActiveNode(8), 2100)
      }
    }
  }, [transactions, lastProcessed])

  const nodes = [
    { id: 1, title: "Ingestion API", desc: "Receives raw payload", icon: Activity },
    { id: 2, title: "Validation", desc: "Schema checks (Zod)", icon: CheckCircle2 },
    { id: 3, title: "Feature Engineering", desc: "Extracting temporal/spatial features", icon: Network },
    { id: 4, title: "Scaling", desc: "MinMax Normalization", icon: Cpu },
    { id: 5, title: "ML Model (XGBoost)", desc: "Inference & Probability", icon: BrainCircuit },
    { id: 6, title: "Explainability (SHAP)", desc: "Feature contributions", icon: Lock },
    { id: 7, title: "Risk Engine", desc: "Business thresholds", icon: AlertTriangle },
    { id: 8, title: "PostgreSQL & SSE", desc: "Storage & Broadcast", icon: Database },
  ]

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2 mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Live AI Pipeline</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Pipeline Visualization */}
        <div className="col-span-2 rounded-xl border bg-card text-card-foreground shadow p-8">
          <div className="relative flex flex-col items-center justify-center space-y-8">
            {nodes.map((node, index) => {
              const isActive = activeNode === node.id
              const isPast = activeNode > node.id

              return (
                <div key={node.id} className="relative w-full max-w-md flex items-center">
                  <motion.div 
                    initial={{ opacity: 0.5, scale: 0.95 }}
                    animate={{ 
                      opacity: isActive ? 1 : isPast ? 0.8 : 0.4,
                      scale: isActive ? 1.05 : 1,
                      borderColor: isActive ? "hsl(var(--primary))" : "hsl(var(--border))"
                    }}
                    transition={{ duration: 0.3 }}
                    className={`flex-1 rounded-lg border-2 p-4 flex items-center space-x-4 bg-background z-10`}
                  >
                    <div className={`p-3 rounded-full ${isActive ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                      <node.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className={`font-semibold ${isActive ? 'text-primary' : ''}`}>{node.title}</h4>
                      <p className="text-sm text-muted-foreground">{node.desc}</p>
                    </div>
                  </motion.div>

                  {/* Connecting Line */}
                  {index < nodes.length - 1 && (
                    <div className="absolute left-[50%] -bottom-8 h-8 w-[2px] bg-border -translate-x-1/2 z-0">
                      <motion.div
                        className="w-full bg-primary"
                        initial={{ height: "0%" }}
                        animate={{ height: isPast ? "100%" : "0%" }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Real-time Data Output */}
        <div className="col-span-1 space-y-6">
          <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
            <h3 className="font-semibold text-lg mb-4">Latest Inference Payload</h3>
            {lastProcessed ? (
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-muted-foreground uppercase">Transaction ID</span>
                  <div className="font-mono text-sm truncate">{lastProcessed.id}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-muted-foreground uppercase">Amount</span>
                    <div className="font-bold">${lastProcessed.amount}</div>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground uppercase">Location</span>
                    <div className="font-bold">{lastProcessed.city}, {lastProcessed.country}</div>
                  </div>
                </div>
                
                {activeNode >= 5 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-4 border-t">
                    <span className="text-xs text-muted-foreground uppercase">ML Risk Score</span>
                    <div className="text-2xl font-bold font-mono text-emerald-500">
                      {(lastProcessed.risk_score * 100).toFixed(2)}%
                    </div>
                  </motion.div>
                )}

                {activeNode >= 6 && lastProcessed.feature_importance && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-4 border-t">
                    <span className="text-xs text-muted-foreground uppercase mb-2 block">Top SHAP Drivers</span>
                    <div className="space-y-2">
                      {lastProcessed.feature_importance.slice(0, 3).map((feat: any) => (
                        <div key={feat.feature} className="flex items-center justify-between text-sm">
                          <span className="font-medium">{feat.feature}</span>
                          <span className={feat.contribution > 0 ? "text-destructive" : "text-emerald-500"}>
                            {feat.contribution > 0 ? '+' : ''}{feat.contribution.toFixed(3)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeNode >= 7 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-4 border-t">
                    <span className="text-xs text-muted-foreground uppercase mb-2 block">Decision Engine</span>
                    <div className="flex items-center space-x-2">
                      {lastProcessed.status === 'APPROVED' ? <CheckCircle2 className="text-emerald-500" /> :
                       lastProcessed.status === 'FLAGGED' ? <AlertTriangle className="text-yellow-500" /> :
                       <XCircle className="text-destructive" />}
                      <span className="font-bold">{lastProcessed.status}</span>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 text-muted-foreground text-sm text-center">
                Waiting for incoming transaction stream...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
