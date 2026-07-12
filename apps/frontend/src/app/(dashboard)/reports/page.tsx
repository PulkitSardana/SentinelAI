import { SARGenerator } from "@/components/reports/SARGenerator"
import { FileText, FileCheck, FileClock, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const RECENT_REPORTS = [
  { id: "SAR-2026-081", title: "Corporate Account - Structuring", date: "Today, 10:42 AM", status: "Draft" },
  { id: "SAR-2026-080", title: "Retail - Card Testing (Bin 4412)", date: "Yesterday, 2:15 PM", status: "Filed" },
  { id: "SAR-2026-079", title: "Syndicate - Device Spoofing", date: "Oct 12, 2026", status: "Filed" },
]

export default function ReportsPage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <FileText className="h-8 w-8 text-blue-500" />
            Compliance Reporting
          </h1>
          <p className="text-muted-foreground mt-2">
            Automated Suspicious Activity Reports (SAR) and regulatory filings.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: SAR Generator */}
        <div className="lg:col-span-2 min-h-[600px]">
          <SARGenerator />
        </div>

        {/* Right Col: Recent Reports & Search */}
        <div className="lg:col-span-1 space-y-6 flex flex-col">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input 
                placeholder="Search past reports (e.g. SAR ID)..." 
                className="pl-9 bg-slate-950 border-slate-800 focus-visible:ring-blue-500"
              />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl flex-1 p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <FileClock className="h-5 w-5 text-slate-400" /> Recent Filings
            </h3>
            <div className="space-y-4">
              {RECENT_REPORTS.map((report) => (
                <div key={report.id} className="p-4 rounded-lg border border-slate-800 hover:bg-slate-800/50 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-blue-400">{report.id}</span>
                    <Badge variant="outline" className={
                      report.status === 'Filed' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                    }>
                      {report.status}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-slate-200">{report.title}</h4>
                  <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                    <FileCheck className="h-3 w-3" /> {report.date}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
