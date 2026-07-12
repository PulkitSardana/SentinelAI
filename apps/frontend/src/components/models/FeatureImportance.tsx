"use client"

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function FeatureImportance() {
  const { data, error, isLoading } = useSWR('http://localhost:8000/api/v1/monitoring/feature-importance', fetcher, {
    refreshInterval: 10000 // Poll every 10s
  })

  const chartData = data?.data || []
  return (
    <Card className="bg-slate-900 border-slate-800 shadow-xl">
      <CardHeader>
        <CardTitle className="text-slate-100">Feature Importance Shift</CardTitle>
        <CardDescription className="text-slate-400">
          Comparing baseline (training) vs. current production weights.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[0, 1]} />
              <YAxis type="category" dataKey="feature" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} width={80} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }}
                cursor={{ fill: '#1e293b' }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Bar dataKey="baseline" name="Training Baseline" fill="#475569" radius={[0, 4, 4, 0]} />
              <Bar dataKey="current" name="Current Production" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
