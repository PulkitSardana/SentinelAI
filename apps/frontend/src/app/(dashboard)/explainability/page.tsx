"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { BrainCircuit, Download, FileText, Activity, AlertTriangle, Fingerprint } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts"
import { useState } from "react"
import { PageTransition } from "@/components/layout/page-transition"

const shapData = [
  { feature: "Base Value", value: 0.1, color: "#94a3b8" },
  { feature: "IP Distance", value: 0.45, color: "#ef4444" },
  { feature: "Velocity (1h)", value: 0.32, color: "#ef4444" },
  { feature: "Time of Day", value: 0.15, color: "#ef4444" },
  { feature: "Device Trust", value: -0.12, color: "#10b981" },
  { feature: "Account Age", value: -0.05, color: "#10b981" },
  { feature: "Final Score", value: 0.85, color: "#3b82f6" },
]

const featureImportance = [
  { feature: "IP_Distance", importance: 100 },
  { feature: "Velocity_1h", importance: 82 },
  { feature: "Device_Fingerprint", importance: 64 },
  { feature: "Amount_zscore", importance: 45 },
  { feature: "Time_Since_Last_Login", importance: 31 },
]

export default function ExplainabilityStudio() {
  const [amount, setAmount] = useState([450])
  const [velocity, setVelocity] = useState([12])
  const [distance, setDistance] = useState([10])
  
  // Simulate counterfactual changes
  const simulatedRisk = Math.min(99, Math.max(1, 85 + (amount[0] - 450) * 0.05 + (velocity[0] - 12) * 1.5 + (distance[0] - 10) * 0.5))

  return (
    <PageTransition>
      <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
              <BrainCircuit className="h-8 w-8 text-blue-500" />
              Explainability Studio
            </h2>
            <p className="text-slate-400 mt-2">
              Deep-dive into model decisions, SHAP values, and counterfactual analysis.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-slate-900 border-slate-700 hover:bg-slate-800 text-slate-200">
              <Download className="h-4 w-4 mr-2" />
              Export PDF Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          
          {/* Left Column: Natural Language & What-If */}
          <div className="xl:col-span-4 space-y-6 flex flex-col">
            <Card className="bg-slate-900/50 backdrop-blur border-slate-800 shadow-xl flex-1 hover:-translate-y-1 transition-transform duration-300">
              <CardHeader>
                <CardTitle className="text-slate-200 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-400" />
                  AI Generated Explanation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-lg bg-blue-950/30 border border-blue-900/50 text-slate-300 leading-relaxed text-sm">
                  <p className="mb-3">
                    This transaction was flagged with an <strong className="text-red-400">85% risk score</strong> primarily because the 
                    <strong className="text-slate-200"> IP Distance (4,200 km)</strong> is highly unusual compared to the user's historical baseline.
                  </p>
                  <p className="mb-3">
                    Additionally, the <strong className="text-slate-200">Velocity (12 attempts/hr)</strong> strongly indicates automated credential stuffing. 
                  </p>
                  <p>
                    While the <strong className="text-emerald-400">Device Trust</strong> score slightly mitigates the risk, the combined geographic and velocity anomalies override the trusted device status, resulting in a firm <Badge variant="destructive" className="ml-1 bg-red-500/20 text-red-500 border-none">DECLINE</Badge> recommendation.
                  </p>
                </div>

                <div className="mt-6 p-4 rounded-lg border border-slate-800 bg-slate-950/50">
                  <h4 className="text-sm font-semibold text-slate-400 mb-2 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Model Confidence
                  </h4>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-3xl font-bold text-slate-100">99.4%</span>
                    <span className="text-sm text-emerald-500 mb-1">High</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-blue-500 h-1.5 rounded-full w-[99.4%] animate-in slide-in-from-left duration-1000"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 backdrop-blur border-slate-800 shadow-xl hover:-translate-y-1 transition-transform duration-300">
              <CardHeader>
                <CardTitle className="text-slate-200 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  Counterfactual "What-If" Analysis
                </CardTitle>
                <CardDescription className="text-slate-400">Adjust features to see how the model reacts.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-slate-300">Transaction Amount</label>
                    <span className="text-sm text-slate-400 font-mono">${amount[0]}</span>
                  </div>
                  <Slider 
                    value={amount} 
                    onValueChange={(v) => setAmount(v as number[])} 
                    max={2000} 
                    step={10} 
                    className="py-2"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-slate-300">Velocity (attempts/hr)</label>
                    <span className="text-sm text-slate-400 font-mono">{velocity[0]}</span>
                  </div>
                  <Slider 
                    value={velocity} 
                    onValueChange={(v) => setVelocity(v as number[])} 
                    max={50} 
                    step={1} 
                    className="py-2"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-slate-300">Distance from Home (mi)</label>
                    <span className="text-sm text-slate-400 font-mono">{distance[0]}</span>
                  </div>
                  <Slider 
                    value={distance} 
                    onValueChange={(v) => setDistance(v as number[])} 
                    max={100} 
                    step={5} 
                    className="py-2"
                  />
                </div>

                <div className="p-4 rounded-lg bg-slate-950/50 border border-slate-800 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-400">Simulated Risk Score</span>
                  <span className={`text-2xl font-bold transition-colors duration-300 ${simulatedRisk > 80 ? 'text-red-500' : simulatedRisk > 50 ? 'text-yellow-500' : 'text-emerald-500'}`}>
                    {simulatedRisk.toFixed(1)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: SHAP & Features */}
          <div className="xl:col-span-8 space-y-6 flex flex-col">
            <Card className="bg-slate-900/50 backdrop-blur border-slate-800 shadow-xl hover:-translate-y-1 transition-transform duration-300">
              <CardHeader>
                <CardTitle className="text-slate-200 flex items-center gap-2">
                  <Fingerprint className="h-5 w-5 text-blue-400" />
                  SHAP Feature Contribution (Waterfall)
                </CardTitle>
                <CardDescription className="text-slate-400">How each feature pushed the base score to the final prediction.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={shapData} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#1e293b" />
                      <XAxis type="number" domain={[-0.2, 1]} stroke="#64748b" fontSize={12} tickFormatter={(val) => val.toFixed(1)} />
                      <YAxis dataKey="feature" type="category" stroke="#94a3b8" fontSize={12} width={100} tickLine={false} axisLine={false} />
                      <Tooltip 
                        cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                        contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: '#1e293b', borderRadius: '8px', color: '#f8fafc', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }}
                      />
                      <ReferenceLine x={0} stroke="#334155" />
                      <Bar dataKey="value" barSize={20} radius={[0, 4, 4, 0]} animationDuration={1500}>
                        {shapData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 backdrop-blur border-slate-800 shadow-xl flex-1 hover:-translate-y-1 transition-transform duration-300">
              <CardHeader>
                <CardTitle className="text-slate-200">Global Feature Importance</CardTitle>
                <CardDescription className="text-slate-400">Top 5 features driving the current champion model's behavior overall.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={featureImportance} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                      <XAxis dataKey="feature" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                        contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: '#1e293b', borderRadius: '8px', color: '#f8fafc', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }}
                      />
                      <Bar dataKey="importance" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} animationDuration={1500} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </PageTransition>
  )
}
