import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Filter } from 'lucide-react'

interface SearchFilterBarProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedRole: string
  setSelectedRole: (role: string) => void
}

export function SearchFilterBar({
  searchQuery,
  setSearchQuery,
  selectedRole,
  setSelectedRole,
}: SearchFilterBarProps) {
  return (
    <Card className="border-2 border-slate-200 rounded-2xl">
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by user name or email..."
              className="pl-10 h-12 bg-slate-50 border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl"
            />
          </div>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-full sm:w-[200px] h-12 rounded-xl border-slate-200">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="owner">Owner</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="cashier">Cashier</SelectItem>
              <SelectItem value="stock-keeper">Stock Keeper</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
