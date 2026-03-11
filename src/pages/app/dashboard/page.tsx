import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useAuth } from "@/features/auth/AuthContext";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
  title, value, subtitle, icon: Icon, iconBg, trend, loading,
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ElementType;
  iconBg: string;
  trend?: { value: string; positive: boolean };
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="stat-card space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-3 w-28" />
          </div>
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="stat-card group">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">{title}</p>
          <p className="text-xl sm:text-2xl font-bold text-foreground tracking-tight mb-0.5">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          {trend && (
            <div className={`inline-flex items-center gap-1 text-xs font-semibold mt-1.5 ${trend.positive ? "text-emerald-600" : "text-red-500"}`}>
              <TrendingUp className={`w-3 h-3 ${trend.positive ? "" : "rotate-180"}`} />
              {trend.value}
            </div>
          )}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${iconBg}`}>
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

  const isLoading = dailySummary === undefined || invStats === undefined;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            {greeting}, {user?.name?.split(" ")[0]}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            <span className="font-medium text-foreground">{pharmacy?.displayName ?? pharmacy?.name}</span>
            {" · "}
            {formatDate(new Date())}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
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
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-card border-l-4 border-l-amber-400 border border-border shadow-sm">
              <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  {lowStockItems?.length} item{(lowStockItems?.length ?? 0) !== 1 ? "s" : ""} low on stock
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">At or below reorder level</p>
              </div>
              <Button variant="outline" size="sm" asChild className="shrink-0 text-xs h-7">
                <Link to="/app/inventory?filter=low-stock">View</Link>
              </Button>
            </div>
          )}
          {(expiringSoon?.length ?? 0) > 0 && (
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-card border-l-4 border-l-red-400 border border-border shadow-sm">
              <div className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-950/60 flex items-center justify-center shrink-0">
                <Clock className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  {expiringSoon?.length} item{(expiringSoon?.length ?? 0) !== 1 ? "s" : ""} expiring within 60 days
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">Review and quarantine expired stock</p>
              </div>
              <Button variant="outline" size="sm" asChild className="shrink-0 text-xs h-7">
                <Link to="/app/inventory?filter=expiring">View</Link>
              </Button>
            </div>
          )}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          title="Today's Revenue"
          value={formatCurrency(dailySummary?.totalRevenue ?? 0)}
          subtitle={`${dailySummary?.transactionCount ?? 0} transaction${(dailySummary?.transactionCount ?? 0) !== 1 ? "s" : ""}`}
          icon={DollarSign}
          iconBg="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600"
          loading={isLoading}
        />
        <StatCard
          title="Gross Profit"
          value={formatCurrency(dailySummary?.grossProfit ?? 0)}
          subtitle="Today's estimate"
          icon={TrendingUp}
          iconBg="bg-blue-50 dark:bg-blue-950/50 text-blue-600"
          loading={isLoading}
        />
        <StatCard
          title="Total Stock Items"
          value={String(invStats?.totalItems ?? 0)}
          subtitle={`Value: ${formatCurrency(invStats?.totalValue ?? 0)}`}
          icon={Package}
          iconBg="bg-violet-50 dark:bg-violet-950/50 text-violet-600"
          loading={isLoading}
        />
        <StatCard
          title="Low / Out of Stock"
          value={`${invStats?.lowStock ?? 0} / ${invStats?.outOfStock ?? 0}`}
          subtitle="Need attention"
          icon={AlertTriangle}
          iconBg="bg-amber-50 dark:bg-amber-950/50 text-amber-600"
          loading={isLoading}
        />
      </div>

      {/* Charts + Top Items Row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Sales Trend Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-primary" />
                Sales Trend — Last 7 Days
              </CardTitle>
              <Button variant="ghost" size="sm" asChild className="text-xs text-muted-foreground hover:text-foreground h-7 px-2">
                <Link to="/app/analytics" className="flex items-center gap-1">
                  Full report
                  <ArrowRight className="w-3 h-3" />
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
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.12} />
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                    tickFormatter={(v: string) => {
                      const d = new Date(v);
                      return d.toLocaleDateString("en", { month: "short", day: "numeric" });
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                    tickFormatter={(v: number) => `₵${v}`}
                    axisLine={false}
                    tickLine={false}
                    width={45}
                  />
                  <Tooltip
                    formatter={(val: unknown) => [formatCurrency(val as number), "Revenue"]}
                    labelFormatter={(label: unknown) => formatDate(label as string)}
                    contentStyle={{
                      borderRadius: "10px",
                      border: "1px solid var(--color-border)",
                      backgroundColor: "var(--color-popover)",
                      color: "var(--color-popover-foreground)",
                      fontSize: 12,
                      boxShadow: "0 4px 12px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                    fill="url(#revenueGrad)"
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0, fill: "var(--color-primary)" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[180px] flex flex-col items-center justify-center text-muted-foreground">
                <Activity className="w-8 h-8 mb-2 opacity-20" />
                <p className="text-sm font-medium">No sales data yet</p>
                <p className="text-xs mt-1 text-muted-foreground/70">Process your first sale to see trends</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Selling Items */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Pill className="w-4 h-4 text-primary" />
              Top Sellers
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {topItems && topItems.length > 0 ? (
              <div className="space-y-2">
                {topItems.map((item, idx) => (
                  <div key={item.id} className="flex items-center gap-3 py-1.5">
                    <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground shrink-0 tabular-nums">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">{item.name}</p>
                      <p className="text-[10px] text-muted-foreground">{item.quantity} units</p>
                    </div>
                    <p className="text-xs font-bold text-foreground shrink-0 tabular-nums">{formatCurrency(item.revenue)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-32 flex flex-col items-center justify-center text-muted-foreground">
                <ShoppingCart className="w-6 h-6 mb-2 opacity-20" />
                <p className="text-xs font-medium">No sales yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Recent Transactions */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-primary" />
                Recent Transactions
              </CardTitle>
              <Button variant="ghost" size="sm" asChild className="text-xs text-muted-foreground hover:text-foreground h-7 px-2">
                <Link to="/app/sales" className="flex items-center gap-1">
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {recentSales === undefined ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
              </div>
            ) : recentSales.length > 0 ? (
              <div className="space-y-1">
                {recentSales.map((sale) => (
                  <div key={sale._id} className="flex items-center gap-3 py-2.5 border-b border-border/40 last:border-0">
                    <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center shrink-0">
                      <ShoppingCart className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground font-mono tracking-tight">{sale.receiptNumber}</p>
                      <p className="text-[10px] text-muted-foreground">{sale.cashierName} · {formatDateTime(sale.createdAt)}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-foreground tabular-nums">{formatCurrency(sale.total)}</p>
                      <Badge variant={sale.status === "completed" ? "success" : "danger"} className="text-[10px] px-1.5 py-0 h-4 mt-0.5">
                        {sale.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-32 flex flex-col items-center justify-center text-muted-foreground">
                <RefreshCw className="w-6 h-6 mb-2 opacity-20" />
                <p className="text-sm font-medium">No transactions today</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expiry Watch */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-500" />
                Expiry Watch
              </CardTitle>
              <Button variant="ghost" size="sm" asChild className="text-xs text-muted-foreground hover:text-foreground h-7 px-2">
                <Link to="/app/inventory" className="flex items-center gap-1">
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {expiringSoon === undefined ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
              </div>
            ) : expiringSoon && expiringSoon.length > 0 ? (
              <div className="space-y-1">
                {expiringSoon.slice(0, 5).map((item) => {
                  const days = daysUntilExpiry(item.expiryDate ?? "");
                  const isExpired = days <= 0;
                  const isCritical = days > 0 && days <= 30;
                  return (
                    <div key={item._id} className="flex items-center gap-3 py-2.5 border-b border-border/40 last:border-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isExpired ? "bg-red-100 dark:bg-red-950/50" : isCritical ? "bg-orange-100 dark:bg-orange-950/50" : "bg-amber-50 dark:bg-amber-950/50"}`}>
                        <Clock className={`w-3.5 h-3.5 ${isExpired ? "text-red-600" : isCritical ? "text-orange-600" : "text-amber-600"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">{item.name}</p>
                        <p className="text-[10px] text-muted-foreground">Qty: {item.quantity} {item.unit}</p>
                      </div>
                      <Badge
                        variant={isExpired ? "danger" : "warning"}
                        className="text-[10px] px-1.5 py-0 h-4 shrink-0 tabular-nums"
                      >
                        {isExpired ? "Expired" : `${days}d`}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-32 flex flex-col items-center justify-center text-muted-foreground">
                <Package className="w-6 h-6 mb-2 opacity-20" />
                <p className="text-sm font-medium">No expiring items</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <p className="section-label">Quick Actions</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { to: "/app/sales", icon: ShoppingCart, label: "Process Sale", iconBg: "bg-emerald-100 dark:bg-emerald-950/60", iconColor: "text-emerald-600 dark:text-emerald-400" },
            { to: "/app/inventory", icon: Package, label: "Add Drug", iconBg: "bg-blue-100 dark:bg-blue-950/60", iconColor: "text-blue-600 dark:text-blue-400" },
            { to: "/app/drug-intelligence", icon: Pill, label: "Drug Lookup", iconBg: "bg-violet-100 dark:bg-violet-950/60", iconColor: "text-violet-600 dark:text-violet-400" },
            { to: "/app/users", icon: Users, label: "Manage Staff", iconBg: "bg-amber-100 dark:bg-amber-950/60", iconColor: "text-amber-600 dark:text-amber-500" },
          ].map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="stat-card flex flex-col items-center gap-2.5 p-4 border-border/60 hover:border-border hover:shadow-sm transition-all duration-150"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.iconBg}`}>
                <action.icon className={`w-5 h-5 ${action.iconColor}`} />
              </div>
              <span className="text-xs font-semibold text-foreground">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
