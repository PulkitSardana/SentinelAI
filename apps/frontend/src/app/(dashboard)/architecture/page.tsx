"use client"

import { useState } from "react"
import { Server, Database, Brain, Globe, Shield, Radio, Activity, Cpu, Box, Code } from "lucide-react"
import { PageTransition } from "@/components/layout/page-transition"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
    <PageTransition>
      <div className="flex h-[calc(100vh-6rem)] flex-col space-y-6 p-6 max-w-[1600px] mx-auto overflow-hidden">
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
              <Cpu className="h-8 w-8 text-blue-500" />
              Architecture Explorer
            </h2>
            <p className="text-slate-400 mt-2">
              Interactive map of SentinelAI's microservices and data pipelines.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
          
          {/* Node List (Left Column) */}
          <Card className="lg:col-span-4 bg-slate-900/50 backdrop-blur border-slate-800 shadow-xl overflow-hidden flex flex-col">
            <CardHeader className="border-b border-slate-800/60 pb-4 bg-slate-900/80 shrink-0">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-400">Platform Services</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-3 relative">
              <div className="absolute top-0 bottom-0 left-[27px] w-px bg-slate-800 -z-10" />
              {Object.values(architectureData).map(node => {
                const isSelected = selectedNodeId === node.id;
                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`w-full text-left flex items-center p-3 rounded-lg border transition-all duration-300 relative group overflow-hidden ${
                      isSelected 
                        ? "bg-slate-800 border-blue-500 shadow-md shadow-blue-900/20" 
                        : "bg-slate-900/60 border-slate-700 hover:bg-slate-800/80 hover:border-slate-600"
                    }`}
                  >
                    {isSelected && (
                      <motion.div 
                        layoutId="active-node-bg" 
                        className="absolute inset-0 bg-blue-500/5 z-0" 
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <div className="relative z-10 flex items-center w-full">
                      <div className={`h-8 w-8 rounded-md flex items-center justify-center mr-4 shrink-0 transition-colors ${
                        isSelected ? "bg-blue-500 text-white" : "bg-slate-800 text-slate-400 group-hover:text-slate-200"
                      }`}>
                        <node.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-semibold text-sm truncate ${isSelected ? "text-slate-100" : "text-slate-300"}`}>{node.name}</div>
                        <div className={`text-xs truncate ${isSelected ? "text-blue-300" : "text-slate-500"}`}>{node.type}</div>
                      </div>
                      {isSelected && (
                        <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse ml-3" />
                      )}
                    </div>
                  </button>
                )
              })}
            </CardContent>
          </Card>

          {/* Node Inspector (Right Column) */}
          <Card className="lg:col-span-8 bg-slate-900/50 backdrop-blur border-slate-800 shadow-xl overflow-hidden flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedNode.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col h-full"
              >
                <div className="bg-slate-900/80 p-6 border-b border-slate-800/60 flex items-start justify-between shrink-0">
                  <div className="flex items-center gap-5">
                    <div className="h-14 w-14 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-inner">
                      <selectedNode.icon className="h-7 w-7 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-100">{selectedNode.name}</h3>
                      <div className="flex items-center gap-3 mt-1.5">
                        <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-700 py-0 text-[10px] uppercase tracking-wider">
                          {selectedNode.type}
                        </Badge>
                        <span className="flex items-center text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <Activity className="h-3 w-3 mr-1" /> {selectedNode.health} ({selectedNode.latency_ms}ms)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 space-y-8 overflow-y-auto flex-1">
                  <div>
                    <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-3">Purpose</h4>
                    <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/50 p-4 rounded-lg border border-slate-800/50">{selectedNode.purpose}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-3">Responsibilities</h4>
                      <ul className="space-y-3">
                        {selectedNode.responsibilities.map((resp, i) => (
                          <li key={i} className="flex items-start text-sm text-slate-300">
                            <Shield className="h-4 w-4 mr-3 text-blue-400 shrink-0 mt-0.5" />
                            {resp}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-3">Technologies</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedNode.technologies.map((tech, i) => (
                          <span key={i} className="px-3 py-1.5 bg-slate-800/80 text-slate-200 rounded-md text-xs font-medium border border-slate-700 shadow-sm">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-800">
                    <div>
                      <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-3">API Endpoints</h4>
                      {selectedNode.endpoints.length > 0 ? (
                        <div className="space-y-2 font-mono text-[11px]">
                          {selectedNode.endpoints.map((ep, i) => (
                            <div key={i} className="px-3 py-2 bg-slate-950 rounded border border-slate-800 text-slate-400 flex items-center shadow-inner">
                              <Code className="h-3 w-3 mr-2 text-purple-400" />
                              {ep}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-slate-500 italic bg-slate-900/50 p-3 rounded border border-slate-800/50">No public endpoints exposed.</div>
                      )}
                    </div>

                    <div>
                      <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-3">Live Telemetry</h4>
                      {selectedNode.metrics && selectedNode.metrics.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3">
                          {selectedNode.metrics.map((metric, i) => (
                            <div key={i} className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 shadow-inner">
                              <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">{metric.label}</div>
                              <div className="font-mono text-lg font-bold text-slate-200">{metric.value}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-slate-500 italic bg-slate-900/50 p-3 rounded border border-slate-800/50">No telemetry available.</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-slate-800">
                    <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-3">Dependencies</h4>
                    <div className="flex flex-wrap gap-3">
                        {selectedNode.dependencies.length > 0 ? selectedNode.dependencies.map((dep, i) => {
                          const DepIcon = architectureData[dep].icon;
                          return (
                          <button 
                            key={i} 
                            onClick={() => setSelectedNodeId(dep)}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium border border-slate-600 transition-colors flex items-center shadow-sm"
                          >
                            <DepIcon className="h-4 w-4 mr-2 text-slate-400" />
                            {architectureData[dep].name}
                          </button>
                        )}) : (
                          <span className="text-sm text-slate-500 italic bg-slate-900/50 p-3 rounded border border-slate-800/50 block w-full">No downstream dependencies.</span>
                        )}
                    </div>
                  </div>

                </div>
              </motion.div>
            </AnimatePresence>
          </Card>

        </div>
      </div>
    </PageTransition>
  )
}
