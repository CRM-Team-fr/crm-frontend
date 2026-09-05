import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { DataTable } from '../../components/tables/DataTable'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/status/StatusBadge'
import { useNavigate } from 'react-router-dom'
import { CreateOrderModal, RecordPaymentModal } from '../../components/modals'
import { ordersApi } from '../../api'

export const ManagerOrders = () => {
  const navigate = useNavigate()
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await ordersApi.getOrders()
      return response
    },
  })

  const orders = data?.orders || []

  const columns = [
    {
      header: 'Order',
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
      header: 'Total',
      key: 'grandTotal',
      render: (item: any) => `₹${item.grandTotal?.toLocaleString()}`,
    },
    {
      header: 'Status',
      key: 'orderStatus',
      render: (item: any) => <Badge variant={item.orderStatus === 'completed' ? 'success' : item.orderStatus === 'cancelled' ? 'danger' : 'info'} className="capitalize">{item.orderStatus}</Badge>,
    },
    {
      header: 'Payment',
      key: 'paymentStatus',
      render: (item: any) => <Badge variant={item.paymentStatus === 'paid' ? 'success' : item.paymentStatus === 'partial' ? 'warning' : 'default'} className="capitalize">{item.paymentStatus}</Badge>,
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (item: any) => (
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={() => navigate(`/manager/orders/${item.id}`)}>View</Button>
          <Button size="sm" variant="ghost" onClick={() => { setSelectedOrderId(item.id); setShowPaymentModal(true); }}>Payment</Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <Button onClick={() => setShowOrderModal(true)}>New Order</Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <DataTable
          columns={columns}
          data={orders}
          keyExtractor={(item) => item.id}
          isLoading={isLoading}
          emptyMessage="No orders found"
        />
      </div>

      <CreateOrderModal isOpen={showOrderModal} onClose={() => setShowOrderModal(false)} />
      <RecordPaymentModal isOpen={showPaymentModal} onClose={() => { setShowPaymentModal(false); setSelectedOrderId(''); }} orderId={selectedOrderId} />
    </div>
  )
}
