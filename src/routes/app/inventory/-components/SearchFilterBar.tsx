import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Filter } from 'lucide-react'
import { useTheme } from '@/lib/theme-context'

interface SearchFilterBarProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
}

export function SearchFilterBar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
}: SearchFilterBarProps) {
  const { theme } = useTheme()

  return (
    <div
      className="rounded-2xl border bg-white/80 backdrop-blur-md p-4"
      style={{
        borderColor: `color-mix(in srgb, ${theme.primary} 12%, #e2e8f0)`,
      }}
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 group">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200"
            style={{ color: searchQuery ? theme.primary : '#94a3b8' }}
          />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by drug name, category..."
            className="pl-10 h-11 bg-slate-50/80 border-slate-200 rounded-xl text-sm font-medium placeholder:text-slate-400 transition-all"
            style={{
              outlineColor: theme.primary,
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = theme.primary
              e.currentTarget.style.boxShadow = `0 0 0 3px color-mix(in srgb, ${theme.primary} 12%, transparent)`
              e.currentTarget.style.background = 'white'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = ''
              e.currentTarget.style.boxShadow = ''
              e.currentTarget.style.background = ''
            }}
          />
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger
            className="w-full sm:w-[200px] h-11 rounded-xl border-slate-200 font-medium text-sm"
            style={{}}
          >
            <Filter
              className="h-3.5 w-3.5 mr-2 flex-shrink-0"
              style={{ color: theme.primary }}
            />
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Analgesics">Analgesics</SelectItem>
            <SelectItem value="Antibiotics">Antibiotics</SelectItem>
            <SelectItem value="Vitamins">Vitamins</SelectItem>
            <SelectItem value="Respiratory">Respiratory</SelectItem>
            <SelectItem value="Digestive">Digestive</SelectItem>
            <SelectItem value="Antihistamines">Antihistamines</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
