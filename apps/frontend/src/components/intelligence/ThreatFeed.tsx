"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, ShieldAlert, Globe, ServerCrash } from "lucide-react"

type ThreatEvent = {
  id: string
  timestamp: string
  source: string
  type: "ip_block" | "credential_dump" | "velocity_spike" | "bot_net"
  severity: "high" | "critical"
  description: string
}

const generateMockEvent = (): ThreatEvent => {
  const types: ThreatEvent["type"][] = ["ip_block", "credential_dump", "velocity_spike", "bot_net"]
  const sources = ["Dark Web", "AWS us-east-1", "Tor Exit Node", "Telegram Channel", "Known Botnet IP"]
  const type = types[Math.floor(Math.random() * types.length)]
  
  let description = ""
  let severity: "high" | "critical" = "high"
  
  switch(type) {
    case "ip_block":
      description = "Malicious traffic detected from subnet 185.192.x.x"
      break
    case "credential_dump":
      description = "10k compromised emails matching corporate domain found"
      severity = "critical"
      break
    case "velocity_spike":
      description = "Simultaneous login attempts across 50 accounts"
      break
    case "bot_net":
      description = "DDoS pattern identified targeting payment gateway"
      severity = "critical"
      break
  }

  return {
    id: Math.random().toString(36).substring(7),
    timestamp: new Date().toLocaleTimeString(),
    source: sources[Math.floor(Math.random() * sources.length)],
    type,
    severity,
    description
  }
}

export function ThreatFeed() {
  const [events, setEvents] = useState<ThreatEvent[]>([])

  useEffect(() => {
    // Initial load
    setEvents(Array.from({ length: 5 }, generateMockEvent))

    const interval = setInterval(() => {
      setEvents(prev => [generateMockEvent(), ...prev].slice(0, 8))
    }, 4500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col space-y-4">
      <AnimatePresence>
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={`flex items-start gap-4 p-4 rounded-lg border ${
              event.severity === 'critical' 
                ? 'bg-red-500/10 border-red-500/20 text-red-100' 
                : 'bg-orange-500/10 border-orange-500/20 text-orange-100'
            }`}
          >
            <div className={`mt-0.5 p-2 rounded-full ${
              event.severity === 'critical' ? 'bg-red-500/20' : 'bg-orange-500/20'
            }`}>
              {event.type === 'credential_dump' ? <ShieldAlert className="h-5 w-5 text-red-500" /> :
               event.type === 'bot_net' ? <ServerCrash className="h-5 w-5 text-red-500" /> :
               event.type === 'ip_block' ? <Globe className="h-5 w-5 text-orange-500" /> :
               <AlertTriangle className="h-5 w-5 text-orange-500" />}
            </div>
            
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">
                  {event.source}
                </p>
                <span className="text-xs opacity-70 font-mono">
                  {event.timestamp}
                </span>
              </div>
              <p className="text-sm opacity-90">
                {event.description}
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
