import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Package,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Edit,
  Trash2,
  TrendingUp,
  TrendingDown,
  Pill,
  ArrowUpDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Drug {
  id: string
  name: string
  category: string
  quantity: number
  costPrice: number
  sellingPrice: number
  expiryDate: string
  supplier: string
  status: 'in-stock' | 'low-stock' | 'expiring-soon' | 'out-of-stock'
}

interface InventoryTableProps {
  drugs: Drug[]
}

function getStatusBadge(status: Drug['status']) {
  const configs = {
    'in-stock': {
      label: 'In Stock',
      className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      icon: CheckCircle2,
    },
    'low-stock': {
      label: 'Low Stock',
      className: 'bg-orange-100 text-orange-700 border-orange-200',
      icon: AlertTriangle,
    },
    'expiring-soon': {
      label: 'Expiring Soon',
      className: 'bg-amber-100 text-amber-700 border-amber-200',
      icon: Clock,
    },
    'out-of-stock': {
      label: 'Out of Stock',
      className: 'bg-red-100 text-red-700 border-red-200',
      icon: AlertTriangle,
    },
  }

  const config = configs[status]
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

export function InventoryTable({ drugs }: InventoryTableProps) {
  return (
    <Card className="border-2 border-slate-200 rounded-2xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="font-black text-slate-900">
              <Button
                variant="ghost"
                className="h-auto p-0 hover:bg-transparent font-black"
              >
                Drug Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="font-black text-slate-900">
              Category
            </TableHead>
            <TableHead className="font-black text-slate-900">
              Quantity
            </TableHead>
            <TableHead className="font-black text-slate-900">Price</TableHead>
            <TableHead className="font-black text-slate-900">
              Expiry Date
            </TableHead>
            <TableHead className="font-black text-slate-900">Status</TableHead>
            <TableHead className="font-black text-slate-900 text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {drugs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                    <Package className="h-8 w-8 text-slate-400" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 mb-1">
                      No drugs found
                    </p>
                    <p className="text-sm text-slate-500">
                      Try adjusting your search or filters
                    </p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            drugs.map((drug) => (
              <TableRow
                key={drug.id}
                className="hover:bg-slate-50 transition-colors"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center flex-shrink-0">
                      <Pill className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 truncate">
                        {drug.name}
                      </div>
                      <div className="text-xs text-slate-500 font-medium truncate">
                        {drug.supplier}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className="bg-slate-100 text-slate-700 font-semibold"
                  >
                    {drug.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">
                      {drug.quantity}
                    </span>
                    <span className="text-xs text-slate-500">units</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm">
                      <TrendingDown className="h-3 w-3 text-red-500" />
                      <span className="text-slate-500 font-medium">
                        GH₵ {drug.costPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <TrendingUp className="h-3 w-3 text-emerald-500" />
                      <span className="font-bold text-slate-900">
                        GH₵ {drug.sellingPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-semibold text-slate-700">
                    {new Date(drug.expiryDate).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(drug.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-lg hover:bg-primary/10 hover:text-primary"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-lg hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  )
}
