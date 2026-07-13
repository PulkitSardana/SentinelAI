"use client"

import { Activity, ShieldCheck, Database, Server } from "lucide-react"

export default function ModelMonitoringPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2 mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Model Monitoring</h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Inference Latency (Avg)</h3>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold font-mono">14.2ms</div>
          <p className="text-xs text-muted-foreground mt-1 text-emerald-500">Normal</p>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Data Drift Score</h3>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold font-mono">0.024</div>
          <p className="text-xs text-muted-foreground mt-1 text-emerald-500">No significant drift</p>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Queue Length</h3>
            <Database className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold font-mono">0</div>
          <p className="text-xs text-muted-foreground mt-1">BullMQ processing idle</p>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Service Health</h3>
            <Server className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono">Online</div>
          <p className="text-xs text-muted-foreground mt-1">Uptime: 99.99%</p>
        </div>
      </div>

      <div className="rounded-xl border bg-card shadow p-8 text-center text-muted-foreground">
        <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-semibold text-foreground mb-2">Live Telemetry Coming Soon</h3>
        <p className="max-w-md mx-auto">This page will soon integrate with Prometheus and Grafana for deep model observability, feature drift visualization, and active learning loop triggers.</p>
      </div>
    </div>
  )
}
