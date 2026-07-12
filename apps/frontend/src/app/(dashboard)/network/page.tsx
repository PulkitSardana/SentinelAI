"use client"

import { useState } from "react"
import { FraudGraph, type NodeData } from "@/components/network/FraudGraph"
import { EntityDetailsPanel } from "@/components/network/EntityDetailsPanel"
import { Network } from "lucide-react"

export default function NetworkPage() {
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null)

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col max-w-[1800px] mx-auto animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Network className="h-8 w-8 text-blue-500" />
            Fraud Network Analysis
          </h1>
          <p className="text-muted-foreground mt-1">
            Visually investigate connected entities, shared devices, and organized fraud rings.
          </p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-4 gap-6 min-h-0">
        
        {/* Left Col: The Graph */}
        <div className="xl:col-span-3 h-full rounded-xl overflow-hidden shadow-2xl relative">
          <FraudGraph onNodeClick={setSelectedNode} />
        </div>

        {/* Right Col: Details Panel */}
        <div className="xl:col-span-1 h-full overflow-y-auto">
          <EntityDetailsPanel node={selectedNode} />
        </div>

      </div>

    </div>
  )
}
