import apiClient from './client'

export interface QuotationRequestItem {
  product: string
  quantity: number
  notes?: string
}

export const quotationRequestsApi = {
  create: async (data: { customerProfileId: string; items: QuotationRequestItem[]; notes?: string }) =>
    (await apiClient.post('/quotation-requests', data)).data,
  list: async (params?: { status?: string }) =>
    (await apiClient.get('/quotation-requests', { params })).data,
  detail: async (id: string) =>
    (await apiClient.get(`/quotation-requests/${id}`)).data,
  forward: async (id: string, managerId?: string) =>
    (await apiClient.post(`/quotation-requests/${id}/forward`, { managerId })).data,
  reject: async (id: string, reason?: string) =>
    (await apiClient.post(`/quotation-requests/${id}/reject`, { reason })).data,
}
