"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertOctagon, Clock, TrendingUp } from "lucide-react"

const SLA_DATA = [
  { queue: "L1 High Risk", slaLimit: "1h", currentMaxWait: "52m", status: "warning", volume: 145 },
  { queue: "L2 Escalations", slaLimit: "4h", currentMaxWait: "4h 15m", status: "breached", volume: 32 },
  { queue: "VIP Accounts", slaLimit: "30m", currentMaxWait: "12m", status: "healthy", volume: 8 },
  { queue: "Compliance Review", slaLimit: "24h", currentMaxWait: "18h", status: "healthy", volume: 89 },
]

export function SLAMonitor() {
  return (
    <Card className="bg-slate-900 border-slate-800 shadow-xl">
      <CardHeader>
        <CardTitle className="text-slate-100 flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-500" />
          Queue SLA Monitor
        </CardTitle>
        <CardDescription className="text-slate-400">
          Real-time tracking of queue health and triage targets.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {SLA_DATA.map((queue) => (
            <div key={queue.queue} className="space-y-2">
              <div className="flex justify-between items-end">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-200">{queue.queue}</span>
                    {queue.status === 'breached' && (
                      <AlertOctagon className="h-4 w-4 text-red-500 animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400">SLA: {queue.slaLimit} | Vol: {queue.volume}</p>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-bold ${
                    queue.status === 'breached' ? 'text-red-500' :
                    queue.status === 'warning' ? 'text-orange-500' :
                    'text-emerald-500'
                  }`}>
                    Max Wait: {queue.currentMaxWait}
                  </span>
                </div>
              </div>
              <Progress 
                value={
                  queue.status === 'breached' ? 100 :
                  queue.status === 'warning' ? 85 : 
                  35
                } 
                className="h-2 bg-slate-800"
                indicatorColor={
                  queue.status === 'breached' ? 'bg-red-500' :
                  queue.status === 'warning' ? 'bg-orange-500' :
                  'bg-emerald-500'
                }
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
