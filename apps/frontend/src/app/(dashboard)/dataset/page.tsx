"use client"

import { useEffect, useState } from "react"
import { Database, FileJson, BarChart3, PieChart, Activity, HardDrive } from "lucide-react"
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { PageTransition } from "@/components/layout/page-transition"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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

const MOCK_DATASET: DatasetStats = {
  name: "IEEE-CIS Fraud Detection",
  total_rows: 590540,
  total_features: 394,
  fraud_ratio: 0.0349,
  class_distribution: {
    normal: 569877,
    fraud: 20663
  },
  missing_values_percentage: 12.4,
  feature_statistics: [
    { feature: "TransactionAmt", type: "float64", mean: 135.02, std: 239.16 },
    { feature: "ProductCD", type: "category", unique_values: 5 },
    { feature: "card1", type: "int64", mean: 9898.73, std: 4901.17 },
    { feature: "card2", type: "float64", mean: 362.55, std: 157.79 },
    { feature: "P_emaildomain", type: "category", unique_values: 60 },
    { feature: "C1", type: "float64", mean: 14.09, std: 133.56 },
    { feature: "V310", type: "float64", mean: 118.19, std: 395.92 },
  ],
  is_historical_record: true
}

export default function DatasetExplorerPage() {
  const [stats, setStats] = useState<DatasetStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}/mlops/dataset`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setStats(data.data)
        } else {
          setStats(MOCK_DATASET)
        }
        setIsLoading(false)
      })
      .catch(err => {
        console.error("Failed to fetch dataset stats, using mock data", err)
        setStats(MOCK_DATASET)
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500 font-mono text-sm">Loading dataset statistics...</div>
  }

  if (!stats) {
    return <div className="p-8 text-center text-red-500">Failed to load dataset statistics.</div>
  }

  const pieData = [
    { name: 'Normal', value: stats.class_distribution.normal, color: '#10b981' }, // Emerald-500
    { name: 'Fraud', value: stats.class_distribution.fraud, color: '#ef4444' } // Red-500
  ]

  return (
    <PageTransition>
      <div className="flex-1 space-y-6 p-6 max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
              <HardDrive className="h-8 w-8 text-blue-500" />
              Dataset Explorer
            </h2>
            <p className="text-slate-400 mt-2">
              Analyze feature distributions, data quality, and class imbalances.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {stats.is_historical_record && (
              <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-700 py-1.5 px-3">
                Historical Dataset (Kaggle IEEE-CIS)
              </Badge>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-slate-900/50 backdrop-blur border-slate-800 shadow-lg hover:-translate-y-1 transition-transform duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-wider">Total Rows</CardTitle>
              <Database className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-100">{stats.total_rows.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/50 backdrop-blur border-slate-800 shadow-lg hover:-translate-y-1 transition-transform duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-wider">Total Features</CardTitle>
              <FileJson className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-100">{stats.total_features}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/50 backdrop-blur border-slate-800 shadow-lg hover:-translate-y-1 transition-transform duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-wider">Fraud Ratio</CardTitle>
              <Activity className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-400">{(stats.fraud_ratio * 100).toFixed(2)}%</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/50 backdrop-blur border-slate-800 shadow-lg hover:-translate-y-1 transition-transform duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-wider">Missing Values</CardTitle>
              <BarChart3 className="h-4 w-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-400">{stats.missing_values_percentage}%</div>
              <p className="text-xs text-slate-500 mt-1">Requires imputation</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="bg-slate-900/50 backdrop-blur border-slate-800 shadow-xl lg:col-span-4 overflow-hidden">
            <CardHeader className="border-b border-slate-800/60 bg-slate-900/80">
              <CardTitle className="text-lg text-slate-200">Feature Statistics</CardTitle>
              <p className="text-sm text-slate-400">Key feature distributions from the training set.</p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative w-full overflow-auto max-h-[400px]">
                <table className="w-full caption-bottom text-sm">
                  <thead className="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-10">
                    <tr>
                      <th className="h-10 px-6 text-left align-middle font-medium text-slate-400">Feature</th>
                      <th className="h-10 px-4 text-left align-middle font-medium text-slate-400">Type</th>
                      <th className="h-10 px-4 text-right align-middle font-medium text-slate-400">Mean</th>
                      <th className="h-10 px-6 text-right align-middle font-medium text-slate-400">Std Dev / Unique</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.feature_statistics.map((feat) => (
                      <tr key={feat.feature} className="border-b border-slate-800/50 hover:bg-slate-800/40 transition-colors">
                        <td className="p-3 px-6 align-middle font-mono text-blue-400 font-medium">{feat.feature}</td>
                        <td className="p-3 px-4 align-middle">
                          <span className="rounded bg-slate-800 px-2 py-1 text-[10px] uppercase font-bold tracking-wider text-slate-300 border border-slate-700">{feat.type}</span>
                        </td>
                        <td className="p-3 px-4 align-middle text-right text-slate-300 font-mono">
                          {feat.mean !== undefined ? feat.mean.toFixed(2) : <span className="text-slate-600">-</span>}
                        </td>
                        <td className="p-3 px-6 align-middle text-right text-slate-300 font-mono">
                          {feat.std !== undefined ? feat.std.toFixed(2) : (feat.unique_values !== undefined ? <span className="text-amber-400">{feat.unique_values} unique</span> : <span className="text-slate-600">-</span>)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur border-slate-800 shadow-xl lg:col-span-3 flex flex-col">
            <CardHeader className="border-b border-slate-800/60 bg-slate-900/80">
              <CardTitle className="text-lg text-slate-200">Class Imbalance</CardTitle>
              <p className="text-sm text-slate-400">Target variable distribution (isFraud)</p>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center p-6 min-h-[350px]">
              <div className="w-full h-full min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: `drop-shadow(0px 0px 4px ${entry.color}40)` }} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: any) => typeof value === 'number' ? value.toLocaleString() : value}
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc', borderRadius: '0.5rem' }}
                      itemStyle={{ color: '#f8fafc' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 w-full">
                <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800 text-center">
                  <div className="text-sm text-slate-400 mb-1">Normal</div>
                  <div className="text-xl font-bold text-emerald-500">{stats.class_distribution.normal.toLocaleString()}</div>
                </div>
                <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800 text-center">
                  <div className="text-sm text-slate-400 mb-1">Fraud</div>
                  <div className="text-xl font-bold text-red-500">{stats.class_distribution.fraud.toLocaleString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  )
}
