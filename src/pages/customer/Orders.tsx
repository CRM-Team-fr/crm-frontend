import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { DataTable } from '../../components/tables/DataTable'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/status/StatusBadge'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { ordersApi } from '../../api'
import { RequestReturnModal } from '../../components/modals/RequestReturnModal'

export const CustomerOrders = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [returnOrderId, setReturnOrderId] = useState<string | null>(null)

  const customerProfileId = user?.customerProfileId

  const { data, isLoading } = useQuery({
    queryKey: ['customerOrders', customerProfileId],
    queryFn: async () => {
      if (!customerProfileId) throw new Error('Customer profile not found')
      const response = await ordersApi.getCustomerOrders(customerProfileId)
      return response
    },
    enabled: !!customerProfileId,
  })

  const orders = data?.orders || []

  const columns = [
    {
      header: 'Order',
      key: 'id',
      render: (item: any) => (
        <div>
          <p className="font-semibold text-gray-900">#{item.id.slice(-6)}</p>
          <p className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</p>
        </div>
      ),
    },
    {
      header: 'Total',
      key: 'grandTotal',
      render: (item: any) => `₹${item.grandTotal?.toLocaleString()}`,
    },
    {
      header: 'Status',
      key: 'orderStatus',
      render: (item: any) => (
        <Badge dot variant={item.orderStatus === 'completed' ? 'success' : item.orderStatus === 'cancelled' ? 'danger' : 'info'} className="capitalize">
          {item.orderStatus}
        </Badge>
      ),
    },
    {
      header: 'Payment',
      key: 'paymentStatus',
      render: (item: any) => <Badge variant={item.paymentStatus === 'paid' ? 'success' : item.paymentStatus === 'partial' ? 'warning' : 'default'} className="capitalize">{item.paymentStatus}</Badge>,
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (item: any) => {
        const canReturn = ['confirmed', 'processing', 'completed'].includes(item.orderStatus)
        return (
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => navigate(`/customer/orders/${item.id}`)}>View</Button>
            {canReturn && (
              <Button size="sm" variant="outline" onClick={() => setReturnOrderId(item.id)}>Request return</Button>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-gray-900">My orders</h1>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-[var(--shadow-soft)]">
        <DataTable
          columns={columns}
          data={orders}
          keyExtractor={(item) => item.id}
          isLoading={isLoading}
          emptyMessage="No orders yet."
        />
      </div>

      {returnOrderId && (
        <RequestReturnModal
          isOpen={!!returnOrderId}
          onClose={() => setReturnOrderId(null)}
          orderId={returnOrderId}
        />
      )}
    </div>
  )
}
