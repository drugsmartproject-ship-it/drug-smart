import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/auth')({
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden font-sans">
      {/* Abstract Background Design */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-[40%] -right-[10%] w-[60%] h-[60%] bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm z-10 p-4 animate-in fade-in zoom-in-95 duration-500">
        <Outlet />
      </div>
    </div>
  )
}
