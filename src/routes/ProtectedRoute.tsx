import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

const rolePathMap: Record<string, string[]> = {
  admin: ['admin'],
  manager: ['admin', 'manager'],
  salesperson: ['admin', 'manager', 'salesperson'],
  customer: ['customer'],
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  const pathParts = window.location.pathname.split('/').filter(Boolean)
  const pathRole = pathParts[0]
  const inferredRoles = rolePathMap[pathRole]

  if (inferredRoles && !inferredRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}/dashboard`} replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}/dashboard`} replace />
  }

  return <>{children}</>
}
