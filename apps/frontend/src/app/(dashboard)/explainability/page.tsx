"use client"

import { useState } from "react"
import { Search, BrainCircuit, ShieldAlert, ArrowRight, Activity, Target } from "lucide-react"
import { useTransactionStore } from "@/store/use-transaction-store"
import { useLiveTransactions } from "@/hooks/use-live-transactions"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

export default function ExplainabilityStudioPage() {
  useLiveTransactions() // Setup SSE
  const { transactions } = useTransactionStore()
  const [searchId, setSearchId] = useState("")
  const [selectedTx, setSelectedTx] = useState<any>(null)

  // Auto-select the first flagged transaction if none is selected
  if (!selectedTx && transactions.length > 0) {
    const flagged = transactions.find((t: any) => t.status === 'FLAGGED' || t.status === 'DECLINED')
    if (flagged) setSelectedTx(flagged)
  }

  const handleSearch = () => {
    const found = transactions.find((t: any) => t.id === searchId)
    if (found) setSelectedTx(found)
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2 mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Explainability Studio</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Search & Selection */}
        <div className="col-span-1 space-y-6">
          <div className="border rounded-xl bg-card shadow p-6">
            <h3 className="font-semibold mb-4 text-sm uppercase text-muted-foreground tracking-wider">Inspect Transaction</h3>
            <div className="flex space-x-2">
              <input 
                type="text" 
                placeholder="Transaction ID..." 
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
              />
              <button onClick={handleSearch} className="rounded-md bg-primary p-2 text-primary-foreground hover:bg-primary/90">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="border rounded-xl bg-card shadow overflow-hidden flex flex-col h-[500px]">
            <div className="p-4 border-b bg-muted/50">
              <h3 className="font-semibold text-sm">Recent High-Risk Cases</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {transactions.filter((t: any) => t.risk_score > 0.5).map((t: any) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTx(t)}
                  className={`w-full text-left p-3 rounded-lg border transition-all text-sm ${
                    selectedTx?.id === t.id 
                      ? "bg-primary/10 border-primary text-primary" 
                      : "bg-background border-transparent hover:bg-muted"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-xs truncate max-w-[150px]">{t.id}</span>
                    <span className={t.status === 'DECLINED' ? "text-destructive font-bold" : "text-yellow-500 font-bold"}>
                      {(t.risk_score * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="text-muted-foreground text-xs flex justify-between">
                    <span>${(t.amount / 100).toFixed(2)}</span>
                    <span>{new Date(t.timestamp).toLocaleTimeString()}</span>
                  </div>
                </button>
              ))}
              {transactions.filter((t: any) => t.risk_score > 0.5).length === 0 && (
                <div className="text-center p-4 text-sm text-muted-foreground mt-10">
                  No high-risk transactions detected recently.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Explanations */}
        <div className="col-span-2 space-y-6">
          {selectedTx ? (
            <>
              {/* Summary Header */}
              <div className="border rounded-xl bg-card shadow p-6 flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold font-mono tracking-tighter">{selectedTx.id}</h3>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                    <span>Amount: <strong className="text-foreground">${(selectedTx.amount / 100).toFixed(2)}</strong></span>
                    <span>•</span>
                    <span>Location: <strong className="text-foreground">{selectedTx.city}, {selectedTx.country}</strong></span>
                    <span>•</span>
                    <span>Time: <strong className="text-foreground">{new Date(selectedTx.timestamp).toLocaleString()}</strong></span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold uppercase text-muted-foreground mb-1">AI Risk Score</div>
                  <div className={`text-4xl font-bold ${
                    selectedTx.risk_score > 0.85 ? 'text-destructive' :
                    selectedTx.risk_score > 0.65 ? 'text-yellow-500' : 'text-emerald-500'
                  }`}>
                    {(selectedTx.risk_score * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* LIME / SHAP Chart */}
              <div className="border rounded-xl bg-card shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <BrainCircuit className="h-5 w-5 text-primary" /> Feature Importance (SHAP)
                    </h3>
                    <p className="text-sm text-muted-foreground">How the ML model weighted each feature to reach its decision.</p>
                  </div>
                  <div className="text-right text-sm">
                    <span className="flex items-center gap-1 text-destructive"><ArrowRight className="h-3 w-3" /> Increases Risk</span>
                    <span className="flex items-center gap-1 text-emerald-500"><ArrowRight className="h-3 w-3" /> Decreases Risk</span>
                  </div>
                </div>

                <div className="h-[300px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={selectedTx.feature_importance || []}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                      <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis dataKey="feature" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={120} />
                      <Tooltip 
                        formatter={(val: any) => typeof val === 'number' ? val.toFixed(4) : val}
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Bar dataKey="contribution" radius={[0, 4, 4, 0]}>
                        {
                          (selectedTx.feature_importance || []).map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.contribution > 0 ? '#ef4444' : '#10b981'} />
                          ))
                        }
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Human Readable Explanation */}
              <div className="border rounded-xl bg-card shadow p-6 flex items-start gap-4 bg-muted/30">
                <ShieldAlert className="h-6 w-6 text-yellow-500 shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Model Reasoning Summary</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedTx.explanation?.human_readable || "The AI system flagged this transaction due to an unusual combination of amount, location, and device patterns that strongly correlate with known fraud typologies in the historical dataset."}
                  </p>
                </div>
              </div>

            </>
          ) : (
            <div className="border rounded-xl bg-card shadow h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center min-h-[500px]">
              <Target className="h-12 w-12 mb-4 text-muted" />
              <h3 className="font-semibold text-lg text-foreground mb-2">Select a Transaction</h3>
              <p className="max-w-sm">Choose a transaction from the list or search by ID to view its Explainability report and feature attributions.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
