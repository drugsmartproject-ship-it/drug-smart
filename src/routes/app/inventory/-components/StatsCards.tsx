import {
  Package,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  LucideIcon,
} from 'lucide-react'
import { useTheme } from '@/lib/theme-context'

interface StatsCardsProps {
  stats: {
    total: number
    inStock: number
    lowStock: number
    expiringSoon: number
    outOfStock: number
  }
}

interface StatCardProps {
  title: string
  value: number
  icon: LucideIcon
  gradient?: string
  iconStyle?: React.CSSProperties
  labelStyle?: string
  valueStyle?: string
  accentColor?: string
}

function StatCard({
  title,
  value,
  icon: Icon,
  gradient,
  iconStyle,
  labelStyle = 'text-slate-500',
  valueStyle = 'text-slate-900',
  accentColor,
}: StatCardProps) {
  return (
    <div
      className={`rounded-2xl p-5 border-2 relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all duration-300 ${gradient || 'bg-white border-slate-100'}`}
      style={
        accentColor
          ? {
              boxShadow: `0 4px 20px color-mix(in srgb, ${accentColor} 10%, transparent)`,
            }
          : { boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }
      }
    >
      {/* Orb background */}
      {accentColor && (
        <div
          className="absolute -top-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 group-hover:opacity-35 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle, ${accentColor}, transparent)`,
          }}
        />
      )}

      <div
        className="h-10 w-10 rounded-xl flex items-center justify-center mb-4 relative z-10"
        style={iconStyle}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div className="relative z-10">
        <p
          className={`text-3xl font-black tracking-tight mb-0.5 ${valueStyle}`}
        >
          {value}
        </p>
        <p
          className={`text-xs font-bold uppercase tracking-wide ${labelStyle}`}
        >
          {title}
        </p>
      </div>
    </div>
  )
}

export function StatsCards({ stats }: StatsCardsProps) {
  const { theme } = useTheme()

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {/* Total — theme-colored */}
      <div
        className="rounded-2xl p-5 relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all duration-300 col-span-2 md:col-span-1"
        style={{
          background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
          boxShadow: `0 12px 32px color-mix(in srgb, ${theme.primary} 30%, transparent)`,
        }}
      >
        <div
          className="absolute -top-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20"
          style={{ background: 'radial-gradient(circle, white, transparent)' }}
        />
        <div className="h-10 w-10 rounded-xl flex items-center justify-center mb-4 bg-white/20 backdrop-blur-sm">
          <Package className="h-5 w-5 text-white" />
        </div>
        <p className="text-3xl font-black tracking-tight text-white mb-0.5">
          {stats.total}
        </p>
        <p className="text-xs font-bold uppercase tracking-wide text-white/70">
          Total Items
        </p>
      </div>

      {/* In Stock */}
      <StatCard
        title="In Stock"
        value={stats.inStock}
        icon={CheckCircle2}
        gradient="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200"
        iconStyle={{
          background: 'linear-gradient(135deg, #10b981, #0d9488)',
          color: 'white',
        }}
        labelStyle="text-emerald-600"
        valueStyle="text-emerald-900"
        accentColor="#10b981"
      />

      {/* Low Stock */}
      <StatCard
        title="Low Stock"
        value={stats.lowStock}
        icon={AlertTriangle}
        gradient="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200"
        iconStyle={{
          background: 'linear-gradient(135deg, #f97316, #eab308)',
          color: 'white',
        }}
        labelStyle="text-orange-600"
        valueStyle="text-orange-900"
        accentColor="#f97316"
      />

      {/* Expiring Soon */}
      <StatCard
        title="Expiring Soon"
        value={stats.expiringSoon}
        icon={Clock}
        gradient="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200"
        iconStyle={{
          background: 'linear-gradient(135deg, #d97706, #ca8a04)',
          color: 'white',
        }}
        labelStyle="text-amber-600"
        valueStyle="text-amber-900"
        accentColor="#d97706"
      />

      {/* Out of Stock */}
      <StatCard
        title="Out of Stock"
        value={stats.outOfStock}
        icon={XCircle}
        gradient="bg-gradient-to-br from-red-50 to-rose-50 border-red-200"
        iconStyle={{
          background: 'linear-gradient(135deg, #ef4444, #e11d48)',
          color: 'white',
        }}
        labelStyle="text-red-600"
        valueStyle="text-red-900"
        accentColor="#ef4444"
      />
    </div>
  )
}
