"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldAlert, Network, User, MonitorSmartphone, CreditCard, Activity } from "lucide-react"
import type { NodeData } from "./FraudGraph"
import { Button } from "@/components/ui/button"

interface EntityDetailsPanelProps {
  node: NodeData | null
}

const ICONS = {
  account: User,
  ip: Network,
  device: MonitorSmartphone,
  card: CreditCard
}

const RISK_BADGES = {
  critical: "bg-red-500/10 text-red-400 border-red-500/20",
  high: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  low: "bg-slate-500/10 text-slate-400 border-slate-500/20",
}

export function EntityDetailsPanel({ node }: EntityDetailsPanelProps) {
  if (!node) {
    return (
      <Card className="bg-slate-900 border-slate-800 shadow-xl h-full flex flex-col justify-center items-center text-center p-6">
        <Network className="h-12 w-12 text-slate-700 mb-4" />
        <CardTitle className="text-slate-400">No Entity Selected</CardTitle>
        <CardDescription className="text-slate-500 mt-2">
          Click on a node in the network graph to view deep intelligence and connected threats.
        </CardDescription>
      </Card>
    )
  }

  const Icon = ICONS[node.group]

  return (
    <Card className="bg-slate-900 border-slate-800 shadow-xl h-full flex flex-col animate-in slide-in-from-right-4 duration-300">
      <CardHeader className="border-b border-slate-800 pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg ${
              node.group === 'account' ? 'bg-blue-500/10 text-blue-500' :
              node.group === 'ip' ? 'bg-emerald-500/10 text-emerald-500' :
              node.group === 'device' ? 'bg-purple-500/10 text-purple-500' :
              'bg-amber-500/10 text-amber-500'
            }`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-slate-100 text-lg capitalize">{node.group}</CardTitle>
              <CardDescription className="text-slate-400">{node.id}</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className={`capitalize ${RISK_BADGES[node.risk]}`}>
            {node.risk} Risk
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-6 pt-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-300 mb-2 uppercase tracking-wider">Entity Details</h3>
          <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Label</span>
              <span className="text-slate-200 font-mono">{node.label}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">First Seen</span>
              <span className="text-slate-200">Oct 12, 2026</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Velocity (24h)</span>
              <span className="text-slate-200">14 connections</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-300 mb-2 uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-red-400" />
            Active Threats
          </h3>
          <div className="space-y-2">
            {node.risk === 'critical' || node.risk === 'high' ? (
              <>
                <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-3 text-sm text-red-200 flex items-start gap-2">
                  <Activity className="h-4 w-4 mt-0.5 text-red-400 shrink-0" />
                  <p>Part of known synthetic identity ring. Linked to 3 other high-risk accounts.</p>
                </div>
                {node.group === 'ip' && (
                  <div className="bg-orange-500/5 border border-orange-500/10 rounded-lg p-3 text-sm text-orange-200 flex items-start gap-2">
                    <Network className="h-4 w-4 mt-0.5 text-orange-400 shrink-0" />
                    <p>IP Address flagged in multiple credential stuffing attacks.</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-sm text-slate-500 italic">No immediate threats detected for this entity alone. Suspicion is derived from network connections.</div>
            )}
          </div>
        </div>

        <div className="mt-auto space-y-3">
          <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
            Block Entity Globally
          </Button>
          <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800">
            Add to Watchlist
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
