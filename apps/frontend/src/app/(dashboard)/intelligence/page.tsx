import { ThreatFeed } from "@/components/intelligence/ThreatFeed"
import { GlobalHeatmap } from "@/components/intelligence/GlobalHeatmap"
import { MaliciousIPList } from "@/components/intelligence/MaliciousIPList"
import { ShieldAlert, Activity } from "lucide-react"

export default function IntelligencePage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Activity className="h-8 w-8 text-blue-500" />
            Fraud Intelligence Hub
          </h1>
          <p className="text-muted-foreground mt-2">
            Real-time global threat feeds, emerging attack vectors, and dark web monitoring.
          </p>
        </div>
      </div>

      {/* Global Alert */}
      <div className="relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground bg-red-500/10 text-red-500 border-red-500/20">
        <ShieldAlert className="h-4 w-4" />
        <h5 className="mb-1 font-medium leading-none tracking-tight">Critical Intel Advisory</h5>
        <div className="text-sm [&_p]:leading-relaxed">
          A new credential stuffing campaign targeting financial institutions was detected 2 hours ago. Increased scrutiny on high-velocity login attempts is recommended.
        </div>
      </div>

      {/* Top Grid: Live Feed + Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 flex flex-col gap-4 bg-slate-900 rounded-xl p-4 border border-slate-800 shadow-xl overflow-hidden h-[450px]">
          <div>
            <h3 className="font-semibold text-slate-100 mb-1 flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              Live Threat Feed
            </h3>
            <p className="text-xs text-slate-400">Streaming data from global SOC nodes.</p>
          </div>
          <div className="overflow-hidden flex-1 relative mt-2 -mx-2 px-2 mask-image-bottom">
            <ThreatFeed />
          </div>
        </div>

        <div className="lg:col-span-2">
          <GlobalHeatmap />
        </div>
      </div>

      {/* Bottom Grid: IP List */}
      <div>
        <MaliciousIPList />
      </div>

    </div>
  )
}
