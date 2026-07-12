import { AnalystPerformance } from "@/components/ops/AnalystPerformance"
import { SLAMonitor } from "@/components/ops/SLAMonitor"
import { Shield, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OpsPage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Shield className="h-8 w-8 text-blue-500" />
            Security Operations Center
          </h1>
          <p className="text-muted-foreground mt-2">
            Macro-level queue monitoring, SLA tracking, and analyst performance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Configure SLAs
          </Button>
        </div>
      </div>

      {/* Top Metrics Grid */}
      <AnalystPerformance />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Col: SLA Monitor */}
        <div className="xl:col-span-1">
          <SLAMonitor />
        </div>

        {/* Right Col: Operations Overview (Placeholder for more complex views) */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex-1 flex flex-col justify-center items-center text-slate-500 min-h-[400px]">
             <Shield className="h-16 w-16 mb-4 opacity-20" />
             <h3 className="text-lg font-medium text-slate-300">Live Case Feed</h3>
             <p className="text-sm mt-2 text-center max-w-md">
               The real-time case routing visualization is currently operating in headless mode. 
               Connect the visualization engine to view live analyst assignments.
             </p>
          </div>
        </div>

      </div>

    </div>
  )
}
