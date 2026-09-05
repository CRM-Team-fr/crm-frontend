import apiClient from './client'

export interface LoginEmployeeResponse {
  success: boolean
  message: string
  token?: string
  user?: {
    id: string
    Name: string
    role: string
  }
  changePasswordRequired?: boolean
  employeeId?: string
}

export interface LoginCustomerResponse {
  success: boolean
  message: string
  token: string
  user: {
    id: string
    Name: string
    role: string
  }
  customerProfileId?: string
}

export interface RegisterCustomerResponse {
  success: boolean
  message: string
  customerId: string
}

export interface SendOtpResponse {
  success: boolean
  message: string
  expiresIn: number
  resendAfter: number
}

export interface VerifyOtpResponse {
  success: boolean
  message: string
  phoneNumber: string
}

export const authApi = {
  sendOtp: async (phoneNumber: string): Promise<SendOtpResponse> => {
    const response = await apiClient.post('/auth/customer/send-otp', { phoneNumber })
    return response.data
  },

  verifyOtp: async (phoneNumber: string, otp: string): Promise<VerifyOtpResponse> => {
    const response = await apiClient.post('/auth/customer/verify-otp', { phoneNumber, otp })
    return response.data
  },

  resendOtp: async (phoneNumber: string): Promise<SendOtpResponse> => {
    const response = await apiClient.post('/auth/customer/resend-otp', { phoneNumber })
    return response.data
  },
  registerCustomer: async (data: {
    Name: string
    phoneNumber: string
    businessName: string
    businessType: string
    address: string
    city: string
    state: string
    pincode: string
  }): Promise<RegisterCustomerResponse> => {
    const response = await apiClient.post('/auth/register', data)
    return response.data
  },

  loginCustomer: async (phoneNumber: string): Promise<LoginCustomerResponse> => {
    const response = await apiClient.post('/auth/customer/login', { phoneNumber })
    return response.data
  },

  loginEmployee: async (email: string, password: string): Promise<LoginEmployeeResponse> => {
    const response = await apiClient.post('/auth/employee/login', { email, password })
    return response.data
  },

  changePassword: async (data: {
    employeeId: string
    currentPassword: string
    newPassword: string
  }) => {
    const response = await apiClient.patch('/auth/change-password', data)
    return response.data
  },

  getEmployees: async () => {
    const response = await apiClient.get('/auth/admin/employees')
    return response.data
  },

  createEmployee: async (data: {
    Name: string
    email: string
    phoneNumber: string
    role: string
  }) => {
    const response = await apiClient.post('/auth/admin/create-employee', data)
    return response.data
  },

  approveCustomer: async (customerId: string) => {
    const response = await apiClient.patch('/auth/admin/approve-customer', { customerId })
    return response.data
  },

  assignSalesperson: async (customerId: string, salespersonId: string) => {
    const response = await apiClient.patch('/auth/admin/assign-salesperson', {
      customerId,
      salespersonId,
    })
    return response.data
  },

  approveAndAssignCustomer: async (customerId: string, salespersonId: string) => {
    const response = await apiClient.patch('/auth/admin/approve-and-assign', {
      customerId,
      salespersonId,
    })
    return response.data
  },

  removeEmployee: async (employeeId: string) => {
    const response = await apiClient.patch(`/auth/admin/employees/${employeeId}/remove`)
    return response.data
  },

  reactivateEmployee: async (employeeId: string) => {
    const response = await apiClient.patch(`/auth/admin/employees/${employeeId}/reactivate`)
    return response.data
  },

  cleanupGhostCustomerUsers: async () => {
    const response = await apiClient.post('/auth/admin/cleanup-ghost-users')
    return response.data
  },

  markCustomerOtpVerified: async (phoneNumber: string) => {
    const response = await apiClient.post('/auth/admin/mark-customer-verified', { phoneNumber })
    return response.data
  },

  getEmployeeActivity: async (employeeId: string) => {
    const response = await apiClient.get(`/auth/admin/employees/${employeeId}/activity`)
    return response.data
  },

  updateCustomerStatus: async (customerId: string, status: 'approved' | 'suspended') => {
    const response = await apiClient.patch('/auth/admin/customer-status', {
      customerId,
      status,
    })
    return response.data
  },
}
