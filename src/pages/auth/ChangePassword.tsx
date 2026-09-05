import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { authApi } from '../../api/index.ts'
import { Button } from '../../components/common/Button.tsx'
import { Input } from '../../components/common/Input.tsx'

export const ChangePassword = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const employeeId = location.state?.employeeId

  const [formData, setFormData] = useState({
    employeeId: employeeId || '',
    currentPassword: '',
    newPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!employeeId) {
      navigate('/login')
    }
  }, [employeeId, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authApi.changePassword(formData)
      if (response.success) {
        navigate('/login', { state: { message: 'Password changed successfully. Please login.' } })
      } else {
        setError(response.message || 'Password change failed')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Password change failed')
    } finally {
      setLoading(false)
    }
  }

  if (!employeeId) {
    return null
  }

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Change Password</h1>
        <p className="text-sm text-gray-600">You must change your temporary password</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
            {error}
          </div>
        )}

        <Input
          label="Current Password"
          type="password"
          value={formData.currentPassword}
          onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
          required
        />

        <Input
          label="New Password"
          type="password"
          value={formData.newPassword}
          onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
          required
        />

        <Button type="submit" className="w-full" loading={loading}>
          Change Password
        </Button>
      </form>
    </div>
  )
}
