import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { DataTable } from '../../components/tables/DataTable'
import { Badge } from '../../components/status/StatusBadge'
import { useAuth } from '../../context/AuthContext'
import { quotationsApi } from '../../api'

export const CustomerQuotations = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [error, setError] = useState('')

  const customerProfileId = user?.customerProfileId

  const { data, isLoading } = useQuery({
    queryKey: ['customerQuotations', customerProfileId],
    queryFn: async () => {
      if (!customerProfileId) throw new Error('Customer profile not found')
      const response = await quotationsApi.getCustomerQuotations(customerProfileId)
      return response
    },
    enabled: !!customerProfileId,
  })

  const quotations = data?.quotations || []

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'accepted' | 'rejected' }) =>
      quotationsApi.updateQuotationStatus(id, status),
    onSuccess: () => {
      setError('')
      queryClient.invalidateQueries({ queryKey: ['customerQuotations', customerProfileId] })
    },
    onError: (err: any) => {
      setError(err?.response?.data?.message || 'Failed to update quotation status.')
    },
  })

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
      header: 'Amount',
      key: 'grandTotal',
      render: (item: any) => `₹${item.grandTotal?.toLocaleString()}`,
    },
    {
      header: 'Status',
      key: 'status',
      render: (item: any) => {
        const variant =
          item.status === 'accepted' ? 'success' :
          item.status === 'rejected' ? 'danger' :
          item.status === 'converted' ? 'info' :
          item.status === 'sent' ? 'info' : 'default'
        return <Badge variant={variant} className="capitalize">{item.status}</Badge>
      },
    },
    {
      header: 'Valid Until',
      key: 'validUntil',
      render: (item: any) => (item.validUntil ? new Date(item.validUntil).toLocaleDateString() : 'N/A'),
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (item: any) => {
        if (item.status !== 'sent') return <span className="text-xs text-gray-400">—</span>
        return (
          <div className="flex gap-2">
            <button
              disabled={updateStatus.isPending}
              onClick={() => updateStatus.mutate({ id: item.id, status: 'accepted' })}
              className="text-sm text-green-600 hover:underline disabled:opacity-50"
            >
              Accept
            </button>
            <button
              disabled={updateStatus.isPending}
              onClick={() => updateStatus.mutate({ id: item.id, status: 'rejected' })}
              className="text-sm text-red-600 hover:underline disabled:opacity-50"
            >
              Reject
            </button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Quotations</h1>

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
    </div>
  )
}
