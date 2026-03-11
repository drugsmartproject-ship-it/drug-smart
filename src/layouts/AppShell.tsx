import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";
import { useTheme } from "@/features/theme/ThemeContext";
import { cn, initials } from "@/lib/utils";
import { PERMISSIONS, ROLE_LABELS, type UserRole } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Package, ShoppingCart, Brain,
  Stethoscope, BarChart3, Users, Settings, LogOut,
  Menu, X, ChevronDown, Bell, Building2, Activity,
  AlertTriangle, Clock, CheckCheck,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  permission?: keyof typeof PERMISSIONS;
  tourId?: string;
}

function getNavItems(role: UserRole): NavItem[] {
  const all: NavItem[] = [
    { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard, tourId: "tour-nav-dashboard" },
    { href: "/app/inventory", label: "Inventory", icon: Package, permission: "canViewInventory", tourId: "tour-nav-inventory" },
    { href: "/app/sales", label: "Sales", icon: ShoppingCart, permission: "canProcessSales", tourId: "tour-nav-sales" },
    { href: "/app/drug-intelligence", label: "Drug Intelligence", icon: Brain, permission: "canAccessDrugIntel", tourId: "tour-nav-drug-intel" },
    { href: "/app/clinical-support", label: "Clinical Support", icon: Stethoscope, permission: "canAccessDrugIntel" },
    { href: "/app/analytics", label: "Analytics", icon: BarChart3, permission: "canAccessAnalytics", tourId: "tour-nav-analytics" },
    { href: "/app/users", label: "User Management", icon: Users, permission: "canManageUsers" },
    { href: "/app/settings", label: "Settings", icon: Settings, permission: "canManageSettings" },
  ];
  return all.filter((item) => {
    if (!item.permission) return true;
    return PERMISSIONS[item.permission](role);
  });
}

const roleColorMap: Record<UserRole, string> = {
  owner: "bg-primary/10 text-primary",
  admin: "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300",
  cashier: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  pharmacist: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  inventory_manager: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
};

