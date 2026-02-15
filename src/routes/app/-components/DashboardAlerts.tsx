import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, ArrowRight, Clock, AlertCircle } from 'lucide-react'

export function DashboardAlerts() {
  return (
    <Card className="col-span-3 shadow-lg shadow-slate-200/50 border-0 bg-white/50 backdrop-blur-md flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-bold text-slate-800 tracking-tight">
              Needs Attention
            </CardTitle>
            <CardDescription>
              Critical inventory alerts requiring action.
            </CardDescription>
          </div>
          <div className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
            3 Critical
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto pr-2">
        <div className="space-y-3">
          {/* Alert Item 1 - Low Stock */}
          <div className="group flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-red-200 hover:shadow-md hover:shadow-red-500/5 transition-all duration-300 cursor-pointer">
            <div className="bg-red-100 p-2.5 rounded-xl group-hover:scale-110 transition-transform">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-start">
                <p className="text-sm font-bold text-slate-800">
                  Paracetamol 500mg
                </p>
                <span className="text-[10px] font-bold uppercase text-red-500 bg-red-50 px-2 py-0.5 rounded-lg">
                  Low Stock
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Only <span className="text-red-600 font-bold">5 packs</span>{' '}
                remaining in inventory.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-slate-300 group-hover:text-red-500 group-hover:translate-x-1 transition-all"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Alert Item 2 - Expiry */}
          <div className="group flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-orange-200 hover:shadow-md hover:shadow-orange-500/5 transition-all duration-300 cursor-pointer">
            <div className="bg-orange-100 p-2.5 rounded-xl group-hover:scale-110 transition-transform">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-start">
                <p className="text-sm font-bold text-slate-800">
                  Amoxicillin Syrup
                </p>
                <span className="text-[10px] font-bold uppercase text-orange-500 bg-orange-50 px-2 py-0.5 rounded-lg">
                  Expiring
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Expires in{' '}
                <span className="text-orange-600 font-bold">14 days</span>.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-slate-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Alert Item 3 - Expiry */}
          <div className="group flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-orange-200 hover:shadow-md hover:shadow-orange-500/5 transition-all duration-300 cursor-pointer">
            <div className="bg-orange-100 p-2.5 rounded-xl group-hover:scale-110 transition-transform">
              <AlertCircle className="h-5 w-5 text-orange-600" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-start">
                <p className="text-sm font-bold text-slate-800">
                  Vitamin C 1000mg
                </p>
                <span className="text-[10px] font-bold uppercase text-orange-500 bg-orange-50 px-2 py-0.5 rounded-lg">
                  Expiring
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Expires in{' '}
                <span className="text-orange-600 font-bold">28 days</span>.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-slate-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
