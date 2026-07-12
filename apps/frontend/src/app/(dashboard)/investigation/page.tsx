"use client"

import React, { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Briefcase, ChevronRight, User, AlertTriangle } from "lucide-react"
import Link from "next/link"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function CasesPage() {
  const { data, error, isLoading } = useSWR('http://localhost:4000/api/v1/cases', fetcher, {
    refreshInterval: 5000 // Poll every 5s
  })

  const casesData = useMemo(() => {
    if (!data?.data?.cases) return []
    return data.data.cases.map((c: any) => {
      // Calculate SLA text
      let slaText = "N/A"
      if (c.sla_deadline) {
        const diff = new Date(c.sla_deadline).getTime() - Date.now()
        if (diff < 0) {
          slaText = "Breached"
        } else {
          const hours = Math.floor(diff / (1000 * 60 * 60))
          const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
          slaText = `${hours}h ${mins}m left`
        }
      }

      return {
        id: c.id,
        shortId: c.id.substring(0, 8).toUpperCase(),
        title: c.title,
        status: c.status,
        priority: c.priority,
        assignee: c.assignee?.name || "Unassigned",
        sla: slaText,
        alertsCount: c.alerts?.length || 0,
      }
    })
  }, [data])

  return (
    <div className="flex h-full flex-col space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Case Management</h2>
          <p className="text-muted-foreground mt-2">
            Consolidated investigations combining multiple alerts and entities.
          </p>
        </div>
        <Button><Briefcase className="mr-2 h-4 w-4" /> Create Manual Case</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading && <div className="text-muted-foreground">Loading cases...</div>}
        {!isLoading && casesData.length === 0 && <div className="text-muted-foreground">No active cases found.</div>}
        {casesData.map((c: any) => (
          <Card key={c.id} className="flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start mb-2">
                <Badge variant={c.priority === 'CRITICAL' ? 'destructive' : c.priority === 'HIGH' ? 'destructive' : 'secondary'} 
                       className={c.priority === 'HIGH' ? 'bg-orange-500' : ''}>
                  {c.priority}
                </Badge>
                <span className="text-xs text-muted-foreground font-mono">CAS-{c.shortId}</span>
              </div>
              <CardTitle className="text-base">{c.title}</CardTitle>
              <CardDescription className="flex items-center gap-1 mt-2">
                <AlertTriangle className="h-3 w-3" /> {c.alertsCount} linked alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <span className="font-semibold">{c.status.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">SLA</span>
                <span className={`font-semibold flex items-center gap-1 ${c.sla === 'Breached' ? 'text-destructive' : ''}`}>
                  <Clock className="h-3 w-3" /> {c.sla}
                </span>
              </div>
              <div className="flex justify-between text-sm items-center">
                <span className="text-muted-foreground">Assignee</span>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-[10px]"><User className="h-3 w-3"/></AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{c.assignee}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-3 border-t">
              <Link href={`/cases/${c.id}`} className="w-full">
                <Button variant="ghost" className="w-full justify-between">
                  Open Case <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
