import { KPIStats } from "@/components/dashboard/KPIStats"
import { LiveTable } from "@/components/dashboard/LiveTable"
import { DistributionChart } from "@/components/dashboard/DistributionChart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">SOC Dashboard</h2>
        <p className="text-muted-foreground mt-2">
          Real-time enterprise fraud intelligence and system health monitoring.
        </p>
      </div>

      <KPIStats />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 overflow-hidden">
          <CardHeader className="border-b bg-muted/20">
            <CardTitle>Live Transactions Stream</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <LiveTable />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Decision Outcomes</CardTitle>
          </CardHeader>
          <CardContent>
            <DistributionChart />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
