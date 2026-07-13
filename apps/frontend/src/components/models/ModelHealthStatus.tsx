"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Activity, AlertTriangle, CheckCircle, Database } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function ModelHealthStatus() {
  const { data, error, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_ML_URL || 'http://localhost:8000/api/v1'}/monitoring/health`, fetcher, {
    refreshInterval: 10000
  })

  const models = data?.data || []
  return (
    <Card className="bg-slate-900 border-slate-800 shadow-xl h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-slate-100">Ensemble Health</CardTitle>
        <CardDescription className="text-slate-400">
          Status of primary detection models in production.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-6">
        
        {models.map((model: any) => {
          let Icon = CheckCircle
          let iconColor = "text-emerald-500"
          let iconBg = "bg-emerald-500/10"
          let badgeColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
          
          if (model.status === "Drift Detected") {
            Icon = AlertTriangle
            iconColor = "text-red-500"
            iconBg = "bg-red-500/10"
            badgeColor = "bg-red-500/10 text-red-400 border-red-500/20"
          } else if (model.status === "Calibrating") {
            Icon = Activity
            iconColor = "text-blue-500"
            iconBg = "bg-blue-500/10"
            badgeColor = "bg-blue-500/10 text-blue-400 border-blue-500/20"
          }

          return (
            <div key={model.id} className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${iconBg}`}>
                  <Icon className={`h-5 w-5 ${iconColor}`} />
                </div>
                <div>
                  <p className="font-semibold text-slate-200">{model.name}</p>
                  <p className="text-xs text-slate-500">{model.version} • Deployed {model.deployed}</p>
                </div>
              </div>
              <Badge variant="outline" className={badgeColor}>{model.status}</Badge>
            </div>
          )
        })}

        <div className="mt-auto pt-4">
          <Button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700">
            <Database className="mr-2 h-4 w-4" /> Trigger Retraining Pipeline
          </Button>
        </div>

      </CardContent>
    </Card>
  )
}
