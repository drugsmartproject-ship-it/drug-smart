import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, MoreHorizontal } from 'lucide-react'

export function RecentTransactions() {
  const transactions = [
    {
      id: 'TRX-9871',
      time: '10:42 AM',
      items: 3,
      total: 'GH₵ 45.00',
      method: 'Cash',
      status: 'Completed',
    },
    {
      id: 'TRX-9872',
      time: '10:38 AM',
      items: 1,
      total: 'GH₵ 12.50',
      method: 'Mobile Money',
      status: 'Completed',
    },
    {
      id: 'TRX-9873',
      time: '10:15 AM',
      items: 5,
      total: 'GH₵ 128.00',
      method: 'Cash',
      status: 'Completed',
    },
    {
      id: 'TRX-9874',
      time: '09:55 AM',
      items: 2,
      total: 'GH₵ 32.00',
      method: 'Card',
      status: 'Completed',
    },
    {
      id: 'TRX-9875',
      time: '09:40 AM',
      items: 1,
      total: 'GH₵ 8.00',
      method: 'Cash',
      status: 'Refunded',
    },
  ]

  return (
    <Card className="shadow-lg shadow-slate-200/50 border-0 bg-white">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow
                key={transaction.id}
                className="hover:bg-slate-50 border-slate-50 group transition-colors"
              >
                <TableCell className="font-medium text-slate-700">
                  {transaction.id}
                </TableCell>
                <TableCell className="text-slate-500">
                  {transaction.time}
                </TableCell>
                <TableCell className="text-slate-500">
                  {transaction.items} items
                </TableCell>
                <TableCell className="text-slate-500 text-xs">
                  <span className="bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                    {transaction.method}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={`
                        ${transaction.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : ''}
                        ${transaction.status === 'Refunded' ? 'bg-red-50 text-red-600 hover:bg-red-100' : ''}
                    `}
                  >
                    {transaction.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-bold text-slate-800">
                  {transaction.total}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
