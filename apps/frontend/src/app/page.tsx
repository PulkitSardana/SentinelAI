"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Shield, ArrowRight, Activity, Lock, Database } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/20">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight">SentinelAI</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
            <Link href="#architecture" className="hover:text-foreground transition-colors">Architecture</Link>
            <Link href="#performance" className="hover:text-foreground transition-colors">Performance</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button>Launch Platform</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 md:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
          <div className="container relative mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto space-y-8"
            >
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Enterprise Fraud Detection,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                  Powered by Explainable AI
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Process millions of transactions with sub-50ms latency. Detect complex fraud rings and protect your bottom line with bank-grade machine learning.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <Link href="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto text-base">
                    Start Detection <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-base">
                    Explore Architecture
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-24 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight">Bank-Grade Infrastructure</h2>
              <p className="text-muted-foreground mt-4 text-lg">Built for scale, security, and precision.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-background p-8 rounded-2xl border shadow-sm">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Real-time Processing</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Evaluate live transactions in milliseconds using optimized XGBoost trees and Node.js SSE streams.
                </p>
              </div>
              <div className="bg-background p-8 rounded-2xl border shadow-sm">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Explainable AI</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Understand exactly why a transaction was flagged with SHAP (SHapley Additive exPlanations) values.
                </p>
              </div>
              <div className="bg-background p-8 rounded-2xl border shadow-sm">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <Database className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Enterprise Scale</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Distributed architecture ready to handle massive transaction volumes with React Virtualization.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 bg-background">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-semibold">SentinelAI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 SentinelAI Platform. Designed for Enterprise Security.
          </p>
        </div>
      </footer>
    </div>
  )
}
