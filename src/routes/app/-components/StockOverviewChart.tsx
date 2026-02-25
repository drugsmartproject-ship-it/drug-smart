import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { BarChart3, TrendingUp } from 'lucide-react'
import { useTheme } from '@/lib/theme-context'

const chartData = [
  { label: 'Analgesics', value: 65, units: 650 },
  { label: 'Antibiotics', value: 40, units: 400 },
  { label: 'Vitamins', value: 75, units: 750 },
  { label: 'Cardio', value: 50, units: 500 },
  { label: 'Diabetes', value: 85, units: 850 },
  { label: 'Topicals', value: 30, units: 300 },
  { label: 'Others', value: 60, units: 600 },
]

export function StockOverviewChart() {
  const { theme } = useTheme()
  const maxValue = Math.max(...chartData.map((d) => d.value))

  return (
    <Card
      className="col-span-4 border relative overflow-hidden bg-white"
      style={{
        borderColor: `color-mix(in srgb, ${theme.primary} 10%, #e2e8f0)`,
        boxShadow: `0 4px 24px rgba(0,0,0,0.04), 0 0 0 0px ${theme.primary}`,
      }}
    >
      {/* Background gradient accent */}
      <div
        className="absolute top-0 left-0 w-full h-1 rounded-t-xl"
        style={{
          background: `linear-gradient(90deg, ${theme.primary}, ${theme.accent})`,
        }}
      />

      <CardHeader className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-black text-slate-800 tracking-tight">
              Stock Overview
            </CardTitle>
            <CardDescription className="text-xs text-slate-400 mt-0.5">
              Inventory distribution by category — current month
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-xl"
              style={{
                color: theme.primary,
                background: `color-mix(in srgb, ${theme.primary} 8%, transparent)`,
              }}
            >
              <TrendingUp className="h-3 w-3" /> +12.4%
            </span>
            <div
              className="p-2 rounded-xl"
              style={{
                background: `color-mix(in srgb, ${theme.primary} 5%, #f1f5f9)`,
              }}
            >
              <BarChart3 className="h-4 w-4" style={{ color: theme.primary }} />
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <div
              className="h-2.5 w-2.5 rounded-sm"
              style={{
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
              }}
            />
            <span className="text-xs text-slate-500 font-medium">In Stock</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-sm bg-slate-100" />
            <span className="text-xs text-slate-400 font-medium">Capacity</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-6">
        {/* Y-axis labels + grid */}
        <div className="relative">
          {/* Grid lines */}
          <div
            className="absolute inset-0 flex flex-col justify-between pointer-events-none"
            style={{ paddingBottom: '2.5rem' }}
          >
            {[100, 75, 50, 25, 0].map((pct) => (
              <div key={pct} className="flex items-center gap-2">
                <span className="text-[10px] text-slate-300 font-medium w-6 text-right">
                  {pct}
                </span>
                <div className="flex-1 h-px bg-slate-100" />
              </div>
            ))}
          </div>

          {/* Bar Chart */}
          <div className="h-[220px] w-full flex items-end justify-between gap-2 pl-10 pt-2 pb-10">
            {chartData.map((item, i) => {
              const heightPct = (item.value / maxValue) * 100
              // Compute gradient alpha for each bar
              const hue = i / (chartData.length - 1)
              return (
                <div
                  key={i}
                  className="flex flex-col items-center gap-0 group w-full h-full justify-end relative"
                >
                  {/* Tooltip */}
                  <div
                    className="absolute -top-10 left-1/2 -translate-x-1/2 text-white text-[10px] font-black py-1.5 px-3 rounded-xl opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300 whitespace-nowrap shadow-xl z-20 pointer-events-none"
                    style={{
                      background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
                    }}
                  >
                    {item.units} units
                    <div
                      className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45"
                      style={{ background: theme.accent }}
                    />
                  </div>

                  {/* Background track */}
                  <div
                    className="w-full rounded-xl absolute bottom-10"
                    style={{
                      height: '100%',
                      background: `color-mix(in srgb, ${theme.primary} 4%, #f1f5f9)`,
                    }}
                  />

                  {/* Actual bar */}
                  <div
                    className="w-full rounded-xl relative z-10 mx-auto transition-all duration-700 ease-out group-hover:brightness-110"
                    style={{
                      height: `${heightPct}%`,
                      marginBottom: '2.5rem',
                      width: '70%',
                      background:
                        hue < 0.5
                          ? `linear-gradient(to top, ${theme.primary}, color-mix(in srgb, ${theme.primary} 60%, ${theme.accent}))`
                          : `linear-gradient(to top, ${theme.accent}, color-mix(in srgb, ${theme.accent} 60%, ${theme.primary}))`,
                      boxShadow: `0 4px 16px color-mix(in srgb, ${theme.primary} ${Math.round(heightPct * 0.25)}%, transparent)`,
                    }}
                  />

                  {/* X-axis label */}
                  <span
                    className="absolute bottom-0 text-[9px] font-bold uppercase tracking-wide text-center w-full leading-tight transition-colors duration-200"
                    style={{
                      color: `color-mix(in srgb, ${theme.primary} 0%, #9ca3af)`,
                    }}
                  >
                    {item.label.length > 7
                      ? item.label.slice(0, 6) + '…'
                      : item.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
