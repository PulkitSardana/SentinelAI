"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"

// Import without SSR to prevent window/document undefined errors
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false })

export type NodeData = {
  id: string
  label: string
  group: 'account' | 'ip' | 'device' | 'card'
  risk: 'critical' | 'high' | 'medium' | 'low'
  val: number // size
}

export type LinkData = {
  source: string
  target: string
  label?: string
}

export type GraphData = {
  nodes: NodeData[]
  links: LinkData[]
}

const mockGraphData: GraphData = {
  nodes: [
    { id: "acc_1", label: "Account: jdoe99", group: "account", risk: "critical", val: 20 },
    { id: "acc_2", label: "Account: msmith2", group: "account", risk: "critical", val: 20 },
    { id: "acc_3", label: "Account: rroe_x", group: "account", risk: "high", val: 20 },
    { id: "ip_1", label: "IP: 192.168.1.100", group: "ip", risk: "critical", val: 12 },
    { id: "ip_2", label: "IP: 10.0.0.55", group: "ip", risk: "medium", val: 12 },
    { id: "dev_1", label: "Device: iPhone 13", group: "device", risk: "high", val: 15 },
    { id: "dev_2", label: "Device: Mac Studio", group: "device", risk: "low", val: 15 },
    { id: "card_1", label: "Card: **** 4412", group: "card", risk: "critical", val: 10 },
    { id: "card_2", label: "Card: **** 9910", group: "card", risk: "high", val: 10 },
  ],
  links: [
    { source: "acc_1", target: "ip_1" },
    { source: "acc_2", target: "ip_1" }, // Shared IP
    { source: "acc_3", target: "ip_1" }, // Shared IP
    { source: "acc_1", target: "dev_1" },
    { source: "acc_2", target: "dev_1" }, // Shared Device
    { source: "acc_3", target: "dev_2" },
    { source: "acc_1", target: "card_1" },
    { source: "acc_2", target: "card_1" }, // Shared Stolen Card
    { source: "acc_3", target: "card_2" },
    { source: "ip_2", target: "acc_3" }
  ]
}

const colors = {
  account: "#3b82f6", // blue
  ip: "#10b981", // emerald
  device: "#8b5cf6", // purple
  card: "#f59e0b", // amber
}

const riskColors = {
  critical: "#ef4444", // red
  high: "#f97316", // orange
  medium: "#eab308", // yellow
  low: "#64748b", // slate
}

interface FraudGraphProps {
  onNodeClick: (node: NodeData) => void
}

export function FraudGraph({ onNodeClick }: FraudGraphProps) {
  const fgRef = useRef<any>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const containerRef = useRef<HTMLDivElement>(null)

  // Responsive resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        })
      }
    }
    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  return (
    <div ref={containerRef} className="w-full h-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800 relative">
      
      {/* Legend overlay */}
      <div className="absolute top-4 left-4 z-10 bg-slate-900/90 border border-slate-700 p-3 rounded-lg shadow-xl backdrop-blur-sm">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Entity Types</h4>
        <div className="space-y-1">
          {Object.entries(colors).map(([key, color]) => (
            <div key={key} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs text-slate-400 capitalize">{key}</span>
            </div>
          ))}
        </div>
      </div>

      <ForceGraph2D
        ref={fgRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={mockGraphData}
        nodeLabel="label"
        nodeColor={(node: any) => colors[node.group as keyof typeof colors]}
        nodeRelSize={6}
        linkColor={() => "#334155"} // slate-700
        linkWidth={2}
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.01}
        onNodeClick={(node: any) => onNodeClick(node)}
        backgroundColor="#020617" // slate-950
        nodeCanvasObject={(node: any, ctx, globalScale) => {
          const label = node.label
          const fontSize = 12/globalScale
          ctx.font = `${fontSize}px Sans-Serif`
          const textWidth = ctx.measureText(label).width
          const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2)
          
          // Draw Node Circle
          ctx.beginPath()
          ctx.arc(node.x, node.y, node.val / 2, 0, 2 * Math.PI, false)
          ctx.fillStyle = colors[node.group as keyof typeof colors]
          ctx.fill()

          // Draw Risk Halo
          ctx.beginPath()
          ctx.arc(node.x, node.y, (node.val / 2) + 2, 0, 2 * Math.PI, false)
          ctx.strokeStyle = riskColors[node.risk as keyof typeof riskColors]
          ctx.lineWidth = 1.5
          ctx.stroke()

          // Draw Text
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(label, node.x, node.y + (node.val/2) + fontSize)
        }}
      />
    </div>
  )
}
