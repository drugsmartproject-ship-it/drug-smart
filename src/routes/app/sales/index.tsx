import { createFileRoute } from '@tanstack/react-router'
import { NewSaleButton } from './-components/NewSaleButton'
import { SalesStats } from './-components/SalesStats'
import { RecentTransactions } from './-components/RecentTransactionsTable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const Route = createFileRoute('/app/sales/')({
  component: SalesComponent,
})

function SalesComponent() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Sales & Point of Sale
          </h1>
          <p className="text-slate-500">
            Manage transactions and view sales reports.
          </p>
        </div>
        <div className="flex gap-2">
          <NewSaleButton />
        </div>
      </div>

      <SalesStats />

      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="bg-white/50 p-1 rounded-xl">
          <TabsTrigger
            value="transactions"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Recent Transactions
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Sales History
          </TabsTrigger>
          <TabsTrigger
            value="reports"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Reports
          </TabsTrigger>
        </TabsList>
        <TabsContent value="transactions" className="mt-6">
          <RecentTransactions />
        </TabsContent>
        <TabsContent value="history">
          <div className="p-8 text-center text-slate-400 bg-white/50 rounded-2xl border border-dashed border-slate-200 mt-6">
            History View Coming Soon
          </div>
        </TabsContent>
        <TabsContent value="reports">
          <div className="p-8 text-center text-slate-400 bg-white/50 rounded-2xl border border-dashed border-slate-200 mt-6">
            Advanced Reports Coming Soon
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
