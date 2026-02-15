import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Package,
  AlertTriangle,
  Clock,
  CheckCircle2,
  LucideIcon,
} from 'lucide-react'

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

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <StatCard title="Total Items" value={stats.total} icon={Package} />

      <StatCard
        title="In Stock"
        value={stats.inStock}
        icon={CheckCircle2}
        gradient="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200"
        iconBg="bg-emerald-100"
        iconColor="text-emerald-600"
        textColor="text-emerald-900"
      />

      <StatCard
        title="Low Stock"
        value={stats.lowStock}
        icon={AlertTriangle}
        gradient="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200"
        iconBg="bg-orange-100"
        iconColor="text-orange-600"
        textColor="text-orange-900"
      />

      <StatCard
        title="Expiring Soon"
        value={stats.expiringSoon}
        icon={Clock}
        gradient="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200"
        iconBg="bg-amber-100"
        iconColor="text-amber-600"
        textColor="text-amber-900"
      />

      <StatCard
        title="Out of Stock"
        value={stats.outOfStock}
        icon={AlertTriangle}
        gradient="bg-gradient-to-br from-red-50 to-rose-50 border-red-200"
        iconBg="bg-red-100"
        iconColor="text-red-600"
        textColor="text-red-900"
      />
    </div>
  )
}
