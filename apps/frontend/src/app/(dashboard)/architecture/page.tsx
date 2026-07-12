"use client"

import { useState } from "react"
import { Server, Database, Brain, Globe, Shield, Radio, Activity, Cpu, Box, Code } from "lucide-react"

interface ArchitectureNode {
  id: string
  name: string
  type: string
  icon: any
  purpose: string
  technologies: string[]
  responsibilities: string[]
  dependencies: string[]
  health: 'Healthy' | 'Degraded' | 'Offline'
  latency_ms: number
  endpoints: string[]
  metrics?: { label: string; value: string }[]
}

const architectureData: Record<string, ArchitectureNode> = {
  frontend: {
    id: "frontend",
    name: "Dashboard (Next.js)",
    type: "Frontend Application",
    icon: Globe,
    purpose: "Provides the primary user interface for Analysts and Administrators.",
    technologies: ["Next.js 14", "React", "Tailwind CSS", "Zustand", "Framer Motion", "Recharts"],
    responsibilities: [
      "Real-time visualization of streaming transactions.",
      "Case management and alert triage UI.",
      "Rendering complex ML explainability charts."
    ],
    dependencies: ["api_gateway"],
    health: "Healthy",
    latency_ms: 45,
    endpoints: ["/dashboard", "/pipeline", "/registry"],
    metrics: [{ label: "Active Sessions", value: "24" }, { label: "Bundle Size", value: "142 KB" }]
  },
  api_gateway: {
    id: "api_gateway",
    name: "API Gateway (Node.js)",
    type: "Microservice",
    icon: Server,
    purpose: "Central orchestrator routing UI requests, managing auth, and handling ingestion.",
    technologies: ["Node.js", "Express", "BullMQ", "Prisma ORM", "Server-Sent Events (SSE)"],
    responsibilities: [
      "Validating incoming simulator payloads.",
      "Queuing transactions in BullMQ.",
      "Broadcasting SSE events to the UI.",
      "Serving REST endpoints for metrics."
    ],
    dependencies: ["postgres", "redis", "ml_service"],
    health: "Healthy",
    latency_ms: 12,
    endpoints: ["POST /transactions/ingest", "GET /transactions/stream", "GET /metrics/dashboard"],
    metrics: [{ label: "Throughput", value: "4,500 req/min" }, { label: "Error Rate", value: "0.01%" }]
  },
  ml_service: {
    id: "ml_service",
    name: "ML Service (Python)",
    type: "Microservice",
    icon: Brain,
    purpose: "Executes real-time machine learning inference.",
    technologies: ["Python 3.11", "FastAPI", "XGBoost", "Scikit-Learn", "SHAP"],
    responsibilities: [
      "Loading trained model artifacts.",
      "Computing risk score probabilities.",
      "Generating LIME/SHAP feature importance."
    ],
    dependencies: [],
    health: "Healthy",
    latency_ms: 8,
    endpoints: ["POST /api/v1/predict"],
    metrics: [{ label: "Avg Inference Time", value: "8.5ms" }, { label: "P99 Latency", value: "21ms" }]
  },
  postgres: {
    id: "postgres",
    name: "PostgreSQL Database",
    type: "Datastore",
    icon: Database,
    purpose: "Persistent storage for transactions, users, and audit logs.",
    technologies: ["PostgreSQL 15"],
    responsibilities: [
      "ACID compliant storage of financial data.",
      "Enforcing foreign key constraints.",
      "Complex aggregations for dashboard metrics."
    ],
    dependencies: [],
    health: "Healthy",
    latency_ms: 3,
    endpoints: ["tcp://5432"],
    metrics: [{ label: "DB Size", value: "1.4 GB" }, { label: "Active Connections", value: "45" }]
  },
  redis: {
    id: "redis",
    name: "Redis Queue & Cache",
    type: "In-Memory Store",
    icon: Box,
    purpose: "High-performance queuing system for BullMQ and metric caching.",
    technologies: ["Redis 7"],
    responsibilities: [
      "Buffering high-throughput transaction ingestion.",
      "Caching expensive dashboard queries."
    ],
    dependencies: [],
    health: "Healthy",
    latency_ms: 1,
    endpoints: ["tcp://6379"],
    metrics: [{ label: "Queue Length", value: "0" }, { label: "Hit Rate", value: "94%" }]
  },
  simulator: {
    id: "simulator",
    name: "Data Simulator",
    type: "Producer",
    icon: Radio,
    purpose: "Pumps realistic financial transactions into the system.",
    technologies: ["Python", "Faker"],
    responsibilities: [
      "Generating mock payloads matching the Kaggle schema.",
      "Simulating varied TPS loads."
    ],
    dependencies: ["api_gateway"],
    health: "Healthy",
    latency_ms: 0,
    endpoints: [],
    metrics: [{ label: "Current TPS", value: "5.0" }]
  }
}

