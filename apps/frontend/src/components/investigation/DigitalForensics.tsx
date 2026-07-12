"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Monitor, Smartphone, Globe, ShieldAlert, Cpu, HardDrive } from "lucide-react"

export function DigitalForensics() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Monitor className="h-4 w-4" /> Device Fingerprint
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Device Hash</span>
            <span className="font-mono text-destructive">8A9B42C... <ShieldAlert className="inline h-3 w-3" /></span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">OS</span>
            <span>macOS 14.2.1</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Browser</span>
            <span>Chrome 122.0.0.0</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Screen Res</span>
            <span>2560x1600 (Retina)</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Globe className="h-4 w-4" /> Network & Location
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">IP Address</span>
            <span>45.22.11.9</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">ISP</span>
            <span>DigitalOcean, LLC</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">VPN / Proxy</span>
            <span className="text-destructive font-semibold">Detected (VPN)</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Timezone</span>
            <span className="text-destructive">Mismatch (IP vs Browser)</span>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Cpu className="h-4 w-4" /> Canvas & Audio Context
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-3 bg-muted/50 rounded-md border font-mono text-xs overflow-x-auto text-muted-foreground">
            {`{
  "canvasRenderer": "Apple M2 Max",
  "webglVendor": "Apple Inc.",
  "audioContextFp": "124.9082",
  "fonts": 42,
  "hardwareConcurrency": 12
}`}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Fingerprint precisely matches a device used in an ATO attack on 2026-07-01.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
