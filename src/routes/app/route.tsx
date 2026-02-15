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
  Menu,
  User as UserIcon,
  Activity,
  Pill,
  Search,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/app')({
  component: AppLayout,
})

function AppLayout() {
  const location = useLocation()

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/app' },
    { name: 'Inventory', icon: Package, path: '/app/inventory' },
    { name: 'Sales', icon: ShoppingCart, path: '/app/sales' },
    { name: 'Intelligence', icon: Activity, path: '/app/intelligence' },
    { name: 'Users', icon: Users, path: '/app/users' },
    { name: 'Settings', icon: Settings, path: '/app/settings' },
  ]

  return (
    <div className="flex min-h-screen w-full bg-slate-50 relative overflow-hidden font-sans">
      {/* Ambient Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[60%] h-[60%] bg-accent/5 rounded-full blur-[100px]" />
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 flex-col fixed inset-y-0 z-50 m-4 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl shadow-slate-200/50">
        <div className="flex h-20 items-center px-8">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-xl shadow-lg shadow-primary/20">
              <Pill className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight text-slate-800 block leading-none">
                DrugSmart
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Pharmacy OS
              </span>
            </div>
          </div>
        </div>

        <div className="px-6 py-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full h-10 pl-9 pr-4 rounded-xl bg-slate-50/50 border-transparent focus:bg-white focus:border-slate-200 focus:ring-2 focus:ring-primary/10 transition-all text-sm outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4">
          <nav className="space-y-1.5">
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
                    'flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 group relative overflow-hidden',
                    isActive
                      ? 'text-white shadow-lg shadow-primary/25'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900',
                  )}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent z-0" />
                  )}
                  <item.icon
                    className={cn(
                      'h-5 w-5 relative z-10 transition-colors',
                      isActive
                        ? 'text-white'
                        : 'text-slate-400 group-hover:text-primary',
                    )}
                  />
                  <span className="relative z-10">{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="p-4 mt-auto">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden group cursor-pointer shadow-xl shadow-slate-900/10">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <Activity className="h-16 w-16" />
            </div>

            <div className="flex items-center gap-3 relative z-10 mb-3">
              <Avatar className="h-10 w-10 border-2 border-white/10 ring-2 ring-white/5">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">
                  Dr. Kwame
                </p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Owner Access
                </p>
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              className="w-full h-8 text-xs bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-md"
            >
              <LogOut className="h-3 w-3 mr-2" /> Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-[20rem] min-h-screen flex flex-col pb-20 md:pb-0 relative z-10">
        {/* Mobile Header */}
        <header className="md:hidden flex h-16 items-center justify-between px-4 bg-white/80 backdrop-blur-md border-b sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-primary to-accent p-1.5 rounded-lg">
              <Pill className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-800">
              DrugSmart
            </span>
          </div>
          <Button variant="ghost" size="icon">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Button>
        </header>

        <div className="flex-1 p-4 md:p-8 max-w-[1600px] w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-xl text-white rounded-2xl z-50 px-6 py-3 flex justify-between items-center shadow-2xl shadow-slate-900/20 ring-1 ring-white/10">
        {navItems.slice(0, 5).map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== '/app' && location.pathname.startsWith(item.path))
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center gap-1 transition-all duration-300 relative',
                isActive ? 'text-primary' : 'text-slate-400',
              )}
            >
              {isActive && (
                <div className="absolute -top-10 w-1 h-1 bg-primary rounded-full shadow-[0_0_10px_2px_rgba(31,166,122,0.5)]" />
              )}
              <div
                className={cn(
                  'p-2 rounded-full transition-all',
                  isActive
                    ? 'bg-white/10 text-primary scale-110'
                    : 'bg-transparent hover:bg-white/5',
                )}
              >
                <item.icon
                  className={cn('h-5 w-5', isActive && 'fill-current')}
                />
              </div>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
