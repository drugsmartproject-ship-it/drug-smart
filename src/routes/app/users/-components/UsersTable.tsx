import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Edit,
  Trash2,
  Lock,
  Unlock,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
  User,
} from 'lucide-react'
import { RoleBadge, UserRole } from './RoleBadge'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: 'active' | 'inactive' | 'suspended'
  lastActive: string
  avatarUrl?: string
}

interface UsersTableProps {
  users: User[]
}

function StatusBadge({ status }: { status: User['status'] }) {
  const configs = {
    active: {
      label: 'Active',
      className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      icon: CheckCircle2,
    },
    inactive: {
      label: 'Inactive',
      className: 'bg-slate-100 text-slate-700 border-slate-200',
      icon: Clock,
    },
    suspended: {
      label: 'Suspended',
      className: 'bg-red-100 text-red-700 border-red-200',
      icon: XCircle,
    },
  }

  const config = configs[status]
  const Icon = config.icon

  return (
    <Badge
      variant="outline"
      className={`font-bold text-xs border ${config.className}`}
    >
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  )
}

export function UsersTable({ users }: UsersTableProps) {
  return (
    <Card className="border-2 border-slate-200 rounded-2xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="font-black text-slate-900 w-[250px]">
              User
            </TableHead>
            <TableHead className="font-black text-slate-900">Role</TableHead>
            <TableHead className="font-black text-slate-900">Status</TableHead>
            <TableHead className="font-black text-slate-900">
              Last Active
            </TableHead>
            <TableHead className="font-black text-slate-900 text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              className="hover:bg-slate-50 transition-colors"
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 text-slate-500" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{user.name}</div>
                    <div className="text-xs text-slate-500 font-medium">
                      {user.email}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <RoleBadge role={user.role} />
              </TableCell>
              <TableCell>
                <StatusBadge status={user.status} />
              </TableCell>
              <TableCell>
                <span className="text-sm font-medium text-slate-600">
                  {new Date(user.lastActive).toLocaleDateString()}{' '}
                  <span className="text-slate-400 text-xs">
                    at {new Date(user.lastActive).toLocaleTimeString()}
                  </span>
                </span>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg hover:bg-slate-100"
                    >
                      <MoreVertical className="h-4 w-4 text-slate-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" /> Edit User
                    </DropdownMenuItem>
                    {user.status === 'suspended' ? (
                      <DropdownMenuItem className="text-emerald-600">
                        <Unlock className="mr-2 h-4 w-4" /> Activate
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem className="text-amber-600">
                        <Lock className="mr-2 h-4 w-4" /> Suspend
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
