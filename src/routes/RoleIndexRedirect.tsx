import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const RoleIndexRedirect = () => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return <Navigate to={`/${user.role}/dashboard`} replace />
}
