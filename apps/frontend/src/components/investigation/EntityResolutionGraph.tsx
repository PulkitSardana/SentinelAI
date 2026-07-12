"use client"

import { motion } from "framer-motion"
import { User, CreditCard, Laptop, MapPin, Share2 } from "lucide-react"

type Node = {
  id: string
  label: string
  sublabel?: string
  type: "User" | "Card" | "Device" | "IP"
  isFlagged?: boolean
}

type Edge = {
  source: string
  target: string
}

const mockNodes: Node[] = [
  { id: "u1", label: "Alex Demo", type: "User", isFlagged: true },
  { id: "c1", label: "**** 4242", type: "Card" },
  { id: "c2", label: "**** 5555", type: "Card", isFlagged: true },
  { id: "d1", label: "MacBook Pro", sublabel: "Device ID: 8A9B...", type: "Device", isFlagged: true },
  { id: "i1", label: "192.168.1.1", sublabel: "NYC, USA", type: "IP" },
  { id: "i2", label: "45.22.11.9", sublabel: "VPN Node", type: "IP", isFlagged: true },
  { id: "u2", label: "Synthetic ID 1", type: "User", isFlagged: true },
]

export function EntityResolutionGraph() {
  return (
    <div className="relative w-full h-[400px] bg-muted/30 rounded-xl border overflow-hidden flex flex-col items-center justify-center p-8">
      <div className="absolute top-4 left-4 flex items-center gap-2 text-sm text-muted-foreground font-medium">
        <Share2 className="h-4 w-4" /> Entity Resolution
      </div>
      
      {/* 
        For a production app, we would use a robust layout engine like dagre or react-flow. 
        Here, we mock a tree layout using flexbox to demonstrate the UX pattern.
      */}
      <div className="flex flex-col items-center gap-12 w-full max-w-2xl mt-4">
        
        {/* Root Level - IP & Device */}
        <div className="flex justify-center gap-16 relative w-full">
          <GraphNode node={mockNodes[4]} />
          <GraphNode node={mockNodes[5]} />
          
          {/* Mock SVG Edges connecting downwards */}
          <svg className="absolute top-full left-0 w-full h-12 -z-10 pointer-events-none stroke-border">
            <path d="M 25% 0 L 50% 48" fill="none" strokeWidth="2" />
            <path d="M 75% 0 L 50% 48" fill="none" strokeWidth="2" className="stroke-destructive/50" strokeDasharray="4" />
          </svg>
        </div>

        {/* Second Level - Device */}
        <div className="flex justify-center w-full relative">
          <GraphNode node={mockNodes[3]} />
          <svg className="absolute top-full left-0 w-full h-12 -z-10 pointer-events-none stroke-border">
            <path d="M 50% 0 L 30% 48" fill="none" strokeWidth="2" className="stroke-destructive/50" />
            <path d="M 50% 0 L 70% 48" fill="none" strokeWidth="2" className="stroke-destructive/50" />
          </svg>
        </div>

        {/* Third Level - Users */}
        <div className="flex justify-center gap-16 w-full relative">
          <GraphNode node={mockNodes[0]} />
          <GraphNode node={mockNodes[6]} />
          <svg className="absolute top-full left-0 w-full h-12 -z-10 pointer-events-none stroke-border">
            <path d="M 30% 0 L 20% 48" fill="none" strokeWidth="2" />
            <path d="M 30% 0 L 40% 48" fill="none" strokeWidth="2" className="stroke-destructive/50" />
          </svg>
        </div>

        {/* Fourth Level - Cards */}
        <div className="flex justify-start pl-[15%] gap-8 w-full">
          <GraphNode node={mockNodes[1]} />
          <GraphNode node={mockNodes[2]} />
        </div>

      </div>
    </div>
  )
}

function GraphNode({ node }: { node: Node }) {
  const Icon = {
    User: User,
    Card: CreditCard,
    Device: Laptop,
    IP: MapPin,
  }[node.type]

  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`flex items-center gap-3 p-3 bg-background border rounded-lg shadow-sm min-w-[140px] z-10 cursor-pointer transition-colors hover:border-primary ${
        node.isFlagged ? "border-destructive ring-1 ring-destructive/20" : ""
      }`}
    >
      <div className={`p-2 rounded-md ${node.isFlagged ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <div className="text-sm font-semibold">{node.label}</div>
        {node.sublabel && <div className="text-[10px] text-muted-foreground">{node.sublabel}</div>}
      </div>
    </motion.div>
  )
}
