import { Card, CardContent } from '@/components/ui/card'
import {
  DollarSign,
  TrendingUp,
  Activity,
  CreditCard,
  ArrowUpRight,
  ShoppingBag,
} from 'lucide-react'
import { useTheme } from '@/lib/theme-context'

export function DashboardSummaryCards() {
  const { theme } = useTheme()

  return (
    <div className="grid gap-5 md:grid-cols-3">
      {/* Revenue Card - Full Theme Gradient */}
      <Card
        className="border-0 text-white relative overflow-hidden group cursor-pointer"
        style={{
          background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.accent} 100%)`,
          boxShadow: `0 20px 60px -10px color-mix(in srgb, ${theme.primary} 40%, transparent)`,
        }}
      >
        {/* Background orbs */}
        <div
          className="absolute -top-8 -right-8 w-48 h-48 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500"
          style={{
            background: 'radial-gradient(circle, white 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute -bottom-10 -left-6 w-40 h-40 rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, white 0%, transparent 70%)',
          }}
        />

        <CardContent className="p-6 relative z-10">
          <div className="flex justify-between items-start mb-5">
            <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-2xl shadow-inner">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <span className="flex items-center text-xs font-bold bg-white/20 backdrop-blur-md px-2.5 py-1.5 rounded-xl">
              <TrendingUp className="h-3 w-3 mr-1.5" /> +20.1%
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-xs font-bold text-white/70 uppercase tracking-widest">
              Total Revenue
            </h3>
            <div className="text-3xl font-black tracking-tight text-white">
              GH₵ 5,231
              <span className="text-xl font-semibold text-white/60">.89</span>
            </div>
          </div>

          {/* Animated progress bar */}
          <div className="mt-5 h-1.5 w-full bg-black/15 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: '75%',
                background: 'rgba(255,255,255,0.6)',
                animation: 'expand-bar 1.2s ease-out forwards',
              }}
            />
          </div>
          <p className="text-[11px] text-white/60 mt-1.5">
            75% of monthly target
          </p>
        </CardContent>
      </Card>

      {/* Yesterday's Sales - Glass Card */}
      <Card
        className="border relative overflow-hidden group cursor-pointer bg-white shadow-lg hover:shadow-xl transition-all duration-300"
        style={{
          borderColor: `color-mix(in srgb, ${theme.primary} 12%, #e2e8f0)`,
          boxShadow: `0 4px 24px rgba(0,0,0,0.05),0 0 0 0 color-mix(in srgb, ${theme.primary} 0%, transparent)`,
        }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLElement).style.boxShadow =
            `0 8px 32px rgba(0,0,0,0.08), 0 0 0 1.5px color-mix(in srgb, ${theme.primary} 25%, transparent)`
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLElement).style.boxShadow =
            `0 4px 24px rgba(0,0,0,0.05)`
        }}
      >
        {/* Accent gradient orb */}
        <div
          className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"
          style={{
            background: `radial-gradient(circle, color-mix(in srgb, ${theme.primary} 15%, transparent), transparent)`,
          }}
        />

        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-5">
            <div
              className="p-2.5 rounded-2xl transition-colors duration-300"
              style={{
                background: `color-mix(in srgb, ${theme.primary} 8%, #f1f5f9)`,
              }}
            >
              <Activity className="h-5 w-5" style={{ color: theme.primary }} />
            </div>
            <div className="p-1.5 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors">
              <ArrowUpRight className="h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Yesterday's Sales
            </h3>
            <div className="text-3xl font-black text-slate-800 tracking-tight">
              GH₵ 1,124
              <span className="text-xl font-semibold text-slate-400">.00</span>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2.5">
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-lg"
              style={{
                color: theme.primary,
                background: `color-mix(in srgb, ${theme.primary} 8%, transparent)`,
              }}
            >
              142 transactions
            </span>
            <span className="text-xs text-slate-400 font-medium">
              vs 120 avg
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Net Profit - Accent Gradient */}
      <Card
        className="border relative overflow-hidden group cursor-pointer bg-white shadow-lg"
        style={{
          borderColor: `color-mix(in srgb, ${theme.accent} 12%, #e2e8f0)`,
        }}
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, color-mix(in srgb, ${theme.accent} 4%, transparent), transparent)`,
          }}
        />

        <CardContent className="p-6 relative">
          <div className="flex justify-between items-start mb-5">
            <div
              className="p-2.5 rounded-2xl"
              style={{
                background: `color-mix(in srgb, ${theme.accent} 10%, #f1f5f9)`,
              }}
            >
              <CreditCard className="h-5 w-5" style={{ color: theme.accent }} />
            </div>
            <div
              className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-xl"
              style={{
                color: theme.accent,
                background: `color-mix(in srgb, ${theme.accent} 10%, transparent)`,
              }}
            >
              <ShoppingBag className="h-3 w-3" />
              ~18.5% Margin
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Net Profit Estimate
            </h3>
            <div className="text-3xl font-black text-slate-800 tracking-tight">
              GH₵ 842
              <span className="text-xl font-semibold text-slate-400">.00</span>
            </div>
          </div>

          {/* Mini sparkline bar chart */}
          <div className="mt-5 h-10 w-full flex items-end gap-1.5">
            {[35, 65, 42, 88, 55, 70, 90].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-lg transition-all duration-300 group-hover:opacity-100"
                style={{
                  height: `${h}%`,
                  background: `linear-gradient(to top, ${theme.accent}, color-mix(in srgb, ${theme.accent} 50%, ${theme.primary}))`,
                  opacity: i === 6 ? 1 : 0.4 + i * 0.08,
                  animationDelay: `${i * 80}ms`,
                }}
              />
            ))}
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">Last 7 days trend</p>
        </CardContent>
      </Card>
    </div>
  )
}
