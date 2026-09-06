import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { DataTable } from '../../components/tables/DataTable'
import { Badge } from '../../components/status/StatusBadge'
import { Button } from '../../components/common/Button'
import { returnsApi } from '../../api'

export const AdminReturns = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [error, setError] = useState('')

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      returnsApi.updateOrderReturnStatus(id, status),
    onSuccess: () => {
      setError('')
      queryClient.invalidateQueries({ queryKey: ['returns'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] })
      // Any InventoryHistoryModal open on ANY productId will refresh
      queryClient.invalidateQueries({ queryKey: ['inventoryMovements'] })
    },
    onError: (err: any) => {
      setError(err?.response?.data?.message || 'Failed to update return status.')
    },
  })
  const { data, isLoading } = useQuery({
    queryKey: ['returns'],
    queryFn: async () => {
      const response = await returnsApi.getAllReturns()
      return response
    },
  })

  const returns = data?.returns || []

  const columns = [
    {
      header: 'Return',
      key: 'id',
      render: (item: any) => (
        <div>
          <p className="font-medium">#{item.id.slice(-6)}</p>
          <p className="text-sm text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</p>
        </div>
      ),
    },
    {
      header: 'Order',
      key: 'orderId',
      render: (item: any) => `#${item.orderId?._id?.slice(-6) || 'N/A'}`,
    },
    {
      header: 'Type',
      key: 'returnType',
      render: (item: any) => <span className="capitalize">{item.returnType}</span>,
    },
    {
      header: 'Status',
      key: 'status',
      render: (item: any) => {
        const variant = item.status === 'completed' ? 'success' : item.status === 'approved' ? 'info' : item.status === 'rejected' ? 'danger' : 'warning'
        return <Badge variant={variant} className="capitalize">{item.status}</Badge>
      },
    },
    {
      header: 'Reason',
      key: 'reason',
      render: (item: any) => <span className="truncate max-w-xs">{item.reason}</span>,
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (item: any) => {
        const busy = updateStatus.isPending && updateStatus.variables?.id === item.id
        return (
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="ghost" onClick={() => navigate(`/admin/returns/${item.id}`)}>View</Button>
            {item.status === 'pending' && (
              <>
                <Button
                  size="sm"
                  loading={busy && updateStatus.variables?.status === 'approved'}
                  onClick={() => updateStatus.mutate({ id: item.id, status: 'approved' })}
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  loading={busy && updateStatus.variables?.status === 'rejected'}
                  onClick={() => updateStatus.mutate({ id: item.id, status: 'rejected' })}
                >
                  Reject
                </Button>
              </>
            )}
            {item.status === 'approved' && (
              <Button
                size="sm"
                loading={busy && updateStatus.variables?.status === 'completed'}
                onClick={() => updateStatus.mutate({ id: item.id, status: 'completed' })}
              >
                Mark completed
              </Button>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Returns</h1>

      {error && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm">{error}</div>
      )}

      <p className="text-xs text-gray-500 -mt-4">
        When a return is marked <strong>completed</strong>, stock is added back and revenue is reduced automatically.
      </p>

      <div className="bg-white rounded-lg border border-gray-200">
        <DataTable
          columns={columns}
          data={returns}
          keyExtractor={(item) => item.id}
          isLoading={isLoading}
          emptyMessage="No returns found"
        />
      </div>
    </div>
  )
}
