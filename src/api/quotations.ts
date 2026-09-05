import apiClient from './client'

export interface QuotationItem {
  id: string
  product: string
  productName: string
  quantity: number
  unitPrice: number
  discount: number
  tax: number
  lineTotal: number
}

export interface Quotation {
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
  items: QuotationItem[]
  subtotal: number
  discount: number
  tax: number
  grandTotal: number
  status: string
  validUntil: string | null
  notes: string
  createdBy: {
    id: string
    Name: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

export const quotationsApi = {
  createQuotation: async (data: {
    customerProfileId: string
    items: { product: string; quantity: number; discount?: number; tax?: number }[]
    validityDays?: number
    notes?: string
    salespersonId?: string
  }) => {
    const response = await apiClient.post('/quotations/', data)
    return response.data
  },

  getQuotations: async (params?: { page?: number; limit?: number; status?: string }) => {
    const response = await apiClient.get('/quotations/', { params })
    return response.data
  },

  getQuotationById: async (quotationId: string) => {
    const response = await apiClient.get(`/quotations/${quotationId}`)
    return response.data
  },

  updateQuotation: async (quotationId: string, data: { items?: any[]; notes?: string; validUntil?: string }) => {
    const response = await apiClient.patch(`/quotations/${quotationId}`, data)
    return response.data
  },

  updateQuotationStatus: async (quotationId: string, status: string) => {
    const response = await apiClient.patch(`/quotations/${quotationId}/status`, { status })
    return response.data
  },

  getCustomerQuotations: async (customerProfileId: string) => {
    const response = await apiClient.get(`/quotations/customer/${customerProfileId}`)
    return response.data
  },

  getSalespersonQuotations: async (salespersonId: string) => {
    const response = await apiClient.get(`/quotations/salesperson/${salespersonId}`)
    return response.data
  },

  deleteQuotation: async (quotationId: string) => {
    const response = await apiClient.delete(`/quotations/${quotationId}`)
    return response.data
  },

  convertQuotationToOrder: async (quotationId: string, notes?: string) => {
    const response = await apiClient.post(`/quotations/${quotationId}/convert`, { notes })
    return response.data
  },
}
