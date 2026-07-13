"use client"

import { BrainCircuit, Target, Gauge, Sliders } from "lucide-react"

const modelData = [
  { name: "Precision", value: "99.2%", icon: Target, trend: "up" },
  { name: "Recall", value: "98.8%", icon: Target, trend: "up" },
  { name: "F1 Score", value: "99.0%", icon: Target, trend: "up" },
  { name: "Data Drift", value: "0.02", icon: Sliders, trend: "stable" },
  { name: "Model Name", value: "XGB-Fraud-v4", icon: BrainCircuit, trend: "stable" },
  { name: "Confidence", value: "High", icon: Gauge, trend: "up" },
]

export function ModelHealth() {
  return (
    <div className="grid grid-cols-2 gap-3 mt-4">
      {modelData.map((item) => (
        <div 
          key={item.name}
          className="p-3 rounded-lg bg-slate-900/40 border border-slate-800 flex flex-col hover:bg-slate-800/60 transition-colors"
        >
          <div className="flex items-center gap-2 mb-2">
            <item.icon className="h-4 w-4 text-blue-400" />
            <span className="text-xs font-medium text-slate-400">{item.name}</span>
          </div>
          <div className="text-lg font-bold text-slate-100">{item.value}</div>
        </div>
      ))}
    </div>
  )
}
