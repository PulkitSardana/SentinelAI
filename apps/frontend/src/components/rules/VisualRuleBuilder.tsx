"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Save, Play, ShieldCheck } from "lucide-react"

type Condition = {
  id: string
  feature: string
  operator: string
  value: string
}

export function VisualRuleBuilder() {
  const [conditions, setConditions] = useState<Condition[]>([
    { id: '1', feature: 'txn_amount', operator: '>', value: '10000' }
  ])
  const [action, setAction] = useState('escalate_l2')

  const addCondition = () => {
    setConditions([...conditions, { id: Date.now().toString(), feature: '', operator: '', value: '' }])
  }

  const removeCondition = (id: string) => {
    setConditions(conditions.filter(c => c.id !== id))
  }

  const updateCondition = (id: string, field: keyof Condition, val: string) => {
    setConditions(conditions.map(c => c.id === id ? { ...c, [field]: val } : c))
  }

  return (
    <Card className="bg-slate-900 border-slate-800 shadow-xl max-w-4xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-slate-100 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-blue-500" />
              Rule Composer
            </CardTitle>
            <CardDescription className="text-slate-400">
              Build custom deterministic rules to override ML predictions.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
              <Play className="mr-2 h-4 w-4" /> Test Rule
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Save className="mr-2 h-4 w-4" /> Deploy Rule
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        
        {/* IF Block */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-md font-mono font-bold">IF</span>
            <span className="text-slate-500 text-sm">All of the following conditions are met:</span>
          </div>
          
          <div className="pl-8 space-y-3 border-l-2 border-slate-800 ml-4">
            {conditions.map((cond, index) => (
              <div key={cond.id} className="flex items-center gap-3">
                {index > 0 && <span className="text-slate-500 font-mono text-sm w-8">AND</span>}
                {index === 0 && <span className="w-8"></span>}
                
              <Select value={cond.feature} onValueChange={(val) => val && updateCondition(cond.id, 'feature', val)}>
                <SelectTrigger className="w-[200px] bg-slate-950 border-slate-800 text-slate-200">
                  <SelectValue placeholder="Select Feature..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="txn_amount">Transaction Amount</SelectItem>
                  <SelectItem value="velocity_1h">Velocity (1 hour)</SelectItem>
                  <SelectItem value="ip_risk_score">IP Risk Score</SelectItem>
                  <SelectItem value="device_age_days">Device Age (Days)</SelectItem>
                  <SelectItem value="country_match">Billing/Shipping Country Match</SelectItem>
                </SelectContent>
              </Select>

              <Select value={cond.operator} onValueChange={(val) => val && updateCondition(cond.id, 'operator', val)}>
                  <SelectTrigger className="w-[150px] bg-slate-950 border-slate-800 text-slate-200">
                    <SelectValue placeholder="Operator..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=">">Greater than</SelectItem>
                    <SelectItem value="<">Less than</SelectItem>
                    <SelectItem value="==">Equals</SelectItem>
                    <SelectItem value="!=">Does not equal</SelectItem>
                    <SelectItem value="contains">Contains</SelectItem>
                  </SelectContent>
                </Select>

                <Input 
                  placeholder="Value" 
                  value={cond.value}
                  onChange={(e) => updateCondition(cond.id, 'value', e.target.value)}
                  className="w-[200px] bg-slate-950 border-slate-800 text-slate-200"
                />

                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeCondition(cond.id)}
                  disabled={conditions.length === 1}
                  className="text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            <Button variant="ghost" size="sm" onClick={addCondition} className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 mt-2">
              <Plus className="mr-2 h-4 w-4" /> Add Condition
            </Button>
          </div>
        </div>

        {/* THEN Block */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-2">
            <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-md font-mono font-bold">THEN</span>
            <span className="text-slate-500 text-sm">Take the following action:</span>
          </div>

          <div className="pl-8 ml-4">
            <Select value={action} onValueChange={(val) => val && setAction(val)}>
              <SelectTrigger className="w-[300px] bg-slate-950 border-slate-800 text-slate-200">
                <SelectValue placeholder="Select Action..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="block">Hard Block Transaction</SelectItem>
                <SelectItem value="escalate_l2">Escalate to L2 Analyst Queue</SelectItem>
                <SelectItem value="add_watchlist">Add Entity to Watchlist</SelectItem>
                <SelectItem value="step_up_auth">Trigger Step-Up Auth (MFA)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

      </CardContent>
    </Card>
  )
}
