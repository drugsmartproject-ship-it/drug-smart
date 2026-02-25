import { createFileRoute } from '@tanstack/react-router'
import { AddDrugDialog } from './-components/AddDrugDialog'
import { DashboardSummaryCards } from './-components/DashboardSummaryCards'
import { StockOverviewChart } from './-components/StockOverviewChart'
import { DashboardAlerts } from './-components/DashboardAlerts'
import { useTheme } from '@/lib/theme-context'
import { CalendarDays, Download, RefreshCw } from 'lucide-react'

export const Route = createFileRoute('/app/')({
  component: DashboardComponent,
})

function DashboardComponent() {
  const { theme } = useTheme()
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="space-y-7">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg"
              style={{
                color: theme.primary,
                background: `color-mix(in srgb, ${theme.primary} 8%, transparent)`,
              }}
            >
              <CalendarDays className="inline h-3 w-3 mr-1.5 -mt-0.5" />
              {today}
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Good morning, Dr. Kwame 👋
          </h1>
          <p className="text-slate-500 font-medium mt-0.5">
            Here's what's happening at your pharmacy today.
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl border transition-all hover:opacity-90"
            style={{
              color: 'var(--muted-foreground)',
              borderColor: '#e2e8f0',
              background: 'white',
            }}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
          <button
            className="flex items-center gap-2 text-sm font-bold text-white px-4 py-2.5 rounded-xl shadow-lg transition-all hover:opacity-90 active:scale-95"
            style={{
              background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
              boxShadow: `0 6px 20px color-mix(in srgb, ${theme.primary} 30%, transparent)`,
            }}
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </button>
          <AddDrugDialog />
        </div>
      </div>

      {/* Summary Cards */}
      <DashboardSummaryCards />

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-7">
        {/* Stock Overview (Chart) */}
        <StockOverviewChart />

        {/* Alerts Section */}
        <DashboardAlerts />
      </div>
    </div>
  )
}
