import { Card, CardContent } from '@/components/ui/card'
import {
  DollarSign,
  TrendingUp,
  Activity,
  CreditCard,
  ArrowUpRight,
} from 'lucide-react'

export function DashboardSummaryCards() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Revenue Card - Primary Gradient */}
      <Card className="shadow-xl shadow-primary/10 border-0 bg-gradient-to-br from-primary to-accent text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
          <DollarSign className="h-24 w-24" />
        </div>

        <CardContent className="p-6 relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <span className="flex items-center text-xs font-semibold bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg">
              <TrendingUp className="h-3 w-3 mr-1" /> +20.1%
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-medium text-white/80">Total Revenue</h3>
            <div className="text-3xl font-bold tracking-tight">
              GH₵ 5,231.89
            </div>
          </div>

          <div className="mt-4 h-1 w-full bg-black/10 rounded-full overflow-hidden">
            <div className="h-full bg-white/50 w-[75%]" />
          </div>
        </CardContent>
      </Card>

      {/* Sales Card - Dark Glass */}
      <Card className="shadow-lg shadow-slate-200/50 border-0 bg-white/80 backdrop-blur-xl relative overflow-hidden group hover:ring-2 hover:ring-primary/10 transition-all">
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-slate-900/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500" />

        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-slate-100 rounded-xl group-hover:bg-primary/10 transition-colors">
              <Activity className="h-5 w-5 text-slate-600 group-hover:text-primary transition-colors" />
            </div>
            <div className="p-2 rounded-full hover:bg-slate-100 cursor-pointer transition-colors">
              <ArrowUpRight className="h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-medium text-slate-500">
              Yesterday's Sales
            </h3>
            <div className="text-3xl font-bold text-slate-800 tracking-tight">
              GH₵ 1,124.00
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-md">
              142 transactions
            </span>
            <span className="text-xs text-slate-400">vs 120 avg</span>
          </div>
        </CardContent>
      </Card>

      {/* Profit Card - Accent Style */}
      <Card className="shadow-lg shadow-blue-500/5 border-0 bg-white relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <CardContent className="p-6 relative">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-50 rounded-xl">
              <CreditCard className="h-5 w-5 text-blue-600" />
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-medium text-slate-500">
              Net Profit Estimate
            </h3>
            <div className="text-3xl font-bold text-slate-800 tracking-tight">
              GH₵ 842.00
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-blue-600 font-semibold flex items-center bg-blue-50 px-2 py-1 rounded-lg">
              ~18.5% Margin
            </p>
            <div className="h-8 w-[100px] flex items-end gap-1">
              {[40, 70, 45, 90, 60].map((h, i) => (
                <div
                  key={i}
                  style={{ height: `${h}%` }}
                  className="flex-1 bg-blue-200 rounded-sm"
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
