import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { User, Lock, Store, BriefcaseMedical } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/auth/register')({
  component: RegisterComponent,
})

function RegisterComponent() {
  const [role, setRole] = useState<
    'cashier' | 'owner' | 'medical_practitioner'
  >('cashier')
  const navigate = useNavigate()

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement actual register logic later
    navigate({ to: '/auth/login' })
  }

  return (
    <div className="flex flex-col items-center w-full space-y-6">
      {/* Brand Section - smaller on register to save space */}
      <div className="flex flex-col items-center space-y-2 pt-4">
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-8 h-8 text-primary"
          >
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
          </svg>
        </div>
        <div className="text-center">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            Request Access
          </h1>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="w-full bg-white rounded-4xl shadow-xl shadow-slate-200/50 p-6 sm:p-8 border border-slate-50 relative overflow-hidden">
        <form onSubmit={handleRegister} className="space-y-5 relative z-10">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Input
                className="h-11 bg-slate-50 border-slate-200 focus:border-primary/50 focus:ring-primary/20 rounded-xl"
                placeholder="First Name"
              />
            </div>
            <div className="space-y-1">
              <Input
                className="h-11 bg-slate-50 border-slate-200 focus:border-primary/50 focus:ring-primary/20 rounded-xl"
                placeholder="Last Name"
              />
            </div>
          </div>

          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
              <User size={18} strokeWidth={2.5} />
            </div>
            <Input
              className="pl-10 h-11 bg-slate-50 border-slate-200 focus:border-primary/50 focus:ring-primary/20 rounded-xl"
              placeholder="Desried Username"
            />
          </div>

          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
              <Lock size={18} strokeWidth={2.5} />
            </div>
            <Input
              type="password"
              className="pl-10 h-11 bg-slate-50 border-slate-200 focus:border-primary/50 focus:ring-primary/20 rounded-xl"
              placeholder="Password"
            />
          </div>

          {/* Role Selection Buttons */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase ml-1">
              Requested Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('cashier')}
                className={cn(
                  'flex items-center justify-center p-2 rounded-xl border transition-all duration-200 gap-2',
                  role === 'cashier'
                    ? 'bg-primary text-white border-primary shadow-md'
                    : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50',
                )}
              >
                <Store size={16} strokeWidth={2} />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Cashier
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRole('owner')}
                className={cn(
                  'flex items-center justify-center p-2 rounded-xl border transition-all duration-200 gap-2',
                  role === 'owner'
                    ? 'bg-primary text-white border-primary shadow-md'
                    : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50',
                )}
              >
                <BriefcaseMedical size={16} strokeWidth={2} />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Owner
                </span>
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 rounded-xl text-md font-bold text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all active:scale-[0.98]"
          >
            SUBMIT REQUEST
          </Button>
        </form>
      </div>

      <div className="pb-4">
        <p className="text-xs text-slate-400 font-medium">
          Already have an account?{' '}
          <Link to="/auth/login" className="text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
