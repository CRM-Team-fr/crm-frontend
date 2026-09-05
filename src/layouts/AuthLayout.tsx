import { Outlet } from 'react-router-dom'
import { Sparkles, ShieldCheck, TrendingUp } from 'lucide-react'

export const AuthLayout = () => {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-surface-50">
      {/* Left brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 gradient-brand text-white overflow-hidden">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-16 h-[28rem] w-[28rem] rounded-full bg-pink-400/20 blur-3xl" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/15 ring-1 ring-white/25 grid place-items-center">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight">CRM Studio</span>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="font-display text-4xl xl:text-5xl font-extrabold leading-tight">
            Run your wholesale business, beautifully.
          </h1>
          <p className="mt-4 text-white/85 text-lg leading-relaxed">
            Customers, quotations, orders, inventory and payments — all in one place. Built for the way you actually sell.
          </p>

          <ul className="mt-8 space-y-3 text-white/90">
            <li className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-white/80" />
              <span>Role-based access for admins, managers, sales &amp; customers</span>
            </li>
            <li className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-white/80" />
              <span>Real-time dashboards for revenue &amp; team performance</span>
            </li>
          </ul>
        </div>

        <div className="relative z-10 text-xs text-white/70">
          © {new Date().getFullYear()} CRM Studio · Made for wholesale
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
