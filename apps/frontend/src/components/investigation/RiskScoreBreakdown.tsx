"use client"

import { Progress } from "@/components/ui/progress"

export function RiskScoreBreakdown() {
  const scores = [
    { label: "Velocity Score", value: 95, description: "15 transactions in 2 minutes." },
    { label: "Identity Score", value: 80, description: "Synthetic identity patterns matched." },
    { label: "Location Score", value: 99, description: "Impossible travel from NYC to London." },
    { label: "Device Score", value: 92, description: "Device hash found on blocklist." },
    { label: "ML Model Ensemble", value: 96, description: "Random Forest & XGBoost aggregate." },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b pb-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 border-4 border-destructive text-destructive">
          <span className="text-2xl font-bold">98</span>
        </div>
        <div>
          <h3 className="text-xl font-bold">Blended Risk Score</h3>
          <p className="text-sm text-muted-foreground">Confidence level: CRITICAL</p>
        </div>
      </div>

      <div className="space-y-5">
        {scores.map((score, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">{score.label}</span>
              <span className={`font-mono font-bold ${score.value > 85 ? 'text-destructive' : 'text-primary'}`}>
                {score.value}/100
              </span>
            </div>
            <Progress value={score.value} indicatorColor={score.value > 85 ? 'bg-destructive' : 'bg-primary'} className="h-2" />
            <p className="text-xs text-muted-foreground">{score.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
