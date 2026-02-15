import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { User, Lock, Store, BriefcaseMedical, Stethoscope } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/auth/login')({
  component: LoginComponent,
})

function LoginComponent() {
  const [role, setRole] = useState<
    'cashier' | 'owner' | 'medical_practitioner'
  >('cashier')
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    navigate({ to: '/' })
  }

  return (
    <div className="flex flex-col items-center w-full space-y-8">
      {/* Brand Section */}
      <div className="flex flex-col items-center space-y-4 pt-8">
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
          {/* Custom Caduceus-like Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-12 h-12 text-primary"
          >
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
          </svg>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            DrugSmart
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Pharmacy Management
          </p>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="w-full bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 p-8 border border-slate-50 relative overflow-hidden">
        {/* Subtle decorative elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-8 -mt-8 pointer-events-none" />

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <div className="text-center pb-2">
            <h2 className="text-lg font-bold text-slate-700 uppercase tracking-wider">
              Login
            </h2>
          </div>

          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                <User size={18} strokeWidth={2.5} />
              </div>
              <Input
                className="pl-10 h-12 bg-slate-50 border-slate-200 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all"
                placeholder="USERNAME"
              />
            </div>

            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                <Lock size={18} strokeWidth={2.5} />
              </div>
              <Input
                type="password"
                className="pl-10 h-12 bg-slate-50 border-slate-200 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all"
                placeholder="PASSWORD"
              />
            </div>

            <div className="flex justify-end">
              <Link
                to="."
                className="text-xs font-semibold text-slate-400 hover:text-primary transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          {/* Role Selection Buttons */}
          <div className="pt-2 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('cashier')}
                className={cn(
                  'flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200',
                  role === 'cashier'
                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-[1.02]'
                    : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200 hover:bg-slate-50',
                )}
              >
                <Store size={20} strokeWidth={2} className="mb-1" />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Cashier
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRole('owner')}
                className={cn(
                  'flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200',
                  role === 'owner'
                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-[1.02]'
                    : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200 hover:bg-slate-50',
                )}
              >
                <BriefcaseMedical size={20} strokeWidth={2} className="mb-1" />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Owner
                </span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setRole('medical_practitioner')}
              className={cn(
                'w-full flex items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-200',
                role === 'medical_practitioner'
                  ? 'bg-accent/10 border-accent text-accent shadow-sm'
                  : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50',
              )}
            >
              <Stethoscope size={18} strokeWidth={2} />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Licensed Medical Practitioner
              </span>
            </button>
          </div>

          <Button
            type="submit"
            className="w-full h-12 rounded-xl text-md font-bold text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all active:scale-[0.98]"
          >
            LOG IN
          </Button>
        </form>
      </div>

      <div className="pb-8">
        <p className="text-xs text-slate-400 font-medium">
          Don't have an account?{' '}
          <Link to="/auth/register" className="text-primary hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}
