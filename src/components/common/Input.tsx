import { type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = ({ label, error, hint, className = '', ...props }: InputProps) => {
  return (
    <div>
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
          {label}
        </label>
      )}
      <input
        {...props}
        className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm placeholder:text-gray-400 transition-shadow focus:outline-none focus:ring-4 focus:ring-brand-100 focus:border-brand-400 ${
          error ? 'border-rose-400 focus:ring-rose-100 focus:border-rose-500' : 'border-gray-200'
        } ${className}`}
      />
      {hint && !error && <p className="mt-1.5 text-xs text-gray-500">{hint}</p>}
      {error && <p className="mt-1.5 text-xs text-rose-600">{error}</p>}
    </div>
  )
}
