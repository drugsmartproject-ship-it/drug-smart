import { Users, UserCheck, UserX, UserCog, LucideIcon } from 'lucide-react'
import { useTheme } from '@/lib/theme-context'

interface Stats {
  total: number
  active: number
  inactive: number
  roles: {
    owner: number
    manager: number
    cashier: number
    stock_keeper: number
  }
}

interface UserStatsProps {
  stats: Stats
}

interface StatCardProps {
  title: string
  value: number
  icon: LucideIcon
  gradient: string
  iconStyle: React.CSSProperties
  labelStyle: string
  valueStyle: string
  accentColor: string
}

function StatCard({
  title,
  value,
  icon: Icon,
  gradient,
  iconStyle,
  labelStyle,
  valueStyle,
  accentColor,
}: StatCardProps) {
  return (
    <div
      className={`rounded-2xl p-5 border-2 relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all duration-300 ${gradient}`}
      style={{
        boxShadow: `0 4px 20px color-mix(in srgb, ${accentColor} 12%, transparent)`,
      }}
    >
      <div
        className="absolute -top-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-15 group-hover:opacity-30 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle, ${accentColor}, transparent)`,
        }}
      />

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

export function UserStats({ stats }: UserStatsProps) {
  const { theme } = useTheme()

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Total — Theme gradient */}
      <div
        className="rounded-2xl p-5 relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all duration-300"
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
          <Users className="h-5 w-5 text-white" />
        </div>
        <p className="text-3xl font-black tracking-tight text-white mb-0.5">
          {stats.total}
        </p>
        <p className="text-xs font-bold uppercase tracking-wide text-white/70">
          Total Users
        </p>
      </div>

      <StatCard
        title="Active Users"
        value={stats.active}
        icon={UserCheck}
        gradient="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200"
        iconStyle={{
          background: 'linear-gradient(135deg, #10b981, #0d9488)',
          color: 'white',
        }}
        labelStyle="text-emerald-600"
        valueStyle="text-emerald-900"
        accentColor="#10b981"
      />

      <StatCard
        title="Inactive Users"
        value={stats.inactive}
        icon={UserX}
        gradient="bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200"
        iconStyle={{
          background: 'linear-gradient(135deg, #64748b, #475569)',
          color: 'white',
        }}
        labelStyle="text-slate-500"
        valueStyle="text-slate-800"
        accentColor="#64748b"
      />

      <StatCard
        title="Managers"
        value={stats.roles.manager}
        icon={UserCog}
        gradient="bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200"
        iconStyle={{
          background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
          color: 'white',
        }}
        labelStyle="text-violet-600"
        valueStyle="text-violet-900"
        accentColor="#7c3aed"
      />
    </div>
  )
}
