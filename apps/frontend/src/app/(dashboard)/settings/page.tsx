"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Bell, Key, Database, Globe } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Platform Settings</h2>
        <p className="text-muted-foreground mt-2">
          Configure risk thresholds, alert rules, and system preferences.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="md:col-span-1 space-y-1">
          <Button variant="secondary" className="w-full justify-start"><Shield className="mr-2 h-4 w-4" /> Risk Engine</Button>
          <Button variant="ghost" className="w-full justify-start"><Bell className="mr-2 h-4 w-4" /> Alerts & Notifications</Button>
          <Button variant="ghost" className="w-full justify-start"><Key className="mr-2 h-4 w-4" /> API Keys</Button>
          <Button variant="ghost" className="w-full justify-start"><Database className="mr-2 h-4 w-4" /> Data Sources</Button>
          <Button variant="ghost" className="w-full justify-start"><Globe className="mr-2 h-4 w-4" /> Webhooks</Button>
        </div>

        <div className="md:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Global Risk Thresholds</CardTitle>
              <CardDescription>
                Configure the AI model confidence thresholds required for auto-declining or flagging transactions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="decline-threshold">Auto-Decline Threshold (0-100)</Label>
                <div className="flex gap-4">
                  <Input id="decline-threshold" type="number" defaultValue="85" className="max-w-[150px]" />
                  <Button variant="outline">Update</Button>
                </div>
                <p className="text-sm text-muted-foreground">Transactions scoring above this will be immediately blocked.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="review-threshold">Manual Review Threshold (0-100)</Label>
                <div className="flex gap-4">
                  <Input id="review-threshold" type="number" defaultValue="65" className="max-w-[150px]" />
                  <Button variant="outline">Update</Button>
                </div>
                <p className="text-sm text-muted-foreground">Transactions scoring between this and the decline threshold are flagged for SOC review.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Model Configuration</CardTitle>
              <CardDescription>Manage the active AI model endpoints and inference engine parameters.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="model-endpoint">Inference Engine Endpoint</Label>
                <Input id="model-endpoint" defaultValue={`${process.env.NEXT_PUBLIC_ML_URL || 'http://localhost:8000/api/v1'}/predict`} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sse-endpoint">Streaming Engine URL (SSE)</Label>
                <Input id="sse-endpoint" defaultValue={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}/transactions/stream`} />
              </div>
              <Button>Save Configuration</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
