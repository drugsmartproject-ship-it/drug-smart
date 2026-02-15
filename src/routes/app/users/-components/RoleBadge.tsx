import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Crown, ShieldCheck, User, UserCog } from 'lucide-react'

export type UserRole = 'owner' | 'manager' | 'cashier' | 'stock-keeper'

interface RoleBadgeProps {
  role: UserRole
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const configs = {
    owner: {
      label: 'Owner',
      className: 'bg-purple-100 text-purple-700 border-purple-200',
      icon: Crown,
    },
    manager: {
      label: 'Manager',
      className: 'bg-blue-100 text-blue-700 border-blue-200',
      icon: UserCog,
    },
    cashier: {
      label: 'Cashier',
      className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      icon: User,
    },
    'stock-keeper': {
      label: 'Stock Keeper',
      className: 'bg-orange-100 text-orange-700 border-orange-200',
      icon: ShieldCheck,
    },
  }

  const config = configs[role] || configs.cashier // Default to cashier if role is unknown
  const Icon = config.icon

  return (
    <Badge
      variant="outline"
      className={cn('font-bold text-xs border', config.className)}
    >
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  )
}