export default function ArchitecturePage() {
  const [selectedNodeId, setSelectedNodeId] = useState<string>("api_gateway")
  const selectedNode = architectureData[selectedNodeId]

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2 mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Architecture Explorer</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Interactive Diagram / Node List */}
        <div className="col-span-1 border rounded-xl bg-card shadow p-4 space-y-2">
          <h3 className="font-semibold px-2 mb-4 text-muted-foreground uppercase text-xs">Platform Services</h3>
          {Object.values(architectureData).map(node => (
            <button
              key={node.id}
              onClick={() => setSelectedNodeId(node.id)}
              className={`w-full text-left flex items-center p-3 rounded-lg border transition-all ${
                selectedNodeId === node.id 
                  ? "bg-primary/10 border-primary text-primary" 
                  : "bg-background border-border hover:bg-muted"
              }`}
            >
              <node.icon className={`h-5 w-5 mr-3 ${selectedNodeId === node.id ? "text-primary" : "text-muted-foreground"}`} />
              <div>
                <div className="font-semibold text-sm">{node.name}</div>
                <div className={`text-xs ${selectedNodeId === node.id ? "text-primary/70" : "text-muted-foreground"}`}>{node.type}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Node Inspector */}
        <div className="col-span-2 border rounded-xl bg-card shadow overflow-hidden flex flex-col">
          <div className="bg-muted p-6 border-b flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <selectedNode.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{selectedNode.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-medium text-muted-foreground">{selectedNode.type}</span>
                  <span className="text-muted-foreground text-xs">•</span>
                  <span className="flex items-center text-xs font-medium text-emerald-500">
                    <Activity className="h-3 w-3 mr-1" /> {selectedNode.health} ({selectedNode.latency_ms}ms)
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-8 overflow-y-auto">
            <div>
              <h4 className="text-sm font-semibold uppercase text-muted-foreground tracking-wider mb-2">Purpose</h4>
              <p className="text-sm">{selectedNode.purpose}</p>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-sm font-semibold uppercase text-muted-foreground tracking-wider mb-3">Responsibilities</h4>
                <ul className="space-y-2">
                  {selectedNode.responsibilities.map((resp, i) => (
                    <li key={i} className="flex items-start text-sm">
                      <Shield className="h-4 w-4 mr-2 text-primary shrink-0 mt-0.5" />
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold uppercase text-muted-foreground tracking-wider mb-3">Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedNode.technologies.map((tech, i) => (
                    <span key={i} className="px-2.5 py-1 bg-secondary text-secondary-foreground rounded-md text-xs font-medium border">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-4 border-t">
              <div>
                <h4 className="text-sm font-semibold uppercase text-muted-foreground tracking-wider mb-3">API Endpoints</h4>
                {selectedNode.endpoints.length > 0 ? (
                  <div className="space-y-2 font-mono text-xs">
                    {selectedNode.endpoints.map((ep, i) => (
                      <div key={i} className="px-3 py-2 bg-muted rounded border text-muted-foreground flex items-center">
                        <Code className="h-3 w-3 mr-2" />
                        {ep}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground italic">No public endpoints exposed.</div>
                )}
              </div>

              <div>
                <h4 className="text-sm font-semibold uppercase text-muted-foreground tracking-wider mb-3">Live Metrics</h4>
                {selectedNode.metrics && selectedNode.metrics.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {selectedNode.metrics.map((metric, i) => (
                      <div key={i} className="bg-background border rounded-lg p-3">
                        <div className="text-xs text-muted-foreground mb-1">{metric.label}</div>
                        <div className="font-semibold">{metric.value}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground italic">No telemetry available.</div>
                )}
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <h4 className="text-sm font-semibold uppercase text-muted-foreground tracking-wider mb-3">Dependencies</h4>
              <div className="flex flex-wrap gap-2">
                  {selectedNode.dependencies.length > 0 ? selectedNode.dependencies.map((dep, i) => (
                    <button 
                      key={i} 
                      onClick={() => setSelectedNodeId(dep)}
                      className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-md text-sm font-medium border border-primary/20 transition-colors flex items-center"
                    >
                      {architectureData[dep].name}
                    </button>
                  )) : (
                    <span className="text-sm text-muted-foreground italic">No downstream dependencies.</span>
                  )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
