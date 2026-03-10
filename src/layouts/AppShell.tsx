import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  Pill, LayoutDashboard, Package, ShoppingCart, Brain,
  Stethoscope, BarChart3, Users, Settings, LogOut,
  Menu, X, ChevronDown, Bell, Building2, Activity,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  permission?: keyof typeof PERMISSIONS;
  badge?: string;
}

function getNavItems(role: UserRole): NavItem[] {
  const all: NavItem[] = [
    { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/app/inventory", label: "Inventory", icon: Package, permission: "canViewInventory" },
    { href: "/app/sales", label: "Sales", icon: ShoppingCart, permission: "canProcessSales" },
    { href: "/app/drug-intelligence", label: "Drug Intelligence", icon: Brain, permission: "canAccessDrugIntel" },
    { href: "/app/clinical-support", label: "Clinical Support", icon: Stethoscope, permission: "canAccessDrugIntel" },
    { href: "/app/analytics", label: "Analytics", icon: BarChart3, permission: "canAccessAnalytics" },
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
  admin: "bg-teal-50 text-teal-700",
  cashier: "bg-blue-50 text-blue-700",
  pharmacist: "bg-emerald-50 text-emerald-700",
  inventory_manager: "bg-amber-50 text-amber-700",
};

function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  const { user, pharmacy, logout } = useAuth();
  const { logoUrl } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const navItems = user ? getNavItems(user.role) : [];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-brand-green)] to-[var(--color-brand-teal)] flex items-center justify-center shadow-sm shrink-0 overflow-hidden">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
          ) : (
            <Pill className="w-4 h-4 text-white" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-foreground truncate">DrugSmart</p>
          <p className="text-xs text-muted-foreground truncate">{pharmacy?.displayName ?? pharmacy?.name}</p>
        </div>
      </div>

      {/* Workspace Badge */}
      <div className="px-3 py-2">
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-muted/50 text-xs text-muted-foreground">
          <Building2 className="w-3 h-3 shrink-0" />
          <span className="truncate font-mono text-[11px]">{pharmacy?.pharmacyId}</span>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-1">
        <nav className="space-y-0.5">
          {navItems.map((item, i) => {
            const isActive =
              location.pathname === item.href ||
              (item.href !== "/app/dashboard" && location.pathname.startsWith(item.href));
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.035, duration: 0.15, ease: "easeOut" }}
              >
                <Link
                  to={item.href}
                  onClick={onNavClick}
                  className={cn(
                    "nav-item group relative",
                    isActive ? "nav-item-active" : "nav-item-inactive"
                  )}
                >
                  <item.icon className="w-4 h-4 shrink-0 transition-transform duration-150 group-hover:scale-110" />
                  <span className="flex-1 min-w-0 truncate">{item.label}</span>
                  {item.badge && (
                    <Badge variant="danger" className="text-[10px] px-1.5 py-0">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>
      </ScrollArea>

      {/* System status */}
      <div className="px-3 py-2">
        <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground">
          <Activity className="w-3 h-3 text-emerald-500" />
          <span>System operational</span>
          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>

      <Separator />

      {/* User section */}
      <div className="p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-colors group">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                  {initials(user?.name ?? "U")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs font-semibold text-foreground truncate">{user?.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="w-52">
            <DropdownMenuLabel className="pb-1">
              <p className="font-semibold">{user?.name}</p>
              <p className="text-xs font-normal text-muted-foreground">{user?.email}</p>
              <div className={cn(
                "inline-flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded mt-1",
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
  const { user } = useAuth();
  const { loadForPharmacy } = useTheme();

  // Load pharmacy-specific theme when user is available
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-14 border-b border-border bg-card flex items-center px-4 gap-3 shrink-0">
          <button
            className="lg:hidden p-1.5 rounded-lg hover:bg-muted transition-colors active:scale-95"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5 text-muted-foreground" />
          </button>

          <div className="flex-1 min-w-0" />

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            <button className="relative p-1.5 rounded-lg hover:bg-muted transition-colors group">
              <Bell className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500" />
            </button>

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
