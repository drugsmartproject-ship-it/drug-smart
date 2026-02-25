import {
  createFileRoute,
  Link,
  Outlet,
  useLocation,
} from '@tanstack/react-router'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Activity,
  Pill,
  Search,
  Bell,
  HeartPulse,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { useTheme } from '@/lib/theme-context'

export const Route = createFileRoute('/app')({
  component: AppLayout,
})

function AppLayout() {
  const location = useLocation()
  const { theme } = useTheme()

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/app' },
    { name: 'Inventory', icon: Package, path: '/app/inventory' },
    { name: 'Sales', icon: ShoppingCart, path: '/app/sales' },
    { name: 'Patients', icon: HeartPulse, path: '/app/patients' },
    { name: 'Intelligence', icon: Activity, path: '/app/intelligence' },
    { name: 'Users', icon: Users, path: '/app/users' },
    { name: 'Settings', icon: Settings, path: '/app/settings' },
  ]

  return (
    <div
      className="flex min-h-screen w-full relative overflow-hidden font-sans"
      style={{
        background: `linear-gradient(160deg, color-mix(in srgb, ${theme.primary} 3%, #f8fafc) 0%, #f8fafc 50%, color-mix(in srgb, ${theme.accent} 3%, #f8fafc) 100%)`,
      }}
    >
      {/* Ambient Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full blur-[140px] opacity-40"
          style={{
            background: `radial-gradient(circle, color-mix(in srgb, ${theme.primary} 12%, transparent), transparent 70%)`,
          }}
        />
        <div
          className="absolute top-[40%] -right-[10%] w-[60%] h-[60%] rounded-full blur-[120px] opacity-30"
          style={{
            background: `radial-gradient(circle, color-mix(in srgb, ${theme.accent} 10%, transparent), transparent 70%)`,
          }}
        />
        <div
          className="absolute bottom-0 left-1/2 w-[40%] h-[30%] rounded-full blur-[100px] opacity-20"
          style={{
            background: `radial-gradient(circle, color-mix(in srgb, ${theme.primary} 8%, transparent), transparent 70%)`,
          }}
        />
      </div>

      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex w-72 flex-col fixed inset-y-0 z-50 m-4 rounded-3xl bg-white/85 backdrop-blur-2xl border shadow-2xl"
        style={{
          borderColor: `color-mix(in srgb, ${theme.primary} 12%, #e2e8f0)`,
          boxShadow: `0 24px 64px -12px color-mix(in srgb, ${theme.primary} 10%, rgba(0,0,0,0.08))`,
        }}
      >
        {/* Logo */}
        <div className="flex h-20 items-center px-7">
          <div className="flex items-center gap-3">
            <div
              className="p-2.5 rounded-2xl shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
                boxShadow: `0 8px 20px color-mix(in srgb, ${theme.primary} 35%, transparent)`,
              }}
            >
              <Pill className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight text-slate-800 block leading-none">
                DrugSmart
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Pharmacy OS
              </span>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="px-5 pb-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Quick search..."
              className="w-full h-10 pl-9 pr-4 rounded-xl text-sm outline-none transition-all"
              style={{
                background: `color-mix(in srgb, ${theme.primary} 5%, #f8fafc)`,
                border: `1.5px solid color-mix(in srgb, ${theme.primary} 15%, #e2e8f0)`,
                color: '#334155',
              }}
              onFocus={(e) => {
                e.currentTarget.style.border = `1.5px solid ${theme.primary}`
                e.currentTarget.style.boxShadow = `0 0 0 3px color-mix(in srgb, ${theme.primary} 12%, transparent)`
                e.currentTarget.style.background = 'white'
              }}
              onBlur={(e) => {
                e.currentTarget.style.border = `1.5px solid color-mix(in srgb, ${theme.primary} 15%, #e2e8f0)`
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.background = `color-mix(in srgb, ${theme.primary} 5%, #f8fafc)`
              }}
            />
          </div>
        </div>

        {/* Navigation Label */}
        <div className="px-6 py-1">
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.15em]">
            Navigation
          </span>
        </div>

        {/* Nav Items */}
        <div className="flex-1 overflow-y-auto py-2 px-4">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path !== '/app' &&
                  location.pathname.startsWith(item.path))
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 group relative overflow-hidden',
                    isActive
                      ? 'text-white'
                      : 'text-slate-500 hover:text-slate-800',
                  )}
                  style={
                    isActive
                      ? {
                          background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
                          boxShadow: `0 6px 20px color-mix(in srgb, ${theme.primary} 30%, transparent)`,
                        }
                      : {}
                  }
                >
                  {/* Hover fill for inactive */}
                  {!isActive && (
                    <span
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl"
                      style={{
                        background: `color-mix(in srgb, ${theme.primary} 6%, transparent)`,
                      }}
                    />
                  )}

                  <item.icon
                    className={cn(
                      'h-5 w-5 relative z-10 flex-shrink-0',
                      isActive ? 'text-white' : 'text-slate-400',
                    )}
                    style={!isActive ? { transition: `color 0.2s` } : {}}
                  />
                  <span className="relative z-10">{item.name}</span>

                  {/* Active dot indicator */}
                  {isActive && (
                    <span className="ml-auto relative z-10 h-1.5 w-1.5 rounded-full bg-white/60" />
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* User Profile Card */}
        <div className="p-4 mt-auto">
          <div
            className="p-4 rounded-2xl text-white relative overflow-hidden group cursor-pointer"
            style={{
              background: `linear-gradient(135deg, #0f172a 0%, #1e293b 100%)`,
              boxShadow: '0 8px 24px rgba(15,23,42,0.15)',
            }}
          >
            {/* Accent orb overlay */}
            <div
              className="absolute top-0 right-0 w-28 h-28 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500 blur-xl"
              style={{
                background: `radial-gradient(circle, ${theme.accent}, transparent)`,
              }}
            />
            <div
              className="absolute -bottom-4 left-4 w-20 h-20 rounded-full opacity-10 blur-xl"
              style={{
                background: `radial-gradient(circle, ${theme.primary}, transparent)`,
              }}
            />

            <div className="flex items-center gap-3 relative z-10 mb-3">
              <Avatar className="h-10 w-10 border-2 border-white/15 ring-2 ring-white/10">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback
                  className="font-bold"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
                  }}
                >
                  DK
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">
                  Dr. Kwame
                </p>
                <p
                  className="text-[10px] uppercase tracking-widest font-semibold"
                  style={{ color: theme.accent }}
                >
                  Owner Access
                </p>
              </div>
              <Bell className="h-4 w-4 text-white/30 hover:text-white/70 transition-colors cursor-pointer" />
            </div>

            <Button
              variant="secondary"
              size="sm"
              className="w-full h-8 text-xs bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-md font-semibold"
            >
              <LogOut className="h-3 w-3 mr-2" /> Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-[19rem] min-h-screen flex flex-col pb-20 md:pb-0 relative z-10">
        {/* Mobile Header */}
        <header
          className="md:hidden flex h-16 items-center justify-between px-4 backdrop-blur-md border-b sticky top-0 z-40"
          style={{
            background: 'rgba(248,250,252,0.85)',
            borderColor: `color-mix(in srgb, ${theme.primary} 10%, #e2e8f0)`,
          }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="p-1.5 rounded-xl shadow-sm"
              style={{
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
              }}
            >
              <Pill className="h-5 w-5 text-white" />
            </div>
            <span className="font-black text-lg tracking-tight text-slate-800">
              DrugSmart
            </span>
          </div>
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>DK</AvatarFallback>
          </Avatar>
        </header>

        <div className="flex-1 p-4 md:p-8 max-w-[1600px] w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav
        className="md:hidden fixed bottom-4 left-4 right-4 backdrop-blur-xl text-white rounded-2xl z-50 px-6 py-3 flex justify-between items-center shadow-2xl"
        style={{
          background: `linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95))`,
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {navItems.slice(0, 5).map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== '/app' && location.pathname.startsWith(item.path))
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center gap-1 transition-all duration-300 relative"
              style={{
                color: isActive ? theme.primary : 'rgba(148, 163, 184, 1)',
              }}
            >
              {isActive && (
                <div
                  className="absolute -top-10 w-1 h-1 rounded-full shadow-lg"
                  style={{
                    background: theme.primary,
                    boxShadow: `0 0 10px 2px color-mix(in srgb, ${theme.primary} 50%, transparent)`,
                  }}
                />
              )}
              <div
                className={cn(
                  'p-2 rounded-full transition-all',
                  isActive ? 'scale-110' : 'bg-transparent',
                )}
                style={
                  isActive
                    ? {
                        background: `color-mix(in srgb, ${theme.primary} 15%, transparent)`,
                      }
                    : {}
                }
              >
                <item.icon className="h-5 w-5" />
              </div>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
