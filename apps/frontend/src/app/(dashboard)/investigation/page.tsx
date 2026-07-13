"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Briefcase, ChevronRight, User, AlertTriangle, ShieldAlert, Activity, MessageSquare, Plus, FileText, Crosshair, CheckCircle, Fingerprint } from "lucide-react"
import { PageTransition } from "@/components/layout/page-transition"

const MOCK_CASES = [
  {
    id: "CAS-9A8B7C6D",
    title: "Suspicious Login & Immediate High-Value Transfer",
    priority: "CRITICAL",
    status: "OPEN",
    assignee: "Alex Mercer",
    sla: "Breached",
    created: "2026-07-13T08:14:00Z",
    alerts: 4,
    timeline: [
      { time: "08:12:00", action: "Failed login attempt (IP: 192.168.1.1, RU)", type: "auth" },
      { time: "08:14:00", action: "Successful login (IP: 45.33.22.11, US-Proxy)", type: "auth" },
      { time: "08:14:45", action: "Password change request", type: "account" },
      { time: "08:15:30", action: "$4,500 Wire Transfer initiated", type: "tx" },
    ],
    entities: ["User: j.doe@example.com", "IP: 45.33.22.11", "Device: Mac OS (Unknown)"],
    comments: [
      { author: "System", text: "Auto-escalated due to velocity + geographic impossible travel.", time: "08:16:00" }
    ]
  },
  {
    id: "CAS-1F2E3D4C",
    title: "Coordinated Credential Stuffing Attack",
    priority: "HIGH",
    status: "INVESTIGATING",
    assignee: "Sarah Chen",
    sla: "2h 15m left",
    created: "2026-07-13T10:30:00Z",
    alerts: 125,
    timeline: [
      { time: "10:00:00", action: "Spike in login failures across 40 accounts", type: "auth" },
      { time: "10:15:00", action: "Rate limit triggered for ASN 12345", type: "system" },
    ],
    entities: ["ASN: 12345 (Cloud Provider)", "Accounts: 40+"],
    comments: []
  },
  {
    id: "CAS-5A4B3C2D",
    title: "Anomalous API Usage (Volume Spike)",
    priority: "MEDIUM",
    status: "OPEN",
    assignee: "Unassigned",
    sla: "12h 45m left",
    created: "2026-07-13T11:45:00Z",
    alerts: 2,
    timeline: [
      { time: "11:40:00", action: "API key sk_live_*** used 5000x in 1m", type: "api" },
    ],
    entities: ["API Key: sk_live_...9f8", "Merchant: TestCorp"],
    comments: []
  }
]

export default function InvestigationCenter() {
  const [selectedCase, setSelectedCase] = useState(MOCK_CASES[0])

  return (
    <PageTransition>
      <div className="flex h-[calc(100vh-6rem)] flex-col space-y-4 p-2 max-w-[1800px] mx-auto overflow-hidden">
        <div className="flex items-center justify-between shrink-0 px-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
              <Crosshair className="h-8 w-8 text-blue-500" />
              Investigation Center
            </h2>
            <p className="text-slate-400 mt-1 text-sm">
              Triage, analyze, and remediate complex security incidents.
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20">
            <Plus className="mr-2 h-4 w-4" /> Create Manual Case
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0">
          
          {/* Column 1: Alert/Case Queue */}
          <div className="lg:col-span-3 flex flex-col gap-3 min-h-0">
            <div className="border-b border-slate-800 pb-2 flex justify-between items-center shrink-0 px-1">
              <h3 className="font-semibold text-slate-300 uppercase tracking-wider text-xs">Active Queue (12)</h3>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
              {MOCK_CASES.map((c) => (
                <div 
                  key={c.id}
                  onClick={() => setSelectedCase(c)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    selectedCase.id === c.id 
                      ? "bg-slate-800/80 border-blue-500 shadow-md" 
                      : "bg-slate-900/40 border-slate-800 hover:bg-slate-800/40"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className={`text-[10px] uppercase border-none px-1.5 py-0 ${
                      c.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 
                      c.priority === 'HIGH' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {c.priority}
                    </Badge>
                    <span className="text-[10px] text-slate-500 font-mono">{c.id}</span>
                  </div>
                  <h4 className="text-sm font-medium text-slate-200 line-clamp-2 leading-tight">{c.title}</h4>
                  <div className="flex justify-between items-center mt-3 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span className="truncate max-w-[80px]">{c.assignee}</span>
                    </div>
                    <span className={c.sla === 'Breached' ? 'text-red-400 font-medium' : ''}>{c.sla}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Timeline & Details */}
          <div className="lg:col-span-6 flex flex-col gap-4 min-h-0 bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div className="p-5 border-b border-slate-800/60 bg-slate-900/80 shrink-0">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-700">{selectedCase.status}</Badge>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="bg-slate-900 border-slate-700 h-8">
                    Assign to me
                  </Button>
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white h-8">
                    <CheckCircle className="h-4 w-4 mr-2" /> Resolve
                  </Button>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-100">{selectedCase.title}</h3>
              <p className="text-sm text-slate-400 mt-1">Generated {new Date(selectedCase.created).toLocaleString()}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <h4 className="font-medium text-slate-300 mb-4 flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-400" /> Event Timeline
              </h4>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
                {selectedCase.timeline.map((event, idx) => (
                  <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-900 bg-slate-800 text-slate-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                      {event.type === 'auth' ? <ShieldAlert className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-slate-800 bg-slate-900/40 hover:bg-slate-800/60 transition-colors shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-200 text-sm">{event.action}</span>
                      </div>
                      <div className="text-slate-500 text-xs font-mono">{event.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 3: Evidence & Actions */}
          <div className="lg:col-span-3 flex flex-col gap-4 min-h-0">
            <Card className="bg-slate-900/50 backdrop-blur border-slate-800 shadow-xl shrink-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-slate-200 text-sm flex items-center gap-2">
                  <Fingerprint className="h-4 w-4 text-blue-400" /> Linked Entities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {selectedCase.entities.map((ent, i) => (
                    <Badge key={i} variant="secondary" className="bg-slate-800 hover:bg-slate-700 text-slate-300 border-none font-mono text-[10px]">
                      {ent}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 backdrop-blur border-slate-800 shadow-xl flex-1 flex flex-col overflow-hidden">
              <CardHeader className="pb-3 shrink-0 border-b border-slate-800/60">
                <CardTitle className="text-slate-200 text-sm flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-blue-400" /> Analyst Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedCase.comments.length === 0 ? (
                  <div className="text-center text-slate-500 text-sm mt-4">No notes yet.</div>
                ) : (
                  selectedCase.comments.map((c, i) => (
                    <div key={i} className="flex gap-3">
                      <Avatar className="h-6 w-6 shrink-0">
                        <AvatarFallback className="bg-blue-900 text-blue-200 text-[10px]">{c.author[0]}</AvatarFallback>
                      </Avatar>
                      <div className="bg-slate-800/50 rounded-lg p-3 text-sm border border-slate-700/50">
                        <div className="flex justify-between items-center mb-1 gap-4">
                          <span className="font-semibold text-slate-300 text-xs">{c.author}</span>
                          <span className="text-[10px] text-slate-500">{c.time}</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed text-xs">{c.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
              <div className="p-3 border-t border-slate-800 bg-slate-900/80 shrink-0">
                <textarea 
                  className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none h-20"
                  placeholder="Add an investigation note..."
                />
                <div className="flex justify-end mt-2">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white h-7 text-xs">Submit Note</Button>
                </div>
              </div>
            </Card>
          </div>

        </div>
      </div>
    </PageTransition>
  )
}
