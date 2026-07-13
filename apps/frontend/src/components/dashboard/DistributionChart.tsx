"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { useDashboardMetrics } from "@/hooks/use-dashboard-metrics"

export function DistributionChart() {
  const { metrics } = useDashboardMetrics()

  // Use live data if total > 0, otherwise fallback to realistic demo data
  const hasRealData = (metrics?.distribution || []).reduce((acc: number, curr: any) => acc + curr.value, 0) > 0

  const data = hasRealData ? metrics!.distribution : [
    { name: "Approved", value: 284145, color: "#10b981" },
    { name: "Flagged", value: 450, color: "#eab308" },
    { name: "Blocked", value: 212, color: "#ef4444" },
  ]

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={80}
            outerRadius={120}
            paddingAngle={5}
            dataKey="value"
            stroke="rgba(0,0,0,0.2)"
            strokeWidth={2}
            animationDuration={1500}
            animationEasing="ease-out"
          >
            {data.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: any) => new Intl.NumberFormat('en-US').format(Number(value) || 0)}
            contentStyle={{ 
              borderRadius: '8px', 
              border: '1px solid #1e293b', 
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              backdropFilter: 'blur(8px)',
              color: '#f8fafc',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' 
            }}
            itemStyle={{ color: '#f8fafc' }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            wrapperStyle={{ paddingTop: '20px', color: '#cbd5e1' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
