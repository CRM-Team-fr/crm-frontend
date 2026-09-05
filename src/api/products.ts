import apiClient from './client'

export interface Product {
  id: string
  name: string
  SKU: string
  category: string
  description: string
  sellingPrice: number
  costPrice: number
  stock: number
  minimumStock: number
  image?: string
  status: string
  stockStatus: string
  createdAt: string
  updatedAt: string
}

export const productsApi = {
  getProducts: async (params?: { page?: number; limit?: number; category?: string; stockStatus?: string; search?: string }) => {
    const response = await apiClient.get('/products/', { params })
    return response.data
  },

  getProductById: async (productId: string) => {
    const response = await apiClient.get(`/products/${productId}`)
    return response.data
  },

  createProduct: async (formData: FormData) => {
    const response = await apiClient.post('/products/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  updateProduct: async (productId: string, formData: FormData) => {
    const response = await apiClient.patch(`/products/${productId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  deleteProduct: async (productId: string) => {
    const response = await apiClient.delete(`/products/${productId}`)
    return response.data
  },

  updateProductStatus: async (productId: string, status: 'active' | 'inactive') => {
    const response = await apiClient.patch(`/products/${productId}/status`, { status })
    return response.data
  },

  adjustStock: async (productId: string, data: { type: string; quantity: number; reason: string; reference?: string }) => {
    const response = await apiClient.patch(`/products/${productId}/stock`, data)
    return response.data
  },

  getInventoryMovements: async (productId: string) => {
    const response = await apiClient.get(`/products/${productId}/movements`)
    return response.data
  },
}
