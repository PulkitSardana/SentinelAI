"use client"

import { useState, useMemo } from "react"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Wand2, Loader2, FileText, Download } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function SARGenerator() {
  const [selectedCase, setSelectedCase] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedText, setGeneratedText] = useState("")

  const { data, error, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}/cases`, fetcher, {
    refreshInterval: 5000
  })

  const casesData = useMemo(() => {
    if (!data?.data?.cases) return []
    return data.data.cases.map((c: any) => ({
      id: c.id,
      shortId: c.id.substring(0, 8).toUpperCase(),
      title: c.title,
      status: c.status,
      alertsCount: c.alerts?.length || 0,
      priority: c.priority
    }))
  }, [data])

  const handleGenerate = () => {
    if (!selectedCase) return
    setIsGenerating(true)
    setGeneratedText("")
    
    // Simulate AI generation delay
    setTimeout(() => {
      setIsGenerating(false)
      const caseObj = casesData.find((c: any) => c.id === selectedCase)
      const caseName = caseObj?.title || "Unknown Case"
      
      setGeneratedText(
        `SUSPICIOUS ACTIVITY REPORT (SAR) NARRATIVE\n\n` +
        `SUBJECT: ${caseName} (CAS-${caseObj?.shortId})\n` +
        `DATE OF ACTIVITY: ${new Date().toISOString().split('T')[0]}\n` +
        `PRIORITY: ${caseObj?.priority}\n` +
        `ALERTS INVOLVED: ${caseObj?.alertsCount}\n\n` +
        `This report is filed to document suspicious activity concerning the subject referenced above. Our automated SentinelAI detection systems flagged anomalous behavior that deviated significantly from the customer's established baseline.\n\n` +
        `The investigation into this case (currently marked as ${caseObj?.status}) revealed multiple indicators of compromise. A total of ${caseObj?.alertsCount} alerts were triggered and consolidated into this incident.\n\n` +
        `Based on these indicators of compromise (IoCs), the account has been restricted pending further review. Attached are the detailed transaction logs and device fingerprint analysis.`
      )
    }, 2500)
  }

  return (
    <Card className="bg-slate-900 border-slate-800 shadow-xl h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-slate-100 flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-blue-500" />
          AI SAR Generator
        </CardTitle>
        <CardDescription className="text-slate-400">
          Select a case to automatically draft a FinCEN-compliant SAR narrative.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        
        <div className="flex gap-4">
          <div className="flex-1">
            <Select onValueChange={setSelectedCase} value={selectedCase} disabled={isLoading}>
              <SelectTrigger className="bg-slate-950 border-slate-800 text-slate-100">
                <SelectValue placeholder={isLoading ? "Loading cases..." : "Select a high-risk case..."} />
              </SelectTrigger>
              <SelectContent>
                {casesData.map((c: any) => (
                  <SelectItem key={c.id} value={c.id}>CAS-{c.shortId} - {c.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={handleGenerate} 
            disabled={!selectedCase || isGenerating}
            className="bg-blue-600 hover:bg-blue-700 text-white min-w-[140px]"
          >
            {isGenerating ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Drafting...</>
            ) : (
              <><Wand2 className="mr-2 h-4 w-4" /> Generate</>
            )}
          </Button>
        </div>

        <div className="flex-1 relative min-h-[300px]">
          <Textarea 
            value={generatedText}
            onChange={(e) => setGeneratedText(e.target.value)}
            placeholder="AI generated narrative will appear here..."
            className="h-full resize-none bg-slate-950 border-slate-800 text-slate-200 p-4 font-serif leading-relaxed"
          />
        </div>

        <div className="flex justify-end gap-2 mt-2">
          <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" disabled={!generatedText}>
            <FileText className="mr-2 h-4 w-4" /> Save Draft
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={!generatedText}>
            <Download className="mr-2 h-4 w-4" /> Export PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
