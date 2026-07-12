"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { useDashboardMetrics } from "@/hooks/use-dashboard-metrics"

export function DistributionChart() {
  const { metrics, isLoading } = useDashboardMetrics()

  // Use live data if available, otherwise fallback to empty state
  const data = metrics?.distribution || [
    { name: "Approved", value: 0, color: "#10b981" },
    { name: "Flagged", value: 0, color: "#eab308" },
    { name: "Declined (Fraud)", value: 0, color: "#ef4444" },
  ]

  return (
    <div className="h-[400px] w-full">
      {isLoading ? (
        <div className="h-full flex items-center justify-center text-muted-foreground">
          Loading live distribution...
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={80}
              outerRadius={130}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: any) => new Intl.NumberFormat('en-US').format(Number(value) || 0)}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
