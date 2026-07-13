"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useLiveTransactions } from "@/hooks/use-live-transactions"
import { useTransactionStore } from "@/store/use-transaction-store"
import { Activity, Database, CheckCircle2, AlertTriangle, XCircle, BrainCircuit, Lock, Network, Cpu, Zap } from "lucide-react"
import { PageTransition } from "@/components/layout/page-transition"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function PipelinePage() {
  useLiveTransactions()
  const { transactions } = useTransactionStore()
  const [activeNode, setActiveNode] = useState(0)
  const [lastProcessed, setLastProcessed] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (transactions.length > 0 && !isProcessing) {
      const latest = transactions[0]
      if (!lastProcessed || latest.id !== lastProcessed.id) {
        setLastProcessed(latest)
        setIsProcessing(true)
        // Trigger animation sequence
        setActiveNode(1)
        setTimeout(() => setActiveNode(2), 400)
        setTimeout(() => setActiveNode(3), 800)
        setTimeout(() => setActiveNode(4), 1200)
        setTimeout(() => setActiveNode(5), 1600)
        setTimeout(() => setActiveNode(6), 2000)
        setTimeout(() => setActiveNode(7), 2400)
        setTimeout(() => {
          setActiveNode(8)
          setIsProcessing(false)
        }, 2800)
      }
    }
  }, [transactions, lastProcessed, isProcessing])

  const nodes = [
    { id: 1, title: "Ingestion API", desc: "Receives raw JSON payload", icon: Activity },
    { id: 2, title: "Validation", desc: "Zod Schema & Type Checks", icon: CheckCircle2 },
    { id: 3, title: "Feature Engineering", desc: "Temporal & Spatial Extraction", icon: Network },
    { id: 4, title: "Scaling", desc: "MinMax Normalization & Encoding", icon: Cpu },
    { id: 5, title: "ML Model (XGBoost)", desc: "Inference & Probability Scoring", icon: BrainCircuit },
    { id: 6, title: "Explainability", desc: "TreeSHAP Contributions", icon: Lock },
    { id: 7, title: "Risk Engine", desc: "Business Threshold Rules", icon: AlertTriangle },
    { id: 8, title: "PostgreSQL & SSE", desc: "Persistent Storage & Broadcast", icon: Database },
  ]

  return (
    <PageTransition>
      <div className="flex h-[calc(100vh-6rem)] flex-col space-y-6 p-6 max-w-[1600px] mx-auto overflow-hidden">
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
              <Zap className="h-8 w-8 text-blue-500" />
              Live AI Pipeline
            </h2>
            <p className="text-slate-400 mt-2">
              Real-time visualization of the inference graph and data transformations.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 shadow-inner">
            <span className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isProcessing ? 'bg-blue-400' : 'bg-emerald-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isProcessing ? 'bg-blue-500' : 'bg-emerald-500'}`}></span>
            </span>
            <span className="text-xs font-mono text-slate-300 font-medium">
              {isProcessing ? "PROCESSING PACKET" : "AWAITING INGESTION"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
          {/* Pipeline Visualization */}
          <Card className="lg:col-span-8 bg-slate-900/50 backdrop-blur border-slate-800 shadow-xl overflow-y-auto">
            <CardContent className="p-8 relative">
              
              {/* Background Flow Path */}
              <div className="absolute top-12 bottom-12 left-[4.5rem] w-1 bg-slate-800 rounded-full z-0" />
              
              {/* Animated Flowing Packets */}
              {isProcessing && activeNode < 8 && (
                <motion.div
                  className="absolute left-[4.5rem] w-2 h-8 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,1)] rounded-full z-10 -ml-[2px]"
                  initial={{ top: `${(activeNode - 1) * 110 + 48}px`, opacity: 0 }}
                  animate={{ top: `${activeNode * 110 + 48}px`, opacity: 1 }}
                  transition={{ duration: 0.4, ease: "linear" }}
                />
              )}

              <div className="relative flex flex-col space-y-0 h-full justify-between">
                {nodes.map((node, index) => {
                  const isActive = activeNode === node.id
                  const isPast = activeNode > node.id
                  const isPending = activeNode < node.id

                  return (
                    <div key={node.id} className="relative w-full flex items-center h-[110px]">
                      <motion.div 
                        initial={{ opacity: 0.5, scale: 0.95, x: -10 }}
                        animate={{ 
                          opacity: isActive ? 1 : isPast ? 0.7 : 0.4,
                          scale: isActive ? 1.02 : 1,
                          x: isActive ? 10 : 0,
                        }}
                        transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                        className={`flex-1 rounded-xl border p-4 flex items-center gap-6 z-20 ml-[3rem] transition-colors duration-300 ${
                          isActive 
                            ? "bg-slate-800/90 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.15)]" 
                            : "bg-slate-900/60 border-slate-800 shadow-sm hover:border-slate-700"
                        }`}
                      >
                        <div className={`p-4 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ${
                          isActive 
                            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                            : isPast
                            ? 'bg-slate-800 text-slate-300'
                            : 'bg-slate-950 text-slate-600'
                        }`}>
                          <node.icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-bold text-lg mb-1 ${isActive ? 'text-blue-100' : isPast ? 'text-slate-300' : 'text-slate-500'}`}>
                            {node.title}
                          </h4>
                          <p className={`text-sm truncate ${isActive ? 'text-blue-200' : 'text-slate-500'}`}>
                            {node.desc}
                          </p>
                        </div>
                        {isPast && (
                          <div className="shrink-0 mr-2">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500/50" />
                          </div>
                        )}
                      </motion.div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Real-time Data Output */}
          <div className="lg:col-span-4 flex flex-col gap-6 overflow-hidden">
            <Card className="bg-slate-900/50 backdrop-blur border-slate-800 shadow-xl flex-1 flex flex-col overflow-hidden">
              <CardHeader className="border-b border-slate-800/60 bg-slate-900/80 pb-4 shrink-0">
                <CardTitle className="text-lg font-semibold text-slate-200 flex items-center justify-between">
                  Inspector
                  {lastProcessed && (
                    <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-700 font-mono text-[10px]">
                      {activeNode < 8 ? "PROCESSING" : "COMPLETED"}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 flex-1 overflow-y-auto space-y-6 relative">
                {lastProcessed ? (
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={lastProcessed.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-800/50">
                        <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-1">Transaction ID</span>
                        <div className="font-mono text-sm text-blue-400 truncate">{lastProcessed.id}</div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-800/50">
                          <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-1">Amount</span>
                          <div className="font-bold text-lg text-slate-200">${(lastProcessed.amount / 100).toFixed(2)}</div>
                        </div>
                        <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-800/50">
                          <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-1">Location</span>
                          <div className="font-bold text-sm text-slate-200 truncate">{lastProcessed.city}, {lastProcessed.country}</div>
                        </div>
                      </div>
                      
                      <AnimatePresence>
                        {activeNode >= 5 && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }} 
                            animate={{ opacity: 1, height: "auto" }} 
                            className="bg-slate-950/50 rounded-lg p-4 border border-slate-800/50 overflow-hidden"
                          >
                            <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-2">ML Risk Score</span>
                            <div className="flex items-end gap-3">
                              <div className={`text-4xl font-bold font-mono tracking-tighter ${
                                lastProcessed.risk_score > 0.8 ? 'text-red-500' :
                                lastProcessed.risk_score > 0.4 ? 'text-amber-500' : 'text-emerald-500'
                              }`}>
                                {(lastProcessed.risk_score * 100).toFixed(1)}%
                              </div>
                              <div className="text-sm text-slate-500 mb-1">probability</div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <AnimatePresence>
                        {activeNode >= 6 && lastProcessed.feature_importance && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }} 
                            animate={{ opacity: 1, height: "auto" }} 
                            className="bg-slate-950/50 rounded-lg p-4 border border-slate-800/50 overflow-hidden"
                          >
                            <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-3">Top SHAP Drivers</span>
                            <div className="space-y-3">
                              {lastProcessed.feature_importance.slice(0, 3).map((feat: any) => (
                                <div key={feat.feature} className="flex flex-col gap-1">
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="font-mono text-slate-300 truncate pr-4">{feat.feature}</span>
                                    <span className={`font-mono font-medium shrink-0 ${feat.contribution > 0 ? "text-red-400" : "text-emerald-400"}`}>
                                      {feat.contribution > 0 ? '+' : ''}{feat.contribution.toFixed(3)}
                                    </span>
                                  </div>
                                  <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden flex">
                                    <div className="w-1/2 flex justify-end">
                                      {feat.contribution < 0 && (
                                        <div className="h-full bg-emerald-500 rounded-l-full" style={{ width: `${Math.min(Math.abs(feat.contribution) * 100, 100)}%` }} />
                                      )}
                                    </div>
                                    <div className="w-px h-full bg-slate-700 z-10" />
                                    <div className="w-1/2 flex justify-start">
                                      {feat.contribution > 0 && (
                                        <div className="h-full bg-red-500 rounded-r-full" style={{ width: `${Math.min(Math.abs(feat.contribution) * 100, 100)}%` }} />
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <AnimatePresence>
                        {activeNode >= 7 && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            className={`rounded-lg p-4 border flex items-center justify-between ${
                              lastProcessed.status === 'APPROVED' ? 'bg-emerald-500/10 border-emerald-500/20' :
                              lastProcessed.status === 'FLAGGED' ? 'bg-amber-500/10 border-amber-500/20' :
                              'bg-red-500/10 border-red-500/20'
                            }`}
                          >
                            <span className="text-xs uppercase tracking-wider font-bold text-slate-300 block">Final Decision</span>
                            <div className="flex items-center gap-2">
                              {lastProcessed.status === 'APPROVED' ? <CheckCircle2 className="h-5 w-5 text-emerald-400" /> :
                               lastProcessed.status === 'FLAGGED' ? <AlertTriangle className="h-5 w-5 text-amber-400" /> :
                               <XCircle className="h-5 w-5 text-red-400" />}
                              <span className={`font-black tracking-widest ${
                                lastProcessed.status === 'APPROVED' ? 'text-emerald-400' :
                                lastProcessed.status === 'FLAGGED' ? 'text-amber-400' :
                                'text-red-400'
                              }`}>{lastProcessed.status}</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-slate-500">
                    <Activity className="h-12 w-12 mb-4 opacity-20 text-blue-500" />
                    <p className="text-sm font-medium">Waiting for inference stream...</p>
                    <p className="text-xs mt-2 opacity-50">Transactions will appear here automatically.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
