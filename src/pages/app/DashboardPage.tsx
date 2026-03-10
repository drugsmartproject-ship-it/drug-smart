import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useAuth } from "@/features/auth/AuthContext";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate, formatDateTime, daysUntilExpiry } from "@/lib/utils";
import {
  TrendingUp, Package, ShoppingCart, AlertTriangle,
  Clock, ArrowRight, Plus, RefreshCw, Activity,
  DollarSign, BarChart2, Users, Pill,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

function StatCard({
  title, value, subtitle, icon: Icon, iconClass, trend,
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ElementType;
  iconClass: string;
  trend?: { value: string; positive: boolean };
}) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">{title}</p>
          <p className="text-2xl font-bold text-foreground mb-0.5">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          {trend && (
            <div className={`inline-flex items-center gap-1 text-xs font-medium mt-1 ${trend.positive ? "text-emerald-600" : "text-red-500"}`}>
              <TrendingUp className={`w-3 h-3 ${trend.positive ? "" : "rotate-180"}`} />
              {trend.value}
            </div>
          )}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconClass}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, pharmacy } = useAuth();
  const pharmacyId = user?.pharmacyId ?? "";

  const today = new Date().toISOString().split("T")[0] ?? "";

  const dailySummary = useQuery(api.sales.getDailySummary, { pharmacyId, date: today });
  const invStats = useQuery(api.inventory.getStats, { pharmacyId });
  const lowStockItems = useQuery(api.inventory.getLowStock, { pharmacyId });
  const expiringSoon = useQuery(api.inventory.getExpiringSoon, { pharmacyId, daysThreshold: 60 });
  const recentSales = useQuery(api.sales.list, { pharmacyId, limit: 5 });
  const salesTrend = useQuery(api.sales.getSalesTrend, { pharmacyId, days: 7 });
  const topItems = useQuery(api.sales.getTopSellingItems, { pharmacyId, limit: 5 });

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {greeting}, {user?.name?.split(" ")[0]}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {pharmacy?.name} · {formatDate(new Date())}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/app/inventory">
              <Package className="w-4 h-4" />
              Inventory
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/app/sales">
              <Plus className="w-4 h-4" />
              New Sale
            </Link>
          </Button>
        </div>
      </div>

      {/* Alert Banners */}
      {((lowStockItems?.length ?? 0) > 0 || (expiringSoon?.length ?? 0) > 0) && (
        <div className="grid sm:grid-cols-2 gap-3">
          {(lowStockItems?.length ?? 0) > 0 && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-amber-800">
                  {lowStockItems?.length} item{(lowStockItems?.length ?? 0) !== 1 ? "s" : ""} low on stock
                </p>
                <p className="text-xs text-amber-700 mt-0.5">Some drugs are at or below reorder level</p>
              </div>
              <Button variant="outline" size="sm" asChild className="shrink-0 border-amber-300 text-amber-700 hover:bg-amber-100">
                <Link to="/app/inventory?filter=low-stock">View</Link>
              </Button>
            </div>
          )}
          {(expiringSoon?.length ?? 0) > 0 && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
              <Clock className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-red-800">
                  {expiringSoon?.length} item{(expiringSoon?.length ?? 0) !== 1 ? "s" : ""} expiring within 60 days
                </p>
                <p className="text-xs text-red-700 mt-0.5">Review and remove expired stock</p>
              </div>
              <Button variant="outline" size="sm" asChild className="shrink-0 border-red-300 text-red-700 hover:bg-red-100">
                <Link to="/app/inventory?filter=expiring">View</Link>
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Revenue"
          value={formatCurrency(dailySummary?.totalRevenue ?? 0)}
          subtitle={`${dailySummary?.transactionCount ?? 0} transactions`}
          icon={DollarSign}
          iconClass="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Gross Profit"
          value={formatCurrency(dailySummary?.grossProfit ?? 0)}
          subtitle="Today's estimate"
          icon={TrendingUp}
          iconClass="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Total Stock Items"
          value={String(invStats?.totalItems ?? 0)}
          subtitle={`Value: ${formatCurrency(invStats?.totalValue ?? 0)}`}
          icon={Package}
          iconClass="bg-violet-50 text-violet-600"
        />
        <StatCard
          title="Low / Out of Stock"
          value={`${invStats?.lowStock ?? 0} / ${invStats?.outOfStock ?? 0}`}
          subtitle="Need attention"
          icon={AlertTriangle}
          iconClass="bg-amber-50 text-amber-600"
        />
      </div>

      {/* Charts + Recent Activity Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sales Trend Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-primary" />
                Sales Trend — Last 7 Days
              </CardTitle>
              <Button variant="ghost" size="icon-sm" asChild>
                <Link to="/app/analytics">
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {salesTrend && salesTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={salesTrend} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1FA67A" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#1FA67A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "#9CA3AF" }}
                    tickFormatter={(v: string) => {
                      const d = new Date(v);
                      return d.toLocaleDateString("en", { month: "short", day: "numeric" });
                    }}
                  />
                  <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} tickFormatter={(v: number) => `₵${v}`} />
                  <Tooltip
                    formatter={(val: unknown) => [formatCurrency(val as number), "Revenue"]}
                    labelFormatter={(label: unknown) => formatDate(label as string)}
                    contentStyle={{ borderRadius: "8px", border: "1px solid #E5E9ED", fontSize: 12 }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#1FA67A" strokeWidth={2} fill="url(#revenueGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[180px] flex flex-col items-center justify-center text-muted-foreground">
                <Activity className="w-8 h-8 mb-2 opacity-30" />
                <p className="text-sm">No sales data yet</p>
                <p className="text-xs mt-1">Process your first sale to see trends</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Selling Items */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Pill className="w-4 h-4 text-primary" />
              Top Selling Items
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {topItems && topItems.length > 0 ? (
              <div className="space-y-2.5">
                {topItems.map((item, idx) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{item.name}</p>
                      <p className="text-[10px] text-muted-foreground">{item.quantity} units sold</p>
                    </div>
                    <p className="text-xs font-semibold text-foreground shrink-0">{formatCurrency(item.revenue)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-32 flex flex-col items-center justify-center text-muted-foreground">
                <ShoppingCart className="w-6 h-6 mb-2 opacity-30" />
                <p className="text-xs">No sales data yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-primary" />
                Recent Transactions
              </CardTitle>
              <Button variant="ghost" size="sm" asChild className="text-xs text-primary">
                <Link to="/app/sales">View all <ArrowRight className="w-3 h-3 ml-1" /></Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {recentSales && recentSales.length > 0 ? (
              <div className="space-y-2">
                {recentSales.map((sale) => (
                  <div key={sale._id} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <ShoppingCart className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground font-mono">{sale.receiptNumber}</p>
                      <p className="text-[10px] text-muted-foreground">{sale.cashierName} · {formatDateTime(sale.createdAt)}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-foreground">{formatCurrency(sale.total)}</p>
                      <Badge variant={sale.status === "completed" ? "success" : "danger"} className="text-[10px] px-1.5 py-0 mt-0.5">
                        {sale.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-32 flex flex-col items-center justify-center text-muted-foreground">
                <RefreshCw className="w-6 h-6 mb-2 opacity-30" />
                <p className="text-xs">No transactions yet today</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expiry Watch */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-500" />
                Expiry Watch
              </CardTitle>
              <Button variant="ghost" size="sm" asChild className="text-xs text-primary">
                <Link to="/app/inventory">View all <ArrowRight className="w-3 h-3 ml-1" /></Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {expiringSoon && expiringSoon.length > 0 ? (
              <div className="space-y-2">
                {expiringSoon.slice(0, 5).map((item) => {
                  const days = daysUntilExpiry(item.expiryDate ?? "");
                  const isExpired = days <= 0;
                  const isCritical = days > 0 && days <= 30;
                  return (
                    <div key={item._id} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isExpired ? "bg-red-100" : isCritical ? "bg-orange-100" : "bg-amber-50"}`}>
                        <Clock className={`w-3.5 h-3.5 ${isExpired ? "text-red-600" : isCritical ? "text-orange-600" : "text-amber-600"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">{item.name}</p>
                        <p className="text-[10px] text-muted-foreground">Qty: {item.quantity} {item.unit}</p>
                      </div>
                      <Badge variant={isExpired ? "danger" : isCritical ? "warning" : "warning"} className="text-[10px] px-1.5 py-0 shrink-0">
                        {isExpired ? "Expired" : `${days}d left`}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-32 flex flex-col items-center justify-center text-muted-foreground">
                <Package className="w-6 h-6 mb-2 opacity-30" />
                <p className="text-xs">No expiring items found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Quick Actions</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { to: "/app/sales", icon: ShoppingCart, label: "Process Sale", color: "text-emerald-600 bg-emerald-50 hover:bg-emerald-100" },
            { to: "/app/inventory", icon: Package, label: "Add Drug", color: "text-blue-600 bg-blue-50 hover:bg-blue-100" },
            { to: "/app/drug-intelligence", icon: Pill, label: "Drug Lookup", color: "text-violet-600 bg-violet-50 hover:bg-violet-100" },
            { to: "/app/users", icon: Users, label: "Manage Staff", color: "text-amber-600 bg-amber-50 hover:bg-amber-100" },
          ].map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border border-transparent transition-all duration-150 ${action.color}`}
            >
              <action.icon className="w-6 h-6" />
              <span className="text-xs font-medium">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
