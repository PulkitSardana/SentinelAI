import { ModelDriftChart } from "@/components/models/ModelDriftChart"
import { FeatureImportance } from "@/components/models/FeatureImportance"
import { ModelHealthStatus } from "@/components/models/ModelHealthStatus"
import { BrainCircuit, Cpu } from "lucide-react"

export default function ModelsPage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <BrainCircuit className="h-8 w-8 text-blue-500" />
            ML Operations & Drift
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor real-world AI degradation, concept drift, and feature importance shifts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Col: Drift Chart & Feature Importance */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          <ModelDriftChart />
          <FeatureImportance />
        </div>

        {/* Right Col: Model Health Overview */}
        <div className="xl:col-span-1">
          <ModelHealthStatus />
        </div>

      </div>

    </div>
  )
}
