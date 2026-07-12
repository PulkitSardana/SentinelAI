"use client"

import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const data = [
  {
    subject: "Account Takeover",
    A: 120,
    fullMark: 150,
  },
  {
    subject: "Card Testing",
    A: 98,
    fullMark: 150,
  },
  {
    subject: "Synthetic ID",
    A: 86,
    fullMark: 150,
  },
  {
    subject: "Phishing",
    A: 99,
    fullMark: 150,
  },
  {
    subject: "DDoS",
    A: 85,
    fullMark: 150,
  },
  {
    subject: "Velocity Spike",
    A: 65,
    fullMark: 150,
  },
]

export function GlobalHeatmap() {
  return (
    <Card className="bg-slate-900 border-slate-800 shadow-xl">
      <CardHeader>
        <CardTitle className="text-slate-100">Emerging Threat Vectors</CardTitle>
        <CardDescription className="text-slate-400">
          Real-time analysis of attack patterns mapped across our network.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }}
                itemStyle={{ color: '#3b82f6' }}
              />
              <Radar
                name="Threat Volume"
                dataKey="A"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.3}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
