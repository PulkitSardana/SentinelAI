"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion } from "framer-motion"
import { ShieldAlert, CheckCircle, Activity, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

const formSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  merchant: z.string().min(2, "Merchant name must be at least 2 characters"),
  category: z.string().min(1, "Category is required"),
  country: z.string().min(2, "Country is required"),
  city: z.string().min(2, "City is required"),
  ipScore: z.string().min(1, "IP Risk Score is required"),
  age: z.string().min(1, "Customer Age is required"),
  device: z.string().min(1, "Device Type is required"),
})

export default function DetectionPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<{
    prediction: "APPROVED" | "FLAGGED" | "DECLINED",
    score: number,
    factors: string[]
  } | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      merchant: "",
      category: "",
      country: "",
      city: "",
      ipScore: "",
      age: "",
      device: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsAnalyzing(true)
    setResult(null)
    
    // Simulate API Delay
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    // Mock Random Prediction
    const isFraud = Math.random() > 0.5
    setResult({
      prediction: isFraud ? "DECLINED" : "APPROVED",
      score: isFraud ? 0.89 + Math.random() * 0.1 : 0.05 + Math.random() * 0.1,
      factors: isFraud 
        ? ["High IP Risk Score", "Velocity Anomaly", "Unusual Merchant Category"]
        : ["Established Device", "Low Risk Country", "Consistent Purchase Pattern"]
    })
    setIsAnalyzing(false)
    toast.success("Transaction Analysis Complete")
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Manual Investigation</h2>
        <p className="text-muted-foreground mt-2">
          Run a transaction through the SentinelAI ML model for instant evaluation.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Details</CardTitle>
              <CardDescription>Enter the parameters to simulate a live transaction.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount (USD)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 1250.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="merchant"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Merchant Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Amazon" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="retail">Retail</SelectItem>
                              <SelectItem value="digital">Digital Goods</SelectItem>
                              <SelectItem value="travel">Travel</SelectItem>
                              <SelectItem value="crypto">Cryptocurrency</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="device"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Device Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select device" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="mobile">Mobile (iOS/Android)</SelectItem>
                              <SelectItem value="desktop">Desktop</SelectItem>
                              <SelectItem value="tablet">Tablet</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input placeholder="US" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="New York" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Customer Age</FormLabel>
                          <FormControl>
                            <Input placeholder="35" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="ipScore"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>IP Risk Score (0-100)</FormLabel>
                        <FormControl>
                          <Input placeholder="15" {...field} />
                        </FormControl>
                        <FormDescription>Higher score indicates higher risk IP subnet.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isAnalyzing}>
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing via AI Engine...
                      </>
                    ) : (
                      <>
                        <Activity className="mr-2 h-4 w-4" />
                        Analyze Transaction
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1">
          {result ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Card className={result.prediction === "DECLINED" ? "border-destructive/50 bg-destructive/5" : "border-emerald-500/50 bg-emerald-500/5"}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {result.prediction === "DECLINED" ? (
                      <ShieldAlert className="h-5 w-5 text-destructive" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                    )}
                    Evaluation Result
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Prediction</div>
                    <div className={`text-2xl font-bold ${result.prediction === "DECLINED" ? "text-destructive" : "text-emerald-500"}`}>
                      {result.prediction}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Risk Score</div>
                    <div className="text-3xl font-bold tracking-tight">
                      {(result.score * 100).toFixed(1)}<span className="text-lg text-muted-foreground">/100</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-3">Key Factors</div>
                    <div className="space-y-2">
                      {result.factors.map((factor, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <div className={`h-1.5 w-1.5 rounded-full ${result.prediction === "DECLINED" ? "bg-destructive" : "bg-emerald-500"}`} />
                          {factor}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <Card className="h-full flex items-center justify-center border-dashed bg-muted/30">
              <div className="text-center p-6 text-muted-foreground">
                <ShieldAlert className="h-10 w-10 mx-auto mb-4 opacity-20" />
                <p>Submit a transaction to view the AI risk evaluation.</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
