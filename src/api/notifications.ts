import apiClient from './client'

export interface Notification {
  id: string
  recipient: string
  type: string
  title: string
  message: string
  isRead: boolean
  referenceEntity: string
  referenceId: string
  createdAt: string
  updatedAt: string
}

export interface NotificationSummary {
  total: number
  unread: number
  read: number
}

export const notificationsApi = {
  getNotifications: async (params?: { page?: number; limit?: number; isRead?: boolean; sort?: string }) => {
    const response = await apiClient.get('/notifications/', { params })
    return response.data
  },

  getNotificationSummary: async () => {
    const response = await apiClient.get('/notifications/summary')
    return response.data
  },

  markNotificationAsRead: async (notificationId: string) => {
    const response = await apiClient.patch(`/notifications/${notificationId}/read`)
    return response.data
  },

  markAllNotificationsAsRead: async () => {
    const response = await apiClient.patch('/notifications/read-all')
    return response.data
  },
}
