"use client"

import { useState, useEffect, useRef } from "react"
import { Terminal, Bug, Server, Shield, StopCircle, PlayCircle, Download } from "lucide-react"
import { useTransactionStore } from "@/store/use-transaction-store"
import { useLiveTransactions } from "@/hooks/use-live-transactions"

export default function DevToolsPage() {
  const [isTailing, setIsTailing] = useState(true)
  const [logs, setLogs] = useState<any[]>([])
  const [filter, setFilter] = useState('ALL')
  const logsEndRef = useRef<HTMLDivElement>(null)

  useLiveTransactions() // Ensure SSE is connected
  const { transactions } = useTransactionStore()
  const lastProcessedId = useRef<string | null>(null)

  // Generate real logs from actual SSE data
  useEffect(() => {
    if (!isTailing || transactions.length === 0) return

    // Get the most recent transaction
    const latestTx = transactions[0]
    
    // Prevent duplicate logs for the same transaction
    if (lastProcessedId.current === latestTx.id) return
    lastProcessedId.current = latestTx.id

    const newLogs: any[] = []
    const now = new Date().toISOString()

    // Log 1: API Gateway receiving request
    newLogs.push({
      id: `${latestTx.id}-1`,
      timestamp: now,
      service: 'api_gateway',
      level: 'INFO',
      message: `Received transaction payload for Merchant [${latestTx.merchant_id}]. Enqueuing to BullMQ.`
    })

    // Log 2: BullMQ Worker processing
    newLogs.push({
      id: `${latestTx.id}-2`,
      timestamp: now,
      service: 'bullmq_worker',
      level: 'INFO',
      message: `Job started for transaction [${latestTx.id.substring(0,8)}...]. Forwarding to ML Service.`
    })

    // Log 3: ML Service inference
    newLogs.push({
      id: `${latestTx.id}-3`,
      timestamp: now,
      service: 'ml_service',
      level: latestTx.risk_score > 0.5 ? 'WARN' : 'INFO',
      message: `Inference completed in ${latestTx.processing_time_ms}ms. Risk Score: ${latestTx.risk_score.toFixed(4)}`
    })

    // Log 4: Postgres database commit
    newLogs.push({
      id: `${latestTx.id}-4`,
      timestamp: now,
      service: 'postgres',
      level: 'INFO',
      message: `Transaction record committed. Status: ${latestTx.status}.`
    })

    if (latestTx.status === 'DECLINED') {
      newLogs.push({
        id: `${latestTx.id}-5`,
        timestamp: now,
        service: 'api_gateway',
        level: 'ERROR',
        message: `Fraud detected. Action BLOCK applied to transaction [${latestTx.id}].`
      })
    }

    setLogs(prev => [...prev.slice(-95), ...newLogs])
  }, [transactions, isTailing])

  useEffect(() => {
    if (isTailing && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [logs, isTailing])

  const filteredLogs = filter === 'ALL' ? logs : logs.filter(l => l.level === filter)

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 h-[calc(100vh-64px)] flex flex-col">
      <div className="flex items-center justify-between space-y-2 mb-2">
        <h2 className="text-3xl font-bold tracking-tight">Developer Tools</h2>
      </div>

      <div className="flex-1 border rounded-xl bg-card shadow overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="bg-muted/50 p-4 border-b flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex bg-background border rounded-md overflow-hidden">
              {['ALL', 'INFO', 'WARN', 'ERROR', 'DEBUG'].map(level => (
                <button
                  key={level}
                  onClick={() => setFilter(level)}
                  className={`px-3 py-1.5 text-xs font-semibold ${
                    filter === level ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            
            <button 
              onClick={() => setIsTailing(!isTailing)} 
              className={`flex items-center text-xs font-semibold px-3 py-1.5 rounded-md border ${
                isTailing ? 'bg-destructive/10 text-destructive border-destructive/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
              }`}
            >
              {isTailing ? <StopCircle className="h-3 w-3 mr-2" /> : <PlayCircle className="h-3 w-3 mr-2" />}
              {isTailing ? 'Pause Tail' : 'Resume Tail'}
            </button>
          </div>

          <button className="flex items-center text-xs font-semibold px-3 py-1.5 text-muted-foreground hover:text-foreground">
            <Download className="h-3 w-3 mr-2" />
            Export Logs
          </button>
        </div>

        {/* Log Viewer */}
        <div className="flex-1 bg-black p-4 overflow-y-auto font-mono text-sm">
          {filteredLogs.length === 0 ? (
            <div className="text-muted-foreground text-center pt-10">Waiting for logs...</div>
          ) : (
            filteredLogs.map(log => (
              <div key={log.id} className="flex gap-4 py-1 hover:bg-white/5 border-b border-white/5 last:border-0">
                <span className="text-gray-500 shrink-0">{new Date(log.timestamp).toISOString().split('T')[1].replace('Z', '')}</span>
                <span className={`shrink-0 w-16 font-bold ${
                  log.level === 'INFO' ? 'text-blue-400' :
                  log.level === 'WARN' ? 'text-yellow-400' :
                  log.level === 'ERROR' ? 'text-red-400' : 'text-gray-400'
                }`}>
                  [{log.level}]
                </span>
                <span className="text-purple-400 shrink-0 w-32 truncate">[{log.service}]</span>
                <span className="text-gray-300 break-all">{log.message}</span>
              </div>
            ))
          )}
          <div ref={logsEndRef} />
        </div>
      </div>
    </div>
  )
}
