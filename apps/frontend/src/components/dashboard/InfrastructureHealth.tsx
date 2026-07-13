"use client"

import { Server, Database, MessageSquare, Globe, Activity } from "lucide-react"

const healthData = [
  { name: "API Gateway", status: "healthy", latency: "12ms", icon: Globe },
  { name: "ML Inference Engine", status: "healthy", latency: "18ms", icon: Activity },
  { name: "PostgreSQL Database", status: "healthy", latency: "4ms", icon: Database },
  { name: "Redis Cache (Upstash)", status: "healthy", latency: "2ms", icon: Server },
  { name: "BullMQ Workers", status: "warning", latency: "45ms", icon: MessageSquare },
]

export function InfrastructureHealth() {
  return (
    <div className="space-y-4 mt-4">
      {healthData.map((item, i) => (
        <div 
          key={item.name}
          className="flex items-center justify-between p-3 rounded-lg bg-slate-900/40 border border-slate-800 hover:bg-slate-800/60 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-md ${item.status === 'healthy' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
              <item.icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">{item.name}</p>
              <p className="text-xs text-slate-500">Latency: {item.latency}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${item.status === 'healthy' ? 'bg-emerald-400' : 'bg-yellow-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${item.status === 'healthy' ? 'bg-emerald-500' : 'bg-yellow-500'}`}></span>
            </span>
            <span className="text-xs font-medium text-slate-400 capitalize">{item.status}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
