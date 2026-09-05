import apiClient from './client'

export interface OrderItem {
  id: string
  product: string
  productName: string
  quantity: number
  unitPrice: number
  discount: number
  tax: number
  lineTotal: number
}

export interface Order {
  id: string
  customerProfileId: string
  customerProfile?: {
    id: string
    businessName: string
    user?: { Name: string; phoneNumber: string }
  }
  salesperson: {
    id: string
    Name: string
    email: string
  }
  quotation?: {
    id: string
    status: string
    grandTotal: number
  } | null
  items: OrderItem[]
  subtotal: number
  discount: number
  tax: number
  grandTotal: number
  paymentStatus: string
  orderStatus: string
  notes: string
  createdBy: {
    id: string
    Name: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

export const ordersApi = {
  createOrder: async (data: {
    customerProfileId: string
    items: { product: string; quantity: number; discount?: number; tax?: number }[]
    quotationId?: string
    notes?: string
  }) => {
    const response = await apiClient.post('/orders/', data)
    return response.data
  },

  getOrders: async (params?: { page?: number; limit?: number; orderStatus?: string; paymentStatus?: string }) => {
    const response = await apiClient.get('/orders/', { params })
    return response.data
  },

  getOrderById: async (orderId: string) => {
    const response = await apiClient.get(`/orders/${orderId}`)
    return response.data
  },

  updateOrderStatus: async (orderId: string, orderStatus: string) => {
    const response = await apiClient.patch(`/orders/${orderId}/status`, { orderStatus })
    return response.data
  },

  updatePaymentStatus: async (orderId: string, paymentStatus: string) => {
    const response = await apiClient.patch(`/orders/${orderId}/payment`, { paymentStatus })
    return response.data
  },

  getCustomerOrders: async (customerProfileId: string) => {
    const response = await apiClient.get(`/orders/customer/${customerProfileId}`)
    return response.data
  },

  getSalespersonOrders: async (salespersonId: string) => {
    const response = await apiClient.get(`/orders/salesperson/${salespersonId}`)
    return response.data
  },
}
