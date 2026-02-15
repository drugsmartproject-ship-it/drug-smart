import { Card, CardContent } from '@/components/ui/card'
import { DollarSign, TrendingUp, CreditCard, ShoppingBag } from 'lucide-react'

export function SalesStats() {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="shadow-lg shadow-slate-200/50 border-0 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <DollarSign className="h-16 w-16" />
        </div>
        <CardContent className="p-6 relative z-10">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Today's Revenue
          </p>
          <div className="flex items-end gap-2 mt-1">
            <h2 className="text-2xl font-bold text-slate-800">GH₵ 1,248.50</h2>
            <span className="text-xs font-bold text-emerald-500 flex items-center mb-1">
              <TrendingUp className="h-3 w-3 mr-0.5" /> +12%
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg shadow-slate-200/50 border-0 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <ShoppingBag className="h-16 w-16" />
        </div>
        <CardContent className="p-6 relative z-10">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Transactions
          </p>
          <div className="flex items-end gap-2 mt-1">
            <h2 className="text-2xl font-bold text-slate-800">142</h2>
            <span className="text-xs font-bold text-emerald-500 flex items-center mb-1">
              <TrendingUp className="h-3 w-3 mr-0.5" /> +8%
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg shadow-slate-200/50 border-0 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <CreditCard className="h-16 w-16" />
        </div>
        <CardContent className="p-6 relative z-10">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Avg. Ticket Size
          </p>
          <div className="flex items-end gap-2 mt-1">
            <h2 className="text-2xl font-bold text-slate-800">GH₵ 8.80</h2>
            <span className="text-xs font-bold text-slate-400 flex items-center mb-1">
              -
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-xl shadow-primary/20 border-0 bg-gradient-to-br from-primary to-accent text-white relative overflow-hidden">
        <CardContent className="p-6 relative z-10 flex flex-col justify-center h-full">
          <p className="text-xs font-semibold text-white/80 uppercase tracking-wider">
            Top Product
          </p>
          <h2 className="text-xl font-bold mt-1">Paracetamol 500mg</h2>
          <p className="text-xs text-white/80 mt-1">45 units sold today</p>
        </CardContent>
      </Card>
    </div>
  )
}
