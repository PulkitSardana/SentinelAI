"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, ShieldOff, AlertCircle } from "lucide-react"

const MOCK_IPS = [
  { ip: "185.192.64.0/24", source: "Dark Web DB", risk: "Critical", status: "Blocked" },
  { ip: "45.22.19.102", source: "Velocity Engine", risk: "High", status: "Monitoring" },
  { ip: "194.55.10.0/16", source: "Botnet Intel", risk: "Critical", status: "Blocked" },
  { ip: "8.8.8.8", source: "Manual Analyst", risk: "Low", status: "Allowed" },
  { ip: "112.33.44.55", source: "Syndicate DB", risk: "High", status: "Monitoring" },
]

export function MaliciousIPList() {
  const [data, setData] = useState(MOCK_IPS)

  const toggleStatus = (index: number) => {
    const newData = [...data]
    if (newData[index].status === "Blocked") {
      newData[index].status = "Monitoring"
    } else {
      newData[index].status = "Blocked"
    }
    setData(newData)
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      <div className="p-6 border-b border-slate-800 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" /> Known Malicious Entities
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            IP ranges and autonomous systems flagged by Sentinel Intel.
          </p>
        </div>
        <Button variant="outline" size="sm" className="bg-slate-800 border-slate-700 hover:bg-slate-700">
          Sync Threat Feeds
        </Button>
      </div>
      
      <Table>
        <TableHeader className="bg-slate-900/50">
          <TableRow className="border-slate-800 hover:bg-transparent">
            <TableHead className="text-slate-400">IP / Subnet</TableHead>
            <TableHead className="text-slate-400">Source</TableHead>
            <TableHead className="text-slate-400">Risk Severity</TableHead>
            <TableHead className="text-slate-400">Rule Action</TableHead>
            <TableHead className="text-slate-400 text-right">Controls</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, i) => (
            <TableRow key={item.ip} className="border-slate-800 hover:bg-slate-800/50 transition-colors">
              <TableCell className="font-mono text-slate-300 font-medium">
                {item.ip}
              </TableCell>
              <TableCell className="text-slate-400">{item.source}</TableCell>
              <TableCell>
                <Badge variant="outline" className={
                  item.risk === 'Critical' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                  item.risk === 'High' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 
                  'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                }>
                  {item.risk}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className={
                  item.status === 'Blocked' ? 'bg-red-500 text-white hover:bg-red-600' :
                  item.status === 'Allowed' ? 'bg-emerald-500 text-white hover:bg-emerald-600' :
                  'bg-yellow-500 text-slate-950 hover:bg-yellow-600'
                }>
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => toggleStatus(i)}
                  className="text-slate-400 hover:text-slate-100"
                >
                  {item.status === "Blocked" ? (
                    <><ShieldOff className="mr-2 h-4 w-4" /> Unblock</>
                  ) : (
                    <><Shield className="mr-2 h-4 w-4 text-red-400" /> Block</>
                  )}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
