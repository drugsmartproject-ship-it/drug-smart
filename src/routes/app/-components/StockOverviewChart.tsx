import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { BarChart3 } from 'lucide-react'

export function StockOverviewChart() {
  return (
    <Card className="col-span-4 shadow-lg shadow-slate-200/50 border-0 bg-white relative overflow-hidden h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-slate-800 tracking-tight">
              Stock Overview
            </CardTitle>
            <CardDescription>
              Inventory distribution by category.
            </CardDescription>
          </div>
          <div className="p-2 bg-slate-50 rounded-xl">
            <BarChart3 className="h-5 w-5 text-slate-400" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pl-2 relative z-10">
        <div className="h-[250px] w-full flex items-end justify-between gap-3 px-4 pt-8">
          {/* CSS Bar Chart Mock */}
          {[65, 40, 75, 50, 85, 30, 60].map((height, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-3 group w-full h-full justify-end"
            >
              <div className="w-full relative flex flex-col justify-end h-full">
                <div className="w-full bg-slate-100 rounded-lg absolute bottom-0 h-full" />
                <div
                  className="w-full bg-slate-800 rounded-lg relative group-hover:bg-primary transition-all duration-500 z-10 mx-auto"
                  style={{ height: `${height}%`, width: '80%' }}
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300 whitespace-nowrap shadow-xl z-20">
                    {height * 10} Units
                    <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
                  </div>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider truncate w-full text-center group-hover:text-primary transition-colors">
                {
                  [
                    'Analgesics',
                    'Antibiotics',
                    'Vitamins',
                    'Cardio',
                    'Diabetes',
                    'Topicals',
                    'Others',
                  ][i]
                }
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
