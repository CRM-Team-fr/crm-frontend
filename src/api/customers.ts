import apiClient from './client'

export interface Customer {
  id: string
  userId: string
  businessName: string
  customerName: string
  phoneNumber: string
  customerStage: string
}

export interface CustomerDetail {
  id: string
  user: {
    id: string
    Name: string
    phoneNumber: string
    status: string
    role: string
  }
  businessName: string
  businessType: string
  address: string
  city: string
  state: string
  pincode: string
  alternatePhoneNumber?: string
  assignedSalesperson?: {
    id: string
    Name: string
    email: string
    phoneNumber: string
  }
  customerStage: string
  totalOrders: number
  totalRevenue: number
  outstandingAmount: number
  lastContactedAt: string | null
  nextFollowUpAt: string | null
  createdAt: string
  updatedAt: string
}

export const customersApi = {
  getCustomers: async (params?: { page?: number; limit?: number; stage?: string; city?: string; status?: string }) => {
    const response = await apiClient.get('/customers/', { params })
    return response.data
  },

  getMyCustomers: async () => {
    const response = await apiClient.get('/customers/my-customers')
    return response.data
  },

  getCustomerById: async (customerProfileId: string) => {
    const response = await apiClient.get(`/customers/${customerProfileId}`)
    return response.data
  },

  removeCustomer: async (customerProfileId: string) => {
    const response = await apiClient.patch(`/customers/${customerProfileId}/remove`)
    return response.data
  },

  getAvailableStages: async () => {
    const response = await apiClient.get('/customers/stages')
    return response.data
  },

  updateCustomerStage: async (customerProfileId: string, newStage: string) => {
    const response = await apiClient.patch(
      `/customers/${customerProfileId}/stage`,
      { customerStage: newStage }
    )
    return response.data
  },
}
