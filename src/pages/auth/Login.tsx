import { useState, useEffect, useRef } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.tsx'
import { authApi } from '../../api/index.ts'
import { Button } from '../../components/common/Button.tsx'
import { Input } from '../../components/common/Input.tsx'
import type { User } from '../../types/index.ts'

type Step = 'phone' | 'otp' | 'register' | 'pending'

export const Login = () => {
  const { login, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [isCustomer, setIsCustomer] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [step, setStep] = useState<Step>('phone')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [customerExists, setCustomerExists] = useState<boolean | null>(null)
  const [cooldown, setCooldown] = useState(0)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const [formData, setFormData] = useState({
    Name: '',
    phoneNumber: '',
    businessName: '',
    businessType: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  })

  const cooldownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => {
      if (cooldownIntervalRef.current) {
        clearInterval(cooldownIntervalRef.current)
      }
    }
  }, [])

  if (isAuthenticated) {
    const role = user?.role || 'salesperson'
    return <Navigate to={`/${role}/dashboard`} replace />
  }

  const startCooldown = (seconds: number) => {
    setCooldown(seconds)
    if (cooldownIntervalRef.current) {
      clearInterval(cooldownIntervalRef.current)
    }
    cooldownIntervalRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (cooldownIntervalRef.current) {
            clearInterval(cooldownIntervalRef.current)
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authApi.loginCustomer(phoneNumber)
      if (response.success && response.token && response.user) {
        const userWithProfile = { ...response.user, customerProfileId: response.customerProfileId }
        login(response.token, userWithProfile as User)
        navigate(`/${response.user.role}/dashboard`)
      } else {
        setError(response.message || 'Login failed')
      }
    } catch (err: any) {
      const status = err?.response?.status
      const message = err?.response?.data?.message || err?.message || 'Something went wrong. Please try again.'

      if (status === 404) {
        setCustomerExists(false)
        setError('Phone number is not registered.')
      } else if (status === 403) {
        if (message.toLowerCase().includes('approval')) {
          setStep('pending')
          setError('Your account is waiting for admin approval.')
        } else if (message.toLowerCase().includes('verify otp')) {
          setCustomerExists(true)
          const otpResponse = await authApi.sendOtp(phoneNumber)
          startCooldown(otpResponse.resendAfter)
          setStep('otp')
        } else {
          setError(message)
        }
      } else {
        setError(message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleEmployeeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authApi.loginEmployee(email, password)
      if (response.changePasswordRequired) {
        navigate('/change-password', { state: { employeeId: response.employeeId } })
        return
      }
      if (response.success && response.token && response.user) {
        login(response.token, response.user as User)
        const role = response.user.role || 'salesperson'
        navigate(`/${role}/dashboard`)
      } else {
        setError(response.message || 'Login failed')
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Login failed. Please try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const verifyResponse = await authApi.verifyOtp(phoneNumber, otp)
      if (verifyResponse.success) {
        const loginResponse = await authApi.loginCustomer(phoneNumber)
        if (loginResponse.success && loginResponse.token && loginResponse.user) {
          const userWithProfile = { ...loginResponse.user, customerProfileId: loginResponse.customerProfileId }
          login(loginResponse.token, userWithProfile as User)
          navigate(`/${loginResponse.user.role}/dashboard`)
        } else if (loginResponse.message?.includes('waiting for admin approval')) {
          setError('Your account is waiting for admin approval.')
          setStep('pending')
        } else {
          setError(loginResponse.message || 'Login failed')
        }
      } else {
        setError(verifyResponse.message || 'OTP verification failed')
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'OTP verification failed. Please try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (cooldown > 0) return
    setError('')
    setLoading(true)
    try {
      const response = await authApi.resendOtp(phoneNumber)
      startCooldown(response.resendAfter)
      setOtp('')
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Failed to resend OTP. Please try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authApi.registerCustomer({ ...formData, phoneNumber })
      if (response.success) {
        setRegistrationSuccess(true)
        try {
          const otpResponse = await authApi.sendOtp(phoneNumber)
          startCooldown(otpResponse.resendAfter)
          setStep('otp')
        } catch (otpErr: any) {
          setError(otpErr?.response?.data?.message || 'Registration successful, but failed to send OTP. Please contact support.')
        }
      } else {
        setError(response.message || 'Registration failed')
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Registration failed. Please try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleBackToPhone = () => {
    setStep('phone')
    setCustomerExists(null)
    setOtp('')
    setError('')
    setRegistrationSuccess(false)
    if (cooldownIntervalRef.current) {
      clearInterval(cooldownIntervalRef.current)
    }
    setCooldown(0)
  }

  const maskedPhone = phoneNumber.length > 6
    ? phoneNumber.slice(0, phoneNumber.length - 6) + '******'
    : phoneNumber

  return (
    <div className="w-full">
      <div className="mb-8">
        <div className="lg:hidden flex items-center gap-2 mb-6">
          <div className="h-9 w-9 rounded-xl gradient-brand grid place-items-center text-white">
            <span className="text-sm font-bold">C</span>
          </div>
          <span className="font-display font-bold text-lg">BR Corporation</span>
        </div>
        <h1 className="font-display text-3xl font-extrabold text-gray-900 tracking-tight">Welcome back</h1>
        <p className="mt-2 text-sm text-gray-500">Sign in to continue to your workspace.</p>
      </div>

      <div className="flex rounded-full bg-surface-100 p-1 mb-6">
        <button
          type="button"
          onClick={() => { setIsCustomer(false); setStep('phone'); setCustomerExists(null); setError(''); setRegistrationSuccess(false) }}
          className={`flex-1 py-2 text-sm font-semibold rounded-full transition-all ${
            !isCustomer ? 'bg-white text-brand-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Employee
        </button>
        <button
          type="button"
          onClick={() => { setIsCustomer(true); setStep('phone'); setCustomerExists(null); setError(''); setRegistrationSuccess(false) }}
          className={`flex-1 py-2 text-sm font-semibold rounded-full transition-all ${
            isCustomer ? 'bg-white text-brand-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Customer
        </button>
      </div>

      {error && (
        <div className={`p-3 border text-sm rounded-lg mb-4 ${step === 'pending' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {error}
        </div>
      )}

      {registrationSuccess && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg mb-4">
          Registration successful! Your account is awaiting admin approval.
        </div>
      )}

      {!isCustomer ? (
        <form onSubmit={handleEmployeeSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
          <Button type="submit" className="w-full" loading={loading}>
            Sign In
          </Button>
          {import.meta.env.DEV && (
            <p className="mt-4 text-center text-sm text-gray-600">
              Demo: admin@crm.com / hello999
            </p>
          )}
        </form>
      ) : (
        <>
          {step === 'phone' && (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <Input
                label="Phone Number"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter your phone number"
                required
              />
              <Button type="submit" className="w-full" loading={loading}>
                Continue
              </Button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <p className="text-sm text-gray-600">
                OTP sent to {maskedPhone}
              </p>
              <Input
                label="OTP"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                required
                maxLength={6}
              />
              <Button type="submit" className="w-full" loading={loading}>
                Verify OTP
              </Button>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={cooldown > 0 || loading}
                  className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend OTP'}
                </button>
                <button
                  type="button"
                  onClick={handleBackToPhone}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Change phone number
                </button>
              </div>
            </form>
          )}

          {step === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Phone number is not registered. Please register to continue.
              </p>
              <Input
                label="Full Name"
                value={formData.Name}
                onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                required
              />
              <Input
                label="Phone Number"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                required
                disabled
              />
              <Input
                label="Business Name"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                required
              />
              <Input
                label="Business Type"
                value={formData.businessType}
                onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                required
              />
              <Input
                label="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
                <Input
                  label="State"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  required
                />
              </div>
              <Input
                label="Pincode"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                required
              />
              <div className="flex gap-3">
                <Button type="button" variant="secondary" className="flex-1" onClick={handleBackToPhone}>
                  Back
                </Button>
                <Button type="submit" className="flex-1" loading={loading}>
                  Register
                </Button>
              </div>
            </form>
          )}

          {customerExists === false && step === 'phone' && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 mb-3">
                Phone number is not registered.
              </p>
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => {
                  setFormData({ ...formData, phoneNumber })
                  setStep('register')
                }}
              >
                Register
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
