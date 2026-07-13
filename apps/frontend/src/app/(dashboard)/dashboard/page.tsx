import { KPIStats } from "@/components/dashboard/KPIStats"
import { LiveTable } from "@/components/dashboard/LiveTable"
import { DistributionChart } from "@/components/dashboard/DistributionChart"
import { FraudTrendChart } from "@/components/dashboard/FraudTrendChart"
import { RiskScoreHistogram } from "@/components/dashboard/RiskScoreHistogram"
import { InfrastructureHealth } from "@/components/dashboard/InfrastructureHealth"
import { ModelHealth } from "@/components/dashboard/ModelHealth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-100">SOC Dashboard</h2>
        <p className="text-slate-400 mt-2">
          Real-time enterprise fraud intelligence and system health monitoring.
        </p>
      </div>

      <KPIStats />

      <div className="grid gap-6 grid-cols-1 xl:grid-cols-12">
        <div className="xl:col-span-8 flex flex-col gap-6">
          <Card className="bg-slate-900/50 backdrop-blur border-slate-800 shadow-xl overflow-hidden flex flex-col flex-1 min-h-[400px]">
            <CardHeader className="border-b border-slate-800/60 bg-slate-900/50">
              <CardTitle className="text-slate-200">Live Transaction Stream</CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col">
              <LiveTable />
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur border-slate-800 shadow-xl">
            <CardHeader>
              <CardTitle className="text-slate-200">Fraud Trend (24h)</CardTitle>
            </CardHeader>
            <CardContent>
              <FraudTrendChart />
            </CardContent>
          </Card>
        </div>

        <div className="xl:col-span-4 flex flex-col gap-6">
          <Card className="bg-slate-900/50 backdrop-blur border-slate-800 shadow-xl">
            <CardHeader>
              <CardTitle className="text-slate-200">Decision Outcomes</CardTitle>
            </CardHeader>
            <CardContent>
              <DistributionChart />
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur border-slate-800 shadow-xl">
            <CardHeader>
              <CardTitle className="text-slate-200">Risk Score Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <RiskScoreHistogram />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="bg-slate-900/50 backdrop-blur border-slate-800 shadow-xl">
          <CardHeader>
            <CardTitle className="text-slate-200">Infrastructure Health</CardTitle>
          </CardHeader>
          <CardContent>
            <InfrastructureHealth />
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 backdrop-blur border-slate-800 shadow-xl">
          <CardHeader>
            <CardTitle className="text-slate-200">Model Performance (Champion)</CardTitle>
          </CardHeader>
          <CardContent>
            <ModelHealth />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
