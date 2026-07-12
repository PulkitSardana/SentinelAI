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
  { name: "Live Dashboard", href: "/dashboard", icon: Activity },
  { name: "Investigation Center", href: "/investigation", icon: Inbox },
  { name: "Explainability Studio", href: "/explainability", icon: Search },
]

const aiNavigation = [
  { name: "Live AI Pipeline", href: "/pipeline", icon: Share2 },
  { name: "Model Registry", href: "/registry", icon: Layers },
  { name: "Experiment Tracker", href: "/experiments", icon: Briefcase },
  { name: "Model Monitoring", href: "/monitoring", icon: PieChart },
  { name: "Dataset Explorer", href: "/dataset", icon: Network },
]

const opsNavigation = [
  { name: "Architecture Explorer", href: "/architecture", icon: ShieldCheck },
  { name: "Developer Tools", href: "/dev-tools", icon: TerminalSquare },
  { name: "Audit & History", href: "/history", icon: History },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      <div className="flex h-16 items-center border-b px-6">
        <ShieldAlert className="mr-2 h-6 w-6 text-primary" />
        <span className="text-lg font-bold">SentinelAI</span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-secondary text-secondary-foreground" 
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="mt-8 px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          MLOps & AI Engineering
        </div>
        <nav className="mt-4 space-y-1 px-3">
          {aiNavigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-secondary text-secondary-foreground" 
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="mt-8 px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Platform Operations
        </div>
        <nav className="mt-4 space-y-1 px-3">
          {opsNavigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-secondary text-secondary-foreground" 
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="border-t p-4">
        <button
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </button>
      </div>
    </div>
  )
}
