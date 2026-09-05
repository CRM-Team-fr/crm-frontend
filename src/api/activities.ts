import apiClient from './client'

export interface ActivityPayload {
  customerProfileId: string
  activityType: 'note' | 'call' | 'meeting' | 'email' | string
  title: string
  description: string
  metadata?: Record<string, unknown>
}

export const activitiesApi = {
  createActivity: async (payload: ActivityPayload) => {
    const response = await apiClient.post('/activities', payload)
    return response.data
  },

  getCustomerActivities: async (customerProfileId: string) => {
    const response = await apiClient.get(`/activities/customer/${customerProfileId}`)
    return response.data
  },

  deleteActivity: async (activityId: string) => {
    const response = await apiClient.delete(`/activities/${activityId}`)
    return response.data
  },
}
