import { VisualRuleBuilder } from "@/components/rules/VisualRuleBuilder"
import { ShieldCheck, ListFilter, SlidersHorizontal } from "lucide-react"

export default function RulesPage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-blue-500" />
            Rule Engine
          </h1>
          <p className="text-muted-foreground mt-2">
            Construct and deploy deterministic logic to complement ML models.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Col: Rule Builder */}
        <div className="xl:col-span-2">
          <VisualRuleBuilder />
        </div>

        {/* Right Col: Active Rules List (Mocked) */}
        <div className="xl:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
              <ListFilter className="h-5 w-5 text-slate-400" /> Active Rules
            </h3>
            <SlidersHorizontal className="h-4 w-4 text-slate-500" />
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl p-4 space-y-3">
            
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-semibold text-slate-200">New Device High Value</span>
                <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">Active</span>
              </div>
              <p className="text-xs text-slate-400 font-mono">IF Device_Age &lt; 1 AND Amount &gt; 5000 THEN Escalate</p>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-semibold text-slate-200">Velocity Spike</span>
                <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">Active</span>
              </div>
              <p className="text-xs text-slate-400 font-mono">IF Velocity_1h &gt; 10 THEN Hard_Block</p>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg opacity-50">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-semibold text-slate-200">Sanctioned IP</span>
                <span className="text-xs bg-slate-500/10 text-slate-400 px-2 py-0.5 rounded-full border border-slate-500/20">Disabled</span>
              </div>
              <p className="text-xs text-slate-400 font-mono">IF IP_Risk == Critical THEN Hard_Block</p>
            </div>

          </div>
        </div>

      </div>

    </div>
  )
}
