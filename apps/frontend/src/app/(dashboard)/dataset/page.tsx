"use client"

import { useEffect, useState } from "react"
import { Database, FileJson, BarChart3, PieChart, Activity } from "lucide-react"
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

interface DatasetStats {
  name: string
  total_rows: number
  total_features: number
  fraud_ratio: number
  class_distribution: {
    normal: number
    fraud: number
  }
  missing_values_percentage: number
  feature_statistics: Array<{
    feature: string
    type: string
    mean?: number
    std?: number
    unique_values?: number
  }>
  is_historical_record: boolean
}

export default function DatasetExplorerPage() {
  const [stats, setStats] = useState<DatasetStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}/mlops/dataset`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats(data.data)
        }
        setIsLoading(false)
      })
      .catch(err => {
        console.error("Failed to fetch dataset stats", err)
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading dataset statistics...</div>
  }

  if (!stats) {
    return <div className="p-8 text-center text-destructive">Failed to load dataset statistics.</div>
  }

  const pieData = [
    { name: 'Normal', value: stats.class_distribution.normal, color: '#10b981' },
    { name: 'Fraud', value: stats.class_distribution.fraud, color: '#ef4444' }
  ]

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dataset Explorer</h2>
        <div className="flex items-center space-x-2">
          {stats.is_historical_record && (
            <span className="rounded bg-secondary px-2 py-1 text-xs font-medium text-muted-foreground">Historical Dataset (Kaggle IEEE-CIS)</span>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Rows</h3>
            <Database className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{stats.total_rows.toLocaleString()}</div>
          </div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Features</h3>
            <FileJson className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{stats.total_features}</div>
          </div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Fraud Ratio</h3>
            <Activity className="h-4 w-4 text-destructive" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold text-destructive">{(stats.fraud_ratio * 100).toFixed(2)}%</div>
          </div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Missing Values</h3>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{stats.missing_values_percentage}%</div>
            <p className="text-xs text-muted-foreground mt-1">Requires imputation</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow col-span-4">
          <div className="p-6 flex flex-col space-y-1.5">
            <h3 className="font-semibold leading-none tracking-tight">Feature Statistics</h3>
            <p className="text-sm text-muted-foreground">Key feature distributions from the training set.</p>
          </div>
          <div className="p-6 pt-0">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Feature</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Mean</th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Std Dev</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {stats.feature_statistics.map((feat) => (
                    <tr key={feat.feature} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle font-medium">{feat.feature}</td>
                      <td className="p-4 align-middle">
                        <span className="rounded bg-secondary px-2 py-1 text-xs">{feat.type}</span>
                      </td>
                      <td className="p-4 align-middle text-right">{feat.mean?.toFixed(2) || '-'}</td>
                      <td className="p-4 align-middle text-right">{feat.std?.toFixed(2) || feat.unique_values?.toString() || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow col-span-3">
          <div className="p-6 flex flex-col space-y-1.5">
            <h3 className="font-semibold leading-none tracking-tight">Class Imbalance</h3>
            <p className="text-sm text-muted-foreground">Target variable distribution (isFraud)</p>
          </div>
          <div className="p-6 pt-0 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => value.toLocaleString()}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
