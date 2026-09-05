import apiClient from './client'

export const reportsApi = {
  getSalesReport: async (params?: { startDate?: string; endDate?: string; salesperson?: string; customer?: string; orderStatus?: string }) => {
    const response = await apiClient.get('/reports/sales', { params })
    return response.data
  },

  getCustomerReport: async (params?: { stage?: string; city?: string; salesperson?: string }) => {
    const response = await apiClient.get('/reports/customers', { params })
    return response.data
  },

  getProductReport: async () => {
    const response = await apiClient.get('/reports/products')
    return response.data
  },

  getInventoryReport: async () => {
    const response = await apiClient.get('/reports/inventory')
    return response.data
  },

  getPaymentReport: async (params?: { startDate?: string; endDate?: string; customer?: string; order?: string }) => {
    const response = await apiClient.get('/reports/payments', { params })
    return response.data
  },

  getSalespersonReport: async (salespersonId: string, params?: { startDate?: string; endDate?: string }) => {
    const response = await apiClient.get(`/reports/salesperson/${salespersonId}`, { params })
    return response.data
  },

  getManagerReport: async (managerId: string, params?: { startDate?: string; endDate?: string }) => {
    const response = await apiClient.get(`/reports/manager/${managerId}`, { params })
    return response.data
  },
}
