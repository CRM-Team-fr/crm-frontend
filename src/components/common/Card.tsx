import { type ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export const Card = ({ children, className = '', hover = false }: CardProps) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 shadow-[var(--shadow-soft)] ${
        hover ? 'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}

interface CardSubProps {
  children: ReactNode
  className?: string
}

export const CardHeader = ({ children, className = '' }: CardSubProps) => (
  <div className={`px-6 py-5 border-b border-gray-100 ${className}`}>{children}</div>
)

export const CardBody = ({ children, className = '' }: CardSubProps) => (
  <div className={`p-6 ${className}`}>{children}</div>
)

export const CardFooter = ({ children, className = '' }: CardSubProps) => (
  <div className={`px-6 py-4 border-t border-gray-100 ${className}`}>{children}</div>
)
