import apiClient from './client'

export interface SalespersonPerformance {
  salespersonId: string
  salespersonName: string
  customers: {
    assigned: number
    active: number
    new: number
  }
  followUps: {
    total: number
    completed: number
    pending: number
    overdue: number
  }
  quotations: {
    created: number
    sent: number
    accepted: number
    rejected: number
    conversionRate: number
  }
  orders: {
    created: number
    completed: number
    totalSales: number
    averageOrderValue: number
  }
  payments: {
    collected: number
    outstanding: number
  }
  conversionRate: number
}

export const performanceApi = {
  getSalespersonPerformance: async (salespersonId: string, params?: { startDate?: string; endDate?: string }) => {
    const response = await apiClient.get(`/performance/salesperson/${salespersonId}`, { params })
    return response.data
  },

  getSalespersonComparison: async (params?: { startDate?: string; endDate?: string }) => {
    const response = await apiClient.get('/performance/salesperson/comparison', { params })
    return response.data
  },
}
