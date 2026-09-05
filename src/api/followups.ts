import apiClient from './client'

export interface FollowUp {
  id: string
  customerProfileId: string
  customer?: {
    id: string
    businessName: string
    customerName: string
    phoneNumber: string
  }
  title: string
  description: string
  followUpDate: string
  taskType: string
  priority: string
  status: string
  outcome?: string
  remarks?: string
  completedAt?: string
  createdBy?: {
    id: string
    Name: string
    role: string
  }
  createdAt: string
  updatedAt: string
}

export const followUpsApi = {
  createFollowUp: async (data: {
    customerProfileId: string
    title: string
    description: string
    followUpDate: string
    taskType: string
    priority: string
  }) => {
    const response = await apiClient.post('/followups/', data)
    return response.data
  },

  getMyFollowUps: async (params?: { page?: number; limit?: number; status?: string; priority?: string }) => {
    const response = await apiClient.get('/followups/my', { params })
    return response.data
  },

  getCustomerFollowUps: async (customerProfileId: string) => {
    const response = await apiClient.get(`/followups/customer/${customerProfileId}`)
    return response.data
  },

  getTodaysFollowUps: async () => {
    const response = await apiClient.get('/followups/today')
    return response.data
  },

  getOverdueFollowUps: async () => {
    const response = await apiClient.get('/followups/overdue')
    return response.data
  },

  getTeamFollowUps: async (params?: { page?: number; limit?: number; status?: string; priority?: string }) => {
    const response = await apiClient.get('/followups/team', { params })
    return response.data
  },

  completeFollowUp: async (followUpId: string, data: { outcome?: string; remarks?: string; nextFollowUp?: any }) => {
    const response = await apiClient.patch(`/followups/${followUpId}/complete`, data)
    return response.data
  },

  rescheduleFollowUp: async (followUpId: string, data: { followUpDate: string }) => {
    const response = await apiClient.patch(`/followups/${followUpId}/reschedule`, data)
    return response.data
  },

  cancelFollowUp: async (followUpId: string) => {
    const response = await apiClient.patch(`/followups/${followUpId}/cancel`)
    return response.data
  },

  deleteFollowUp: async (followUpId: string) => {
    const response = await apiClient.delete(`/followups/${followUpId}`)
    return response.data
  },
}
