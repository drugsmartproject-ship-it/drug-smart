import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Users,
  UserCheck,
  UserX,
  ShieldCheck,
  LucideIcon,
  Crown,
  UserCog,
} from 'lucide-react'

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
  gradient?: string
  iconBg?: string
  iconColor?: string
  textColor?: string
}

function StatCard({
  title,
  value,
  icon: Icon,
  gradient,
  iconBg,
  iconColor,
  textColor,
}: StatCardProps) {
  return (
    <Card
      className={`border-2 hover:shadow-lg transition-all rounded-2xl ${
        gradient || 'border-slate-200 hover:border-primary/30'
      }`}
    >
      <CardHeader className="pb-3">
        <div
          className={`h-10 w-10 rounded-xl flex items-center justify-center mb-2 ${iconBg || 'bg-slate-100'}`}
        >
          <Icon className={`h-5 w-5 ${iconColor || 'text-slate-600'}`} />
        </div>
        <CardTitle
          className={`text-3xl font-black ${textColor || 'text-slate-900'}`}
        >
          {value}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p
          className={`text-sm font-semibold ${textColor ? textColor.replace('900', '700') : 'text-slate-500'}`}
        >
          {title}
        </p>
      </CardContent>
    </Card>
  )
}

export function UserStats({ stats }: UserStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        title="Total Users"
        value={stats.total}
        icon={Users}
        gradient="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200"
        iconBg="bg-indigo-100"
        iconColor="text-indigo-600"
        textColor="text-indigo-900"
      />

      <StatCard
        title="Active Now"
        value={stats.active}
        icon={UserCheck}
        gradient="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200"
        iconBg="bg-emerald-100"
        iconColor="text-emerald-600"
        textColor="text-emerald-900"
      />

      <StatCard
        title="Inactive Users"
        value={stats.inactive}
        icon={UserX}
        gradient="bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200"
        iconBg="bg-gray-100"
        iconColor="text-gray-600"
        textColor="text-gray-900"
      />

      <StatCard
        title="Managers"
        value={stats.roles.manager}
        icon={UserCog}
        gradient="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200"
        iconBg="bg-purple-100"
        iconColor="text-purple-600"
        textColor="text-purple-900"
      />
    </div>
  )
}
