"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, Activity, CheckCircle, Clock } from "lucide-react"

const METRICS = [
  { label: "Active Analysts", value: "24", change: "+2", icon: Users, trend: "up" },
  { label: "Cases Closed (24h)", value: "1,204", change: "+15%", icon: CheckCircle, trend: "up" },
  { label: "Avg Triage Time", value: "4m 12s", change: "-12s", icon: Clock, trend: "down" }, // Down is good for time
  { label: "False Positive Rate", value: "12.4%", change: "+1.2%", icon: Activity, trend: "up" }, // Up is bad for FPR, but we just want to show it
]

export function AnalystPerformance() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {METRICS.map((metric) => (
        <Card key={metric.label} className="bg-slate-900 border-slate-800 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              {metric.label}
            </CardTitle>
            <metric.icon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">{metric.value}</div>
            <p className={`text-xs mt-1 font-medium ${
              metric.trend === 'up' && metric.label === 'False Positive Rate' ? 'text-red-400' :
              metric.trend === 'up' ? 'text-emerald-400' :
              metric.trend === 'down' && metric.label === 'Avg Triage Time' ? 'text-emerald-400' :
              'text-red-400'
            }`}>
              {metric.change} from previous shift
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
