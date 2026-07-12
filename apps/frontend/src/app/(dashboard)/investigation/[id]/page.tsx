"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Clock, ListChecks, ArrowLeft, MoreHorizontal, ShieldCheck, User } from "lucide-react"
import Link from "next/link"

import { EntityResolutionGraph } from "@/components/investigation/EntityResolutionGraph"
import { DigitalForensics } from "@/components/investigation/DigitalForensics"
import { RiskScoreBreakdown } from "@/components/investigation/RiskScoreBreakdown"
import { Network, Fingerprint, Activity } from "lucide-react"

export default function CaseDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b bg-background px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/cases">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">Coordinated Card Testing Attack</h1>
              <Badge variant="destructive">CRITICAL</Badge>
              <Badge variant="outline">INVESTIGATING</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Case {params.id} • Assigned to Alex Demo • SLA: 2 hours left</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Transfer</Button>
          <Button variant="outline">Merge</Button>
          <Button><ShieldCheck className="mr-2 h-4 w-4"/> Resolve Case</Button>
          <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Pane - Primary Content */}
        <div className="flex-1 overflow-y-auto p-6 border-r bg-muted/20">
          <Tabs defaultValue="entity_graph" className="w-full">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 overflow-x-auto h-12">
              <TabsTrigger value="entity_graph" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2 font-semibold whitespace-nowrap">
                <Network className="mr-2 h-4 w-4"/> Entity Graph
              </TabsTrigger>
              <TabsTrigger value="forensics" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2 font-semibold whitespace-nowrap">
                <Fingerprint className="mr-2 h-4 w-4"/> Digital Forensics
              </TabsTrigger>
              <TabsTrigger value="risk_score" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2 font-semibold whitespace-nowrap">
                <Activity className="mr-2 h-4 w-4"/> Risk Score
              </TabsTrigger>
              <TabsTrigger value="evidence" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2 font-semibold whitespace-nowrap">
                <FileText className="mr-2 h-4 w-4"/> Evidence (14)
              </TabsTrigger>
              <TabsTrigger value="playbook" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2 font-semibold whitespace-nowrap">
                <ListChecks className="mr-2 h-4 w-4"/> Action Playbook
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="entity_graph" className="mt-6">
              <EntityResolutionGraph />
            </TabsContent>

            <TabsContent value="forensics" className="mt-6">
              <DigitalForensics />
            </TabsContent>

            <TabsContent value="risk_score" className="mt-6 max-w-2xl">
              <Card>
                <CardHeader>
                  <CardTitle>Decision Engine Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <RiskScoreBreakdown />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="evidence" className="mt-6 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Linked Entities</CardTitle>
                  <CardDescription>Entities associated with the 14 escalated alerts.</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-4">
                  <Badge variant="secondary" className="px-3 py-1"><User className="mr-2 h-3 w-3"/> 3 User Accounts</Badge>
                  <Badge variant="secondary" className="px-3 py-1">2 IP Addresses</Badge>
                  <Badge variant="secondary" className="px-3 py-1">1 Device Hash</Badge>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Flagged Transactions</h3>
                {[1,2,3].map(i => (
                  <div key={i} className="flex items-center justify-between p-4 border bg-background rounded-lg shadow-sm">
                    <div>
                      <div className="font-semibold text-sm">Txn: req_89f{i}2... • $12.50</div>
                      <div className="text-xs text-muted-foreground mt-1">Stripe / Netflix • 10 mins ago</div>
                    </div>
                    <Badge variant="destructive">Score: 9{i}</Badge>
                  </div>
                ))}
                <Button variant="outline" className="w-full">View all 14 transactions</Button>
              </div>
            </TabsContent>

            <TabsContent value="playbook" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Card Testing Playbook</CardTitle>
                  <CardDescription>Standard operating procedure for velocity card testing attacks.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <input type="checkbox" className="mt-1" />
                    <div>
                      <div className="font-medium text-sm">Verify IPs</div>
                      <div className="text-xs text-muted-foreground">Check if the IP addresses belong to known proxy/VPN endpoints.</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <input type="checkbox" className="mt-1" />
                    <div>
                      <div className="font-medium text-sm">Block Device Fingerprint</div>
                      <div className="text-xs text-muted-foreground">Add the shared Device ID to the global blocklist.</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <input type="checkbox" className="mt-1" />
                    <div>
                      <div className="font-medium text-sm">Initiate Refund / Chargeback defense</div>
                      <div className="text-xs text-muted-foreground">Reverse any approved transactions in this cluster.</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Pane - Timeline */}
        <div className="w-[400px] flex-shrink-0 bg-background overflow-y-auto border-l flex flex-col">
          <div className="p-4 border-b font-semibold flex items-center gap-2">
            <Clock className="h-4 w-4" /> Activity Timeline
          </div>
          <div className="flex-1 p-6 space-y-6">
            
            <div className="relative pl-6 border-l">
              <span className="absolute -left-1.5 top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-background"></span>
              <div className="text-xs text-muted-foreground mb-1">10 mins ago</div>
              <div className="font-medium text-sm">Case Created</div>
              <div className="text-xs text-muted-foreground mt-1">Escalated from Triage by Auto-Rule (Velocity).</div>
            </div>

            <div className="relative pl-6 border-l">
              <span className="absolute -left-1.5 top-1 h-3 w-3 rounded-full bg-muted ring-4 ring-background"></span>
              <div className="text-xs text-muted-foreground mb-1">15 mins ago</div>
              <div className="font-medium text-sm">14 Alerts Fired</div>
              <div className="text-xs text-muted-foreground mt-1">Multiple small transactions across 3 accounts detected by ML model.</div>
            </div>

          </div>
          <div className="p-4 border-t bg-muted/20">
            <textarea 
              className="w-full text-sm p-3 rounded-md border bg-background resize-none focus:outline-none focus:ring-1 focus:ring-primary" 
              placeholder="Add internal note..."
              rows={3}
            />
            <div className="flex justify-end mt-2">
              <Button size="sm">Add Note</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
