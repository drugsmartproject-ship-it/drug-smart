import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  AlertTriangle,
  ArrowRight,
  Clock,
  AlertCircle,
  BellRing,
} from 'lucide-react'
import { useTheme } from '@/lib/theme-context'

const alerts = [
  {
    id: 1,
    type: 'low-stock',
    drug: 'Paracetamol 500mg',
    detail: 'Only 5 packs remaining in inventory.',
    highlight: '5 packs',
    icon: AlertTriangle,
    severity: 'critical',
    colorClass: {
      bg: 'bg-red-100',
      text: 'text-red-600',
      badge: 'bg-red-50 text-red-500',
      border: 'hover:border-red-200',
      shadow: 'hover:shadow-red-500/5',
      highlight: 'text-red-600',
    },
    label: 'Low Stock',
  },
  {
    id: 2,
    type: 'expiry',
    drug: 'Amoxicillin Syrup',
    detail: 'Expires in 14 days.',
    highlight: '14 days',
    icon: Clock,
    severity: 'warning',
    colorClass: {
      bg: 'bg-orange-100',
      text: 'text-orange-600',
      badge: 'bg-orange-50 text-orange-500',
      border: 'hover:border-orange-200',
      shadow: 'hover:shadow-orange-500/5',
      highlight: 'text-orange-600',
    },
    label: 'Expiring',
  },
  {
    id: 3,
    type: 'expiry',
    drug: 'Vitamin C 1000mg',
    detail: 'Expires in 28 days.',
    highlight: '28 days',
    icon: AlertCircle,
    severity: 'info',
    colorClass: {
      bg: 'bg-amber-100',
      text: 'text-amber-600',
      badge: 'bg-amber-50 text-amber-500',
      border: 'hover:border-amber-200',
      shadow: 'hover:shadow-amber-500/5',
      highlight: 'text-amber-600',
    },
    label: 'Expiring',
  },
]

export function DashboardAlerts() {
  const { theme } = useTheme()

  return (
    <Card
      className="col-span-3 border bg-white/60 backdrop-blur-md flex flex-col h-full"
      style={{
        borderColor: `color-mix(in srgb, ${theme.primary} 10%, #e2e8f0)`,
        boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
      }}
    >
      {/* Top accent bar */}
      <div
        className="w-full h-1 rounded-t-xl"
        style={{ background: 'linear-gradient(90deg, #ef4444, #f97316)' }}
      />

      <CardHeader className="pt-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
              <BellRing className="h-5 w-5 text-red-500" />
              Needs Attention
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Critical inventory alerts requiring action
            </CardDescription>
          </div>
          <div className="bg-red-50 text-red-600 px-3 py-1.5 rounded-full text-xs font-black animate-pulse border border-red-100">
            3 Critical
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto pr-1 pb-4 space-y-2.5">
        {alerts.map((alert) => {
          const Icon = alert.icon
          const c = alert.colorClass
          return (
            <div
              key={alert.id}
              className={`group flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-100 ${c.border} hover:shadow-md ${c.shadow} transition-all duration-300 cursor-pointer`}
            >
              <div
                className={`${c.bg} p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-200 flex-shrink-0`}
              >
                <Icon className={`h-5 w-5 ${c.text}`} />
              </div>
              <div className="flex-1 space-y-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <p className="text-sm font-bold text-slate-800 truncate">
                    {alert.drug}
                  </p>
                  <span
                    className={`text-[10px] font-black uppercase ${c.badge} px-2 py-0.5 rounded-lg flex-shrink-0`}
                  >
                    {alert.label}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {alert.detail.split(alert.highlight)[0]}
                  <span className={`font-black ${c.highlight}`}>
                    {alert.highlight}
                  </span>
                  {alert.detail.split(alert.highlight)[1]}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 w-8 p-0 flex-shrink-0 text-slate-300 group-hover:${c.text.replace('text-', 'text-')} group-hover:translate-x-0.5 transition-all duration-200`}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )
        })}

        {/* View all button */}
        <button
          className="w-full mt-1 text-xs font-bold py-2.5 rounded-xl transition-all duration-200 hover:opacity-90"
          style={{
            color: theme.primary,
            background: `color-mix(in srgb, ${theme.primary} 6%, transparent)`,
            border: `1px dashed color-mix(in srgb, ${theme.primary} 25%, transparent)`,
          }}
        >
          View all alerts →
        </button>
      </CardContent>
    </Card>
  )
}
