import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard,
  Users,
  UserPlus,
  FileText,
  ShoppingCart,
  CreditCard,
  Package,
  Box,
  BarChart3,
  FileBarChart,
  Bell,
  LogOut,
  ClipboardList,
  UserCheck,
  Sparkles,
} from 'lucide-react'

const navItems = {
  admin: [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/customers', icon: Users, label: 'Customers' },
    { to: '/admin/employees', icon: UserPlus, label: 'Employees' },
    { to: '/admin/products', icon: Package, label: 'Products' },
    { to: '/admin/inventory', icon: Box, label: 'Inventory' },
    { to: '/admin/quotations', icon: FileText, label: 'Quotations' },
    { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { to: '/admin/payments', icon: CreditCard, label: 'Payments' },
    { to: '/admin/returns', icon: ClipboardList, label: 'Returns' },
    { to: '/admin/performance', icon: BarChart3, label: 'Performance' },
    { to: '/admin/reports', icon: FileBarChart, label: 'Reports' },
    { to: '/admin/notifications', icon: Bell, label: 'Notifications' },
  ],
  manager: [
    { to: '/manager/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/manager/team', icon: UserCheck, label: 'Team' },
    { to: '/manager/customers', icon: Users, label: 'Customers' },
    { to: '/manager/followups', icon: ClipboardList, label: 'Follow-ups' },
    { to: '/manager/quotations', icon: FileText, label: 'Quotations' },
    { to: '/manager/orders', icon: ShoppingCart, label: 'Orders' },
    { to: '/manager/payments', icon: CreditCard, label: 'Payments' },
    { to: '/manager/products', icon: Package, label: 'Products' },
    { to: '/manager/inventory', icon: Box, label: 'Inventory' },
    { to: '/manager/performance', icon: BarChart3, label: 'Performance' },
    { to: '/manager/reports', icon: FileBarChart, label: 'Reports' },
    { to: '/manager/notifications', icon: Bell, label: 'Notifications' },
  ],
  salesperson: [
    { to: '/salesperson/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/salesperson/customers', icon: Users, label: 'Customers' },
    { to: '/salesperson/followups', icon: ClipboardList, label: 'Follow-ups' },
    { to: '/salesperson/quotations', icon: FileText, label: 'Quotations' },
    { to: '/salesperson/orders', icon: ShoppingCart, label: 'Orders' },
    { to: '/salesperson/payments', icon: CreditCard, label: 'Payments' },
    { to: '/salesperson/products', icon: Package, label: 'Products' },
    { to: '/salesperson/performance', icon: BarChart3, label: 'Performance' },
    { to: '/salesperson/notifications', icon: Bell, label: 'Notifications' },
  ],
  customer: [
    { to: '/customer/dashboard', icon: LayoutDashboard, label: 'Home' },
    { to: '/customer/products', icon: Package, label: 'Shop products' },
    { to: '/customer/quotations', icon: FileText, label: 'Quotations' },
    { to: '/customer/orders', icon: ShoppingCart, label: 'My orders' },
    { to: '/customer/payments', icon: CreditCard, label: 'Payments' },
    { to: '/customer/returns', icon: ClipboardList, label: 'Returns' },
    { to: '/customer/followups', icon: ClipboardList, label: 'Follow-ups' },
    { to: '/customer/notifications', icon: Bell, label: 'Notifications' },
    { to: '/customer/profile', icon: Users, label: 'Profile' },
  ],
}

export const Sidebar = () => {
  const { user, logout } = useAuth()
  const items = user?.role ? navItems[user.role] : []

  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 z-40 w-72 flex-col bg-white border-r border-gray-100">
      {/* Brand */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-gray-100">
        <div className="h-9 w-9 rounded-xl gradient-brand grid place-items-center text-white shadow-[var(--shadow-glow)]">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <p className="font-display font-bold text-[15px] tracking-tight leading-none">CRM Studio</p>
          <p className="text-[11px] text-gray-500 mt-0.5 capitalize">{user?.role} workspace</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-gray-600 hover:bg-surface-100 hover:text-gray-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`h-8 w-8 rounded-lg grid place-items-center transition-colors ${
                    isActive
                      ? 'bg-white text-brand-600 shadow-sm ring-1 ring-brand-100'
                      : 'text-gray-500 group-hover:text-brand-600'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                </span>
                <span className="flex-1">{item.label}</span>
                {isActive && <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User + logout */}
      <div className="p-3 border-t border-gray-100">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-surface-50">
          <div className="h-9 w-9 rounded-full gradient-brand text-white grid place-items-center text-sm font-semibold shadow-sm">
            {user?.Name?.charAt(0).toUpperCase() || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user?.Name}</p>
            <p className="text-[11px] text-gray-500 capitalize truncate">{user?.role}</p>
          </div>
          <button
            onClick={logout}
            aria-label="Log out"
            className="p-2 rounded-lg text-gray-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
