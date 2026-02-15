import { createFileRoute } from '@tanstack/react-router'
import { AddDrugDialog } from './-components/AddDrugDialog'
import { DashboardSummaryCards } from './-components/DashboardSummaryCards'
import { StockOverviewChart } from './-components/StockOverviewChart'
import { DashboardAlerts } from './-components/DashboardAlerts'

export const Route = createFileRoute('/app/')({
  component: DashboardComponent,
})

function DashboardComponent() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-500">
            Welcome back, Dr. Kwame. Here's what's happening today.
          </p>
        </div>
        <div className="flex gap-2">
          <AddDrugDialog />
        </div>
      </div>

      {/* Summary Cards */}
      <DashboardSummaryCards />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Stock Overview (Chart Mock) */}
        <StockOverviewChart />

        {/* Alerts Section */}
        <DashboardAlerts />
      </div>
    </div>
  )
}
