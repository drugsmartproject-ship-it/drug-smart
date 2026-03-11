import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useAuth } from "@/features/auth/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { TrendingUp, BarChart3, Package, DollarSign, Activity } from "lucide-react";

const DAYS_OPTIONS = [7, 14, 30];
const CHART_COLORS = ["#1FA67A", "#2FB9B3", "#6366F1", "#F59E0B", "#EF4444", "#8B5CF6"];

export default function AnalyticsPage() {
  const { user } = useAuth();
  const pharmacyId = user?.pharmacyId ?? "";
  const [days, setDays] = useState(7);

  const salesTrend = useQuery(api.sales.getSalesTrend, { pharmacyId, days });
  const topItems = useQuery(api.sales.getTopSellingItems, { pharmacyId, limit: 8 });
  const invStats = useQuery(api.inventory.getStats, { pharmacyId });
  const todayStr = new Date().toISOString().split("T")[0] ?? "";
  const dailySummary = useQuery(api.sales.getDailySummary, { pharmacyId, date: todayStr });

  const totalRevenue = (salesTrend ?? []).reduce((s, d) => s + d.revenue, 0);
  const totalTransactions = (salesTrend ?? []).reduce((s, d) => s + d.transactions, 0);
  const avgOrderValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

  // Category distribution from top items (simplified)
  const categoryData = (topItems ?? []).slice(0, 6).map((item, idx) => ({
    name: item.name.length > 15 ? item.name.slice(0, 15) + "…" : item.name,
    value: item.revenue,
    color: CHART_COLORS[idx % CHART_COLORS.length],
  }));

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" />
            Analytics & Trends
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Business performance insights for your pharmacy</p>
        </div>
        <div className="flex items-center gap-2">
          {DAYS_OPTIONS.map((d) => (
            <Button
              key={d}
              variant={days === d ? "default" : "outline"}
              size="sm"
              onClick={() => setDays(d)}
            >
              {d}d
            </Button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: `Revenue (${days}d)`, value: formatCurrency(totalRevenue), icon: DollarSign, color: "bg-emerald-50 text-emerald-600" },
          { title: `Transactions (${days}d)`, value: String(totalTransactions), icon: Activity, color: "bg-blue-50 text-blue-600" },
          { title: "Avg Order Value", value: formatCurrency(avgOrderValue), icon: TrendingUp, color: "bg-violet-50 text-violet-600" },
          { title: "Today's Revenue", value: formatCurrency(dailySummary?.totalRevenue ?? 0), icon: DollarSign, color: "bg-amber-50 text-amber-600" },
        ].map((card) => (
          <div key={card.title} className="stat-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-foreground">{card.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Revenue Trend */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Revenue Trend — Last {days} Days
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {(salesTrend ?? []).length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={salesTrend} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="analyticsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1FA67A" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#1FA67A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9CA3AF" }}
                    tickFormatter={(v: string) => new Date(v).toLocaleDateString("en", { month: "short", day: "numeric" })} />
                  <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} tickFormatter={(v: number) => `₵${v}`} />
                  <Tooltip
                    formatter={(val: unknown) => [formatCurrency(val as number), "Revenue"]}
                    labelFormatter={(label: unknown) => new Date(label as string).toLocaleDateString("en-GH", { weekday: "short", month: "short", day: "numeric" })}
                    contentStyle={{ borderRadius: "8px", border: "1px solid #E5E9ED", fontSize: 12 }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#1FA67A" strokeWidth={2.5} fill="url(#analyticsGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-muted-foreground">
                <p className="text-sm">No sales data for this period</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Revenue by Drug (Pie) */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" />
              Revenue by Product
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {categoryData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                      dataKey="value" paddingAngle={2}>
                      {categoryData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val: unknown) => formatCurrency(val as number)} contentStyle={{ borderRadius: "8px", border: "1px solid #E5E9ED", fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1.5 mt-2">
                  {categoryData.map((d) => (
                    <div key={d.name} className="flex items-center gap-2 text-xs">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                      <span className="flex-1 truncate text-muted-foreground">{d.name}</span>
                      <span className="font-medium">{formatCurrency(d.value)}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-muted-foreground">
                <p className="text-sm">No sales data</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Transaction Volume Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              Daily Transaction Volume
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {(salesTrend ?? []).length > 0 ? (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={salesTrend} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9CA3AF" }}
                    tickFormatter={(v: string) => new Date(v).toLocaleDateString("en", { month: "short", day: "numeric" })} />
                  <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} />
                  <Tooltip labelFormatter={(label: unknown) => new Date(label as string).toLocaleDateString("en-GH", { weekday: "short", month: "short", day: "numeric" })}
                    contentStyle={{ borderRadius: "8px", border: "1px solid #E5E9ED", fontSize: 12 }} />
                  <Bar dataKey="transactions" fill="#2FB9B3" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[180px] flex items-center justify-center text-muted-foreground">
                <p className="text-sm">No data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Selling Items */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" />
              Top Selling Drugs (All Time)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {(topItems ?? []).length > 0 ? (
              <div className="space-y-2">
                {(topItems ?? []).slice(0, 6).map((item, idx) => {
                  const maxRevenue = topItems?.[0]?.revenue ?? 1;
                  const pct = (item.revenue / maxRevenue) * 100;
                  return (
                    <div key={item.id}>
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xs font-bold text-muted-foreground w-4 shrink-0">{idx + 1}</span>
                          <span className="text-xs font-medium truncate">{item.name}</span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-bold">{formatCurrency(item.revenue)}</span>
                          <Badge variant="secondary" className="ml-1.5 text-[10px] px-1.5 py-0">{item.quantity} sold</Badge>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-[180px] flex items-center justify-center text-muted-foreground">
                <p className="text-sm">No sales data yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Inventory Snapshot */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Package className="w-4 h-4 text-primary" />
            Inventory Health Snapshot
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: "Total Items", value: invStats?.totalItems ?? 0, color: "text-blue-600" },
              { label: "Stock Value", value: formatCurrency(invStats?.totalValue ?? 0), color: "text-emerald-600" },
              { label: "Low Stock", value: invStats?.lowStock ?? 0, color: "text-amber-600" },
              { label: "Out of Stock", value: invStats?.outOfStock ?? 0, color: "text-red-600" },
              { label: "Expiring ≤30d", value: invStats?.expiringSoon ?? 0, color: "text-orange-600" },
              { label: "Expired", value: invStats?.expired ?? 0, color: "text-red-700" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
