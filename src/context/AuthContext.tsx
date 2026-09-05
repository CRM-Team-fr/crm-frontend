import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { User, AuthState } from '../types'
import apiClient from '../api/client'

interface AuthContextType extends AuthState {
  login: (token: string, user: User) => void
  logout: () => Promise<void>
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('user')
      return stored ? JSON.parse(stored) : null
    } catch {
      localStorage.removeItem('user')
      return null
    }
  })
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('accessToken'))
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!token && !!user

  useEffect(() => {
    const initAuth = () => {
      try {
        const storedToken = localStorage.getItem('accessToken')
        const storedUser = localStorage.getItem('user')

        if (storedToken && storedUser) {
          setToken(storedToken)
          setUser(JSON.parse(storedUser))
        }
      } catch {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('user')
        setToken(null)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('accessToken', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
  }

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout')
    } catch {
      // ignore logout errors
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
      setToken(null)
      setUser(null)
    }
  }

  const updateUser = (updatedUser: User) => {
    localStorage.setItem('user', JSON.stringify(updatedUser))
    setUser(updatedUser)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