// Stable nav items — no entrance animation, just hover state
function NavLink({ item, isActive, onClick }: { item: NavItem; isActive: boolean; onClick?: () => void }) {
  return (
    <Link
      to={item.href}
      onClick={onClick}
      data-tour={item.tourId}
      className={cn(
        "nav-item group",
        isActive ? "nav-item-active" : "nav-item-inactive"
      )}
    >
      <item.icon className={cn("w-4 h-4 shrink-0 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
      <span className="flex-1 min-w-0 truncate text-sm font-medium">{item.label}</span>
      {isActive && (
        <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
      )}
    </Link>
  );
}

const NOTIFICATIONS = [
  {
    id: "1",
    type: "warning" as const,
    title: "Low Stock Alert",
    body: "Paracetamol 500mg is below reorder level",
    time: "2 min ago",
  },
  {
    id: "2",
    type: "danger" as const,
    title: "Expiry Warning",
    body: "3 items expiring within 30 days",
    time: "1 hr ago",
  },
  {
    id: "3",
    type: "info" as const,
    title: "Daily Summary",
    body: "15 transactions completed today",
    time: "Today",
  },
];

function notifIcon(type: "warning" | "danger" | "info") {
  if (type === "warning") return <AlertTriangle className="w-4 h-4 text-amber-500" />;
  if (type === "danger") return <Clock className="w-4 h-4 text-red-500" />;
  return <Activity className="w-4 h-4 text-blue-500" />;
}

function notifBg(type: "warning" | "danger" | "info") {
  if (type === "warning") return "bg-amber-50 dark:bg-amber-950/40";
  if (type === "danger") return "bg-red-50 dark:bg-red-950/40";
  return "bg-blue-50 dark:bg-blue-950/40";
}

function NotificationList({ onClose }: { onClose?: () => void }) {
  return (
    <>
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <p className="text-sm font-semibold text-foreground">Notifications</p>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1 text-xs text-primary hover:underline">
            <CheckCheck className="w-3 h-3" />
            Mark all read
          </button>
          {onClose && (
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted transition-colors">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>
      <div className="divide-y divide-border">
        {NOTIFICATIONS.map((n) => (
          <div key={n.id} className="flex items-start gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors cursor-pointer">
            <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5", notifBg(n.type))}>
              {notifIcon(n.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground">{n.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{n.body}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 py-3 border-t border-border">
        <Link to="/app/inventory" className="text-xs text-primary hover:underline w-full text-center block">
          View all alerts →
        </Link>
      </div>
    </>
  );
}

function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  const { user, pharmacy, logout } = useAuth();
  const { logoUrl, clearAppliedTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const navItems = user ? getNavItems(user.role) : [];

  const handleLogout = async () => {
    clearAppliedTheme();
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo / Brand */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-border">
        <div className="w-8 h-8 rounded-lg shrink-0 overflow-hidden shadow-sm">
          {logoUrl ? (
            <div className="w-full h-full bg-gradient-to-br from-[var(--color-brand-green)] to-[var(--color-brand-teal)] flex items-center justify-center">
              <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
            </div>
          ) : (
            <img src="/icon.svg" alt="DrugSmart" className="w-full h-full" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-foreground truncate leading-tight">DrugSmart</p>
          <p className="text-xs text-muted-foreground truncate leading-tight">{pharmacy?.displayName ?? pharmacy?.name}</p>
        </div>
      </div>

      {/* Workspace Badge */}
      <div className="px-3 pt-2 pb-1">
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-muted/60 border border-border/60">
          <Building2 className="w-3 h-3 text-muted-foreground shrink-0" />
          <span className="truncate font-mono text-[11px] text-muted-foreground">{pharmacy?.pharmacyId}</span>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-2">
        <nav className="space-y-0.5" data-tour="tour-nav">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.href ||
              (item.href !== "/app/dashboard" && location.pathname.startsWith(item.href));
            return (
              <NavLink key={item.href} item={item} isActive={isActive} onClick={onNavClick} />
            );
          })}
        </nav>
      </ScrollArea>

      {/* System status */}
      <div className="px-4 py-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <Activity className="w-3 h-3 shrink-0" />
          <span>All systems operational</span>
        </div>
      </div>

      <Separator />

      {/* User section */}
      <div className="p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button data-tour="tour-user-profile" className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-colors group">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                  {initials(user?.name ?? "U")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs font-semibold text-foreground truncate leading-tight">{user?.name}</p>
                <p className="text-[10px] text-muted-foreground truncate leading-tight">{user?.email}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="w-52">
            <DropdownMenuLabel className="pb-1">
              <p className="font-semibold text-sm">{user?.name}</p>
              <p className="text-xs font-normal text-muted-foreground">{user?.email}</p>
              <div className={cn(
                "inline-flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded mt-1.5",
                roleColorMap[user?.role ?? "cashier"]
              )}>
                {ROLE_LABELS[user?.role ?? "cashier"]}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/app/settings">
                <Settings className="w-4 h-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileNotifOpen, setMobileNotifOpen] = useState(false);
  const [desktopNotifOpen, setDesktopNotifOpen] = useState(false);
  const { user } = useAuth();
  const { loadForPharmacy } = useTheme();

  useEffect(() => {
    if (user?.pharmacyId) {
      loadForPharmacy(user.pharmacyId);
    }
  }, [user?.pharmacyId, loadForPharmacy]);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-60 border-r border-border bg-card flex-col shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              className="relative w-64 bg-card border-r border-border flex flex-col z-10 shadow-xl"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <button
                className="absolute top-4 right-3 p-1.5 rounded-lg hover:bg-muted transition-colors z-10"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-4 h-4" />
              </button>
              <SidebarContent onNavClick={() => setSidebarOpen(false)} />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Notification Panel — full-screen slide from right */}
      <AnimatePresence>
        {mobileNotifOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex justify-end">
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileNotifOpen(false)}
            />
            <motion.div
              className="relative w-full max-w-sm bg-card flex flex-col shadow-xl z-10 h-full"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <NotificationList onClose={() => setMobileNotifOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-14 border-b border-border bg-card/80 backdrop-blur-sm flex items-center px-4 gap-3 shrink-0">
          <button
            className="lg:hidden p-1.5 rounded-lg hover:bg-muted transition-colors active:scale-95"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5 text-muted-foreground" />
          </button>

          <div className="flex-1 min-w-0" />

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Mobile bell — triggers full-screen panel */}
            <button
              data-tour="tour-bell"
              className="lg:hidden relative p-1.5 rounded-lg hover:bg-muted transition-colors group"
              onClick={() => setMobileNotifOpen(true)}
            >
              <Bell className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500" />
            </button>

            {/* Desktop bell — Popover */}
            <Popover open={desktopNotifOpen} onOpenChange={setDesktopNotifOpen}>
              <PopoverTrigger asChild>
                <button data-tour="tour-bell" className="hidden lg:flex relative p-1.5 rounded-lg hover:bg-muted transition-colors group">
                  <Bell className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="p-0 w-80" sideOffset={8}>
                <NotificationList />
              </PopoverContent>
            </Popover>

            <div className="lg:hidden">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-semibold">
                  {initials(user?.name ?? "U")}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className={cn(
              "hidden sm:inline-flex items-center text-[10px] font-semibold px-2 py-1 rounded-full",
              roleColorMap[user?.role ?? "cashier"]
            )}>
              {ROLE_LABELS[user?.role ?? "cashier"]}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
