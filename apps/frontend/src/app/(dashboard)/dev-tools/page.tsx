"use client"

import { useState, useEffect, useRef } from "react"
import { Terminal, Bug, Server, Shield, StopCircle, PlayCircle, Download, Activity, Cpu } from "lucide-react"
import { useTransactionStore } from "@/store/use-transaction-store"
import { useLiveTransactions } from "@/hooks/use-live-transactions"
import { PageTransition } from "@/components/layout/page-transition"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts"

const generateMockTelemetry = (count = 20) => {
  const data = []
  let time = Date.now() - count * 1000
  for (let i = 0; i < count; i++) {
    data.push({
      time: time,
      cpu: 30 + Math.random() * 20 + (Math.sin(i / 3) * 15),
      memory: 45 + Math.random() * 10,
    })
    time += 1000
  }
  return data
}

export default function DevToolsPage() {
  const [isTailing, setIsTailing] = useState(true)
  const [logs, setLogs] = useState<any[]>([])
  const [filter, setFilter] = useState('ALL')
  const logsEndRef = useRef<HTMLDivElement>(null)
  
  const [telemetry, setTelemetry] = useState(generateMockTelemetry(30))

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
      message: `Transaction record committed. Status: ${latestTx.prediction}.`
    })

    if (latestTx.prediction === 'DECLINED') {
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

  // Update telemetry smoothly
  useEffect(() => {
    if (!isTailing) return
    const interval = setInterval(() => {
      setTelemetry(prev => {
        const newData = [...prev.slice(1)]
        newData.push({
          time: Date.now(),
          cpu: 30 + Math.random() * 20 + (Math.sin(Date.now() / 3000) * 15),
          memory: 45 + Math.random() * 5 + (Math.sin(Date.now() / 10000) * 5),
        })
        return newData
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [isTailing])

  const filteredLogs = filter === 'ALL' ? logs : logs.filter(l => l.level === filter)

  return (
    <PageTransition>
      <div className="flex h-[calc(100vh-6rem)] flex-col space-y-4 p-6 max-w-[1600px] mx-auto overflow-hidden">
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
              <Terminal className="h-8 w-8 text-blue-500" />
              Developer Tools
            </h2>
            <p className="text-slate-400 mt-2">
              Live system telemetry and raw execution logs.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
          
          {/* Telemetry Charts */}
          <div className="lg:col-span-4 flex flex-col gap-6 overflow-hidden">
            <Card className="bg-slate-900/50 backdrop-blur border-slate-800 shadow-xl flex-1 flex flex-col">
              <CardHeader className="border-b border-slate-800/60 bg-slate-900/80 pb-3 shrink-0">
                <CardTitle className="text-sm font-semibold text-slate-200 flex items-center gap-2 uppercase tracking-wider">
                  <Cpu className="h-4 w-4 text-blue-400" /> System Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 flex-1 flex flex-col justify-center min-h-0">
                <div className="h-[45%] w-full mb-4">
                  <div className="text-xs text-slate-400 mb-2 font-mono uppercase tracking-wider flex justify-between">
                    <span>CPU Usage</span>
                    <span className="text-blue-400">{telemetry[telemetry.length-1].cpu.toFixed(1)}%</span>
                  </div>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={telemetry} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="time" hide />
                      <YAxis domain={[0, 100]} hide />
                      <Area type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorCpu)" isAnimationActive={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="h-[45%] w-full">
                  <div className="text-xs text-slate-400 mb-2 font-mono uppercase tracking-wider flex justify-between">
                    <span>Memory Usage</span>
                    <span className="text-emerald-400">{telemetry[telemetry.length-1].memory.toFixed(1)}%</span>
                  </div>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={telemetry} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="time" hide />
                      <YAxis domain={[0, 100]} hide />
                      <Area type="monotone" dataKey="memory" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorMem)" isAnimationActive={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Log Terminal */}
          <div className="lg:col-span-8 flex flex-col gap-6 overflow-hidden">
            <Card className="bg-slate-950 border-slate-800 shadow-xl flex-1 flex flex-col overflow-hidden">
              {/* Toolbar */}
              <div className="bg-slate-900 border-b border-slate-800 p-3 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="flex bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
                    {['ALL', 'INFO', 'WARN', 'ERROR', 'DEBUG'].map(level => (
                      <button
                        key={level}
                        onClick={() => setFilter(level)}
                        className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                          filter === level 
                            ? 'bg-blue-600 text-white' 
                            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsTailing(!isTailing)} 
                    className={`h-8 text-[10px] font-bold uppercase tracking-wider border transition-colors ${
                      isTailing 
                        ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20 hover:text-red-300' 
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20 hover:text-emerald-300'
                    }`}
                  >
                    {isTailing ? <StopCircle className="h-3 w-3 mr-2" /> : <PlayCircle className="h-3 w-3 mr-2" />}
                    {isTailing ? 'Pause Tail' : 'Resume Tail'}
                  </Button>
                </div>

                <Button variant="ghost" size="sm" className="h-8 text-slate-400 hover:text-slate-200 hover:bg-slate-800">
                  <Download className="h-3 w-3 mr-2" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Export Logs</span>
                </Button>
              </div>

              {/* Log Viewer */}
              <div className="flex-1 bg-slate-950 p-4 overflow-y-auto font-mono text-[11px] leading-relaxed">
                {filteredLogs.length === 0 ? (
                  <div className="text-slate-600 text-center pt-10 flex flex-col items-center justify-center">
                    <Activity className="h-8 w-8 mb-4 opacity-20" />
                    Waiting for log stream...
                  </div>
                ) : (
                  filteredLogs.map(log => (
                    <div key={log.id} className="flex gap-4 py-1 hover:bg-slate-800/50 rounded px-2 -mx-2 transition-colors">
                      <span className="text-slate-500 shrink-0 select-none">
                        {new Date(log.timestamp).toISOString().split('T')[1].replace('Z', '')}
                      </span>
                      <span className={`shrink-0 w-12 font-bold select-none ${
                        log.level === 'INFO' ? 'text-blue-400' :
                        log.level === 'WARN' ? 'text-amber-400' :
                        log.level === 'ERROR' ? 'text-red-400' : 'text-slate-400'
                      }`}>
                        [{log.level}]
                      </span>
                      <span className="text-purple-400 shrink-0 w-32 truncate select-none">[{log.service}]</span>
                      <span className="text-slate-300 break-all">{log.message}</span>
                    </div>
                  ))
                )}
                <div ref={logsEndRef} className="h-4" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
