"use client"

import { Activity, ShieldAlert, CheckCircle, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDashboardMetrics } from "@/hooks/use-dashboard-metrics"

export function KPIStats() {
  const { metrics, isLoading } = useDashboardMetrics()

  const stats = [
    {
      title: "Total Transactions",
      value: isLoading ? "..." : new Intl.NumberFormat('en-US').format(metrics?.kpis?.totalTransactions || 0),
      trend: "up",
      icon: Activity,
    },
    {
      title: "Fraud Rate",
      value: isLoading ? "..." : `${(metrics?.kpis?.fraudRate || 0).toFixed(2)}%`,
      trend: "down",
      icon: ShieldAlert,
    },
    {
      title: "Detection Recall",
      value: isLoading ? "..." : `${(metrics?.kpis?.detectionRecall || 0).toFixed(1)}%`,
      trend: "up",
      icon: CheckCircle,
    },
    {
      title: "Avg Inference Latency",
      value: isLoading ? "..." : `${(metrics?.kpis?.avgLatency || 0).toFixed(1)} ms`,
      trend: "down",
      icon: Zap,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className={`text-xs ${stat.trend === "up" && stat.title !== "Fraud Rate" ? "text-emerald-500" : (stat.title === "Fraud Rate" && stat.trend === "down" ? "text-emerald-500" : "text-muted-foreground")}`}>
              Real-time metric
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
