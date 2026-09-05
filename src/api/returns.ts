import apiClient from './client'

export interface OrderReturnItem {
  id: string
  product: string
  productName: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

export interface OrderReturn {
  id: string
  orderId: string
  customerProfileId: string
  items: OrderReturnItem[]
  returnType: string
  reason: string
  status: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export const returnsApi = {
  createOrderReturn: async (data: {
    orderId: string
    items: { product: string; quantity: number }[]
    returnType: string
    reason: string
  }) => {
    const response = await apiClient.post('/returns/', data)
    return response.data
  },

  updateOrderReturnStatus: async (returnId: string, status: string) => {
    const response = await apiClient.patch(`/returns/${returnId}/status`, { status })
    return response.data
  },

  getOrderReturns: async (orderId: string) => {
    const response = await apiClient.get(`/returns/order/${orderId}`)
    return response.data
  },

  getCustomerReturns: async (customerProfileId: string) => {
    const response = await apiClient.get(`/returns/customer/${customerProfileId}`)
    return response.data
  },

  getAllReturns: async (params?: { page?: number; limit?: number; orderId?: string; customerProfileId?: string; status?: string }) => {
    const response = await apiClient.get('/returns/', { params })
    return response.data
  },

  getReturnById: async (returnId: string) => {
    const response = await apiClient.get(`/returns/${returnId}`)
    return response.data
  },
}
