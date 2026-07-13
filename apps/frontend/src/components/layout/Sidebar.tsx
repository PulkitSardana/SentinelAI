"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Activity, 
  Search, 
  History, 
  PieChart, 
  Settings, 
  ShieldAlert, 
  LogOut,
  Inbox,
  Briefcase,
  Layers,
  TerminalSquare,
  Network,
  FileText,
  ShieldCheck,
  Share2
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Live Dashboard", href: "/dashboard", icon: Activity, shortcut: "D" },
  { name: "Investigation Center", href: "/investigation", icon: Inbox, shortcut: "I" },
  { name: "Explainability Studio", href: "/explainability", icon: Search, shortcut: "E" },
]

const aiNavigation = [
  { name: "Live AI Pipeline", href: "/pipeline", icon: Share2, shortcut: "P" },
  { name: "Model Registry", href: "/registry", icon: Layers, shortcut: "R" },
  { name: "Experiment Tracker", href: "/experiments", icon: Briefcase },
  { name: "Model Monitoring", href: "/monitoring", icon: PieChart },
  { name: "Dataset Explorer", href: "/dataset", icon: Network },
]

const opsNavigation = [
  { name: "Architecture Explorer", href: "/architecture", icon: ShieldCheck, shortcut: "A" },
  { name: "Developer Tools", href: "/dev-tools", icon: TerminalSquare, shortcut: "T" },
  { name: "Audit & History", href: "/history", icon: History },
  { name: "Settings", href: "/settings", icon: Settings, shortcut: "S" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col border-r border-slate-800 bg-slate-950 text-slate-300">
      <div className="flex h-16 items-center border-b border-slate-800 px-6 shrink-0 bg-slate-900/50">
        <ShieldAlert className="mr-3 h-6 w-6 text-blue-500" />
        <span className="text-lg font-bold text-slate-100 tracking-tight">SentinelAI</span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 scrollbar-none">
        <div className="px-6 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
          Security Operations
        </div>
        <nav className="space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-inner" 
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn("h-4 w-4 transition-colors", isActive ? "text-blue-500" : "text-slate-500 group-hover:text-slate-400")} />
                  {item.name}
                </div>
                {item.shortcut && (
                  <kbd className={cn(
                    "hidden group-hover:inline-flex items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium transition-colors opacity-0 group-hover:opacity-100",
                    isActive ? "border-blue-500/30 bg-blue-500/10 text-blue-400" : "border-slate-700 bg-slate-800 text-slate-400"
                  )}>
                    <span className="text-xs">⇧</span>{item.shortcut}
                  </kbd>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="mt-8 px-6 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
          MLOps & AI Engineering
        </div>
        <nav className="space-y-1 px-3">
          {aiNavigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-inner" 
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn("h-4 w-4 transition-colors", isActive ? "text-blue-500" : "text-slate-500 group-hover:text-slate-400")} />
                  {item.name}
                </div>
                {item.shortcut && (
                  <kbd className={cn(
                    "hidden group-hover:inline-flex items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium transition-colors opacity-0 group-hover:opacity-100",
                    isActive ? "border-blue-500/30 bg-blue-500/10 text-blue-400" : "border-slate-700 bg-slate-800 text-slate-400"
                  )}>
                    <span className="text-xs">⇧</span>{item.shortcut}
                  </kbd>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="mt-8 px-6 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
          Platform Operations
        </div>
        <nav className="space-y-1 px-3">
          {opsNavigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-inner" 
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn("h-4 w-4 transition-colors", isActive ? "text-blue-500" : "text-slate-500 group-hover:text-slate-400")} />
                  {item.name}
                </div>
                {item.shortcut && (
                  <kbd className={cn(
                    "hidden group-hover:inline-flex items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium transition-colors opacity-0 group-hover:opacity-100",
                    isActive ? "border-blue-500/30 bg-blue-500/10 text-blue-400" : "border-slate-700 bg-slate-800 text-slate-400"
                  )}>
                    <span className="text-xs">⇧</span>{item.shortcut}
                  </kbd>
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="border-t border-slate-800 p-4 shrink-0 bg-slate-900/50">
        <button
          className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20 group"
        >
          <div className="flex items-center gap-3">
            <LogOut className="h-4 w-4 group-hover:text-red-400 transition-colors" />
            Log Out
          </div>
        </button>
      </div>
    </div>
  )
}
