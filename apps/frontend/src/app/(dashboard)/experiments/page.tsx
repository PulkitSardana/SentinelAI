"use client"

import { useEffect, useState } from "react"
import { FlaskConical, Code2, Clock, GitMerge } from "lucide-react"

interface ExperimentRecord {
  id: string
  name: string
  algorithm: string
  hyperparameters: Record<string, string | number>
  training_time_seconds: number
  feature_count: number
  model_size_mb: number
  metrics: {
    f1: number
    precision: number
    recall: number
  }
  is_historical_record: boolean
}

export default function ExperimentsPage() {
  const [experiments, setExperiments] = useState<ExperimentRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}/mlops/experiments`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setExperiments(data.data)
        }
        setIsLoading(false)
      })
      .catch(err => {
        console.error("Failed to fetch experiments", err)
        setIsLoading(false)
      })
  }, [])

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Experiment Tracker</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <div className="col-span-4 text-center py-10 text-muted-foreground">Loading experiments...</div>
        ) : (
          experiments.map(exp => (
            <div key={exp.id} className="rounded-xl border bg-card text-card-foreground shadow">
              <div className="p-6 flex flex-col space-y-1.5 pb-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold leading-none tracking-tight truncate pr-2">{exp.name}</h3>
                  <FlaskConical className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground pt-1">{exp.algorithm}</p>
                {exp.is_historical_record && (
                  <span className="inline-block mt-2 rounded bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground uppercase w-max">Historical</span>
                )}
              </div>
              <div className="p-4 grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <span className="text-muted-foreground text-xs uppercase flex items-center gap-1">
                    <Code2 className="h-3 w-3" /> F1 Score
                  </span>
                  <div className="font-medium text-emerald-500">{(exp.metrics.f1 * 100).toFixed(1)}%</div>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground text-xs uppercase flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Time
                  </span>
                  <div className="font-medium">{exp.training_time_seconds}s</div>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground text-xs uppercase flex items-center gap-1">
                    <GitMerge className="h-3 w-3" /> Features
                  </span>
                  <div className="font-medium">{exp.feature_count} inputs</div>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground text-xs uppercase flex items-center gap-1">
                    <Database className="h-3 w-3" /> Size
                  </span>
                  <div className="font-medium">{exp.model_size_mb} MB</div>
                </div>
              </div>
              <div className="p-4 bg-muted/30 border-t text-xs">
                <span className="text-muted-foreground font-medium mb-1 block">Hyperparameters:</span>
                <div className="font-mono text-muted-foreground overflow-x-auto whitespace-nowrap">
                  {JSON.stringify(exp.hyperparameters).replace(/[{}]/g, '').replace(/"/g, '')}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function Database(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  )
}
