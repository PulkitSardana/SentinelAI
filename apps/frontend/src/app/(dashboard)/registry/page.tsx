"use client"

import { useEffect, useState } from "react"
import { Layers, Search, Upload, RefreshCw } from "lucide-react"

interface ModelRecord {
  id: string
  name: string
  version: string
  algorithm: string
  dataset_version: string
  training_date: string
  training_time_seconds: number
  metrics: {
    precision: number
    recall: number
    f1: number
    roc_auc: number
  }
  avg_latency_ms: number
  status: string
  is_historical_record: boolean
}

export default function ModelRegistryPage() {
  const [models, setModels] = useState<ModelRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}`}/mlops/registry`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setModels(data.data)
        }
        setIsLoading(false)
      })
      .catch(err => {
        console.error("Failed to fetch models", err)
        setIsLoading(false)
      })
  }, [])

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Model Registry</h2>
        <div className="flex items-center space-x-2">
          <button className="flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-medium hover:bg-secondary/80">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Upload className="h-4 w-4" />
            Register Model
          </button>
        </div>
      </div>

      <div className="rounded-md border bg-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Layers className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-medium">Production Models</h3>
            <p className="text-sm text-muted-foreground">Manage and promote machine learning models across environments.</p>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center mb-6 max-w-sm px-3 py-2 border rounded-md bg-background">
          <Search className="h-4 w-4 text-muted-foreground mr-2" />
          <input 
            type="text" 
            placeholder="Search models..." 
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>

        {/* Table */}
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Version</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Algorithm</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Dataset</th>
                <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">F1 Score</th>
                <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Precision / Recall</th>
                <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Latency (ms)</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="h-24 text-center">Loading registry data...</td>
                </tr>
              ) : models.length === 0 ? (
                <tr>
                  <td colSpan={8} className="h-24 text-center text-muted-foreground">No models found.</td>
                </tr>
              ) : (
                models.map((model) => (
                  <tr key={model.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle font-medium">
                      {model.name}
                      {model.is_historical_record && (
                        <span className="ml-2 rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground uppercase">Historical</span>
                      )}
                    </td>
                    <td className="p-4 align-middle">{model.version}</td>
                    <td className="p-4 align-middle">{model.algorithm}</td>
                    <td className="p-4 align-middle">{model.dataset_version}</td>
                    <td className="p-4 align-middle text-center font-bold text-emerald-500">
                      {(model.metrics.f1 * 100).toFixed(1)}%
                    </td>
                    <td className="p-4 align-middle text-center">
                      <span className="text-emerald-500 font-medium">{(model.metrics.precision * 100).toFixed(1)}%</span>
                      <span className="text-muted-foreground mx-1">/</span>
                      <span className="text-emerald-500 font-medium">{(model.metrics.recall * 100).toFixed(1)}%</span>
                    </td>
                    <td className="p-4 align-middle text-center">{model.avg_latency_ms.toFixed(1)}ms</td>
                    <td className="p-4 align-middle">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        model.status === 'PRODUCTION' ? 'bg-emerald-500/10 text-emerald-500' :
                        model.status === 'STAGING' ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-secondary text-muted-foreground'
                      }`}>
                        {model.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
