"use client"

import { useEffect, useState } from "react"
import { Layers, Search, Upload, RefreshCw, Star } from "lucide-react"
import { PageTransition } from "@/components/layout/page-transition"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

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

const MOCK_MODELS: ModelRecord[] = [
  {
    id: "MOD-XGB-V4",
    name: "XGB-Fraud-Core",
    version: "v4.0.2",
    algorithm: "XGBoost",
    dataset_version: "ds_2026_q2_full",
    training_date: "2026-07-10T14:30:00Z",
    training_time_seconds: 4500,
    metrics: { precision: 0.992, recall: 0.988, f1: 0.990, roc_auc: 0.995 },
    avg_latency_ms: 18.2,
    status: "PRODUCTION",
    is_historical_record: false
  },
  {
    id: "MOD-NN-V1",
    name: "DeepFraud-Graph-Net",
    version: "v1.1.0",
    algorithm: "GNN (PyTorch)",
    dataset_version: "ds_2026_q2_graphs",
    training_date: "2026-07-12T08:15:00Z",
    training_time_seconds: 18500,
    metrics: { precision: 0.995, recall: 0.991, f1: 0.993, roc_auc: 0.998 },
    avg_latency_ms: 45.5,
    status: "STAGING",
    is_historical_record: false
  },
  {
    id: "MOD-XGB-V3",
    name: "XGB-Fraud-Core",
    version: "v3.8.5",
    algorithm: "XGBoost",
    dataset_version: "ds_2026_q1_full",
    training_date: "2026-04-10T14:30:00Z",
    training_time_seconds: 4200,
    metrics: { precision: 0.985, recall: 0.980, f1: 0.982, roc_auc: 0.989 },
    avg_latency_ms: 17.5,
    status: "ARCHIVED",
    is_historical_record: true
  }
]

export default function ModelRegistryPage() {
  const [models, setModels] = useState<ModelRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}/mlops/registry`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.length > 0) {
          setModels(data.data)
        } else {
          setModels(MOCK_MODELS) // Fallback for demo realism
        }
        setIsLoading(false)
      })
      .catch(err => {
        console.error("Failed to fetch models, using mock data", err)
        setModels(MOCK_MODELS)
        setIsLoading(false)
      })
  }, [])

  return (
    <PageTransition>
      <div className="flex-1 space-y-6 p-6 max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
              <Layers className="h-8 w-8 text-blue-500" />
              Model Registry
            </h2>
            <p className="text-slate-400 mt-2">
              Manage and promote machine learning models across environments.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="bg-slate-900 border-slate-700 hover:bg-slate-800 text-slate-200 shadow-sm">
              <RefreshCw className="h-4 w-4 mr-2" /> Refresh
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20">
              <Upload className="h-4 w-4 mr-2" /> Register Model
            </Button>
          </div>
        </div>

        <Card className="bg-slate-900/50 backdrop-blur border-slate-800 shadow-xl overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6 border-b border-slate-800/60 bg-slate-900/80 flex items-center justify-between">
              <h3 className="text-lg font-medium text-slate-200">Production & Staging Artifacts</h3>
              <div className="flex items-center px-3 py-1.5 border border-slate-700 rounded-md bg-slate-950/50 w-64">
                <Search className="h-4 w-4 text-slate-500 mr-2 shrink-0" />
                <input 
                  type="text" 
                  placeholder="Search models..." 
                  className="flex-1 bg-transparent outline-none text-sm text-slate-200 placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="bg-slate-900 border-b border-slate-800">
                  <tr>
                    <th className="h-12 px-6 text-left align-middle font-medium text-slate-400">Name</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-slate-400">Version</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-slate-400">Algorithm</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-slate-400">Dataset</th>
                    <th className="h-12 px-4 text-center align-middle font-medium text-slate-400">F1 Score</th>
                    <th className="h-12 px-4 text-center align-middle font-medium text-slate-400">Precision / Recall</th>
                    <th className="h-12 px-4 text-center align-middle font-medium text-slate-400">Latency (ms)</th>
                    <th className="h-12 px-6 text-left align-middle font-medium text-slate-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={8} className="h-32 text-center text-slate-500">Loading registry data...</td>
                    </tr>
                  ) : models.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="h-32 text-center text-slate-500">No models found.</td>
                    </tr>
                  ) : (
                    models.map((model) => (
                      <tr key={model.id} className="border-b border-slate-800/50 hover:bg-slate-800/40 transition-colors group">
                        <td className="p-4 px-6 align-middle font-medium text-slate-200">
                          <div className="flex items-center gap-2">
                            {model.status === 'PRODUCTION' && <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500/20" />}
                            {model.name}
                            {model.is_historical_record && (
                              <span className="ml-2 rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 uppercase tracking-wider">Historical</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 align-middle text-blue-400 font-mono text-xs">{model.version}</td>
                        <td className="p-4 align-middle text-slate-300">{model.algorithm}</td>
                        <td className="p-4 align-middle text-slate-400 font-mono text-xs">{model.dataset_version}</td>
                        <td className="p-4 align-middle text-center font-bold text-emerald-500">
                          {(model.metrics.f1 * 100).toFixed(1)}%
                        </td>
                        <td className="p-4 align-middle text-center">
                          <span className="text-emerald-500 font-medium">{(model.metrics.precision * 100).toFixed(1)}%</span>
                          <span className="text-slate-600 mx-1">/</span>
                          <span className="text-emerald-500 font-medium">{(model.metrics.recall * 100).toFixed(1)}%</span>
                        </td>
                        <td className="p-4 align-middle text-center text-slate-300 font-mono">{model.avg_latency_ms.toFixed(1)} ms</td>
                        <td className="p-4 px-6 align-middle">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
                            model.status === 'PRODUCTION' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            model.status === 'STAGING' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                            'bg-slate-800 text-slate-400 border border-slate-700'
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
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  )
}
