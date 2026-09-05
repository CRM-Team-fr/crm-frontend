import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { DataTable } from '../../components/tables/DataTable'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/status/StatusBadge'
import { useNavigate } from 'react-router-dom'
import { CreateQuotationModal } from '../../components/modals'
import { quotationsApi } from '../../api'

export const SalespersonQuotations = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [showQuotationModal, setShowQuotationModal] = useState(false)
  const [error, setError] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['quotations'],
    queryFn: async () => {
      const response = await quotationsApi.getQuotations()
      return response
    },
  })

  const convertMutation = useMutation({
    mutationFn: (quotationId: string) => quotationsApi.convertQuotationToOrder(quotationId),
    onSuccess: () => {
      setError('')
      queryClient.invalidateQueries({ queryKey: ['quotations'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
    onError: (err: any) => {
      setError(err?.response?.data?.message || 'Failed to convert quotation to order.')
    },
  })

  const quotations = data?.quotations || []

  const columns = [
    {
      header: 'Quotation',
      key: 'id',
      render: (item: any) => (
        <div>
          <p className="font-medium">#{item.id.slice(-6)}</p>
          <p className="text-sm text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</p>
        </div>
      ),
    },
    {
      header: 'Customer',
      key: 'customerProfile',
      render: (item: any) => item.customerProfile?.businessName || 'N/A',
    },
    {
      header: 'Amount',
      key: 'grandTotal',
      render: (item: any) => `₹${item.grandTotal?.toLocaleString()}`,
    },
    {
      header: 'Status',
      key: 'status',
      render: (item: any) => {
        const variant = item.status === 'accepted' ? 'success' : item.status === 'rejected' ? 'danger' : item.status === 'sent' ? 'info' : 'default'
        return <Badge variant={variant} className="capitalize">{item.status}</Badge>
      },
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (item: any) => (
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={() => navigate(`/salesperson/quotations/${item.id}`)}>
            View
          </Button>
          {item.status === 'accepted' && (
            <Button
              size="sm"
              onClick={() => convertMutation.mutate(item.id)}
              loading={convertMutation.isPending}
            >
              Convert to Order
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Quotations</h1>
        <Button onClick={() => setShowQuotationModal(true)}>New Quotation</Button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200">
        <DataTable
          columns={columns}
          data={quotations}
          keyExtractor={(item) => item.id}
          isLoading={isLoading}
          emptyMessage="No quotations found"
        />
      </div>

      <CreateQuotationModal isOpen={showQuotationModal} onClose={() => setShowQuotationModal(false)} />
    </div>
  )
}
