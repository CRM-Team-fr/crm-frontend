import apiClient from './client'

export interface ManagerDashboard {
  sales: {
    teamSales: number
    totalOrders: number
    completedOrders: number
    averageOrderValue: number
    salesBySalesperson: Array<{
      salespersonId: string
      salespersonName: string
      totalSales: number
      orderCount: number
    }>
  }
  crm: {
    totalCustomers: number
    newCustomers: number
    activeCustomers: number
    followUpCompletionRate: number
    overdueFollowUps: number
  }
  quotations: {
    created: number
    accepted: number
    rejected: number
    conversionRate: number
  }
  payments: {
    collected: number
    outstanding: number
    overdue: number
  }
  inventory: {
    lowStockProducts: number
    outOfStockProducts: number
    bestSellingProducts: any[]
  }
  performance: {
    topSalesperson: any
    lowestPerformingSalesperson: any
    salespersonComparison: any[]
  }
}

export interface SalespersonDashboard {
  crm: {
    totalCustomers: number
    newCustomers: number
    activeCustomers: number
    followUpCompletionRate: number
    overdueFollowUps: number
  }
  quotations: {
    created: number
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
    overdue: number
  }
  followUps: {
    total: number
    completed: number
    pending: number
    overdue: number
  }
  performance: {
    conversionRate: number
  }
}

export const dashboardsApi = {
  getSalespersonDashboard: async (salespersonId: string, params?: { startDate?: string; endDate?: string }) => {
    const response = await apiClient.get(`/dashboard/salesperson/${salespersonId}`, { params })
    return response.data
  },

  getManagerDashboard: async (params?: { startDate?: string; endDate?: string }) => {
    const response = await apiClient.get('/dashboard/manager/', { params })
    return response.data
  },

  getAdminDashboard: async (params?: { startDate?: string; endDate?: string }) => {
    const response = await apiClient.get('/dashboard/admin/', { params })
    return response.data
  },

  getCustomerDashboard: async (customerProfileId: string) => {
    const response = await apiClient.get(`/dashboard/customer/${customerProfileId}`)
    return response.data
  },
}
