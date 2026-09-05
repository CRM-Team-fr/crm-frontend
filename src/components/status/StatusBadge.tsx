import { type ReactNode } from 'react'

interface StatusBadgeProps {
  children: ReactNode
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'brand' | 'default'
  dot?: boolean
  className?: string
}

export const Badge = ({ children, variant = 'default', dot = false, className = '' }: StatusBadgeProps) => {
  const variants = {
    success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    warning: 'bg-amber-50 text-amber-800 ring-amber-200',
    danger:  'bg-rose-50 text-rose-700 ring-rose-200',
    info:    'bg-sky-50 text-sky-700 ring-sky-200',
    brand:   'bg-brand-50 text-brand-700 ring-brand-200',
    default: 'bg-gray-50 text-gray-700 ring-gray-200',
  }
  const dotColor = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger:  'bg-rose-500',
    info:    'bg-sky-500',
    brand:   'bg-brand-500',
    default: 'bg-gray-400',
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${variants[variant]} ${className}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dotColor[variant]}`} />}
      {children}
    </span>
  )
}
