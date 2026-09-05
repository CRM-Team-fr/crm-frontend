import { useQuery } from '@tanstack/react-query'
import { DataTable } from '../../components/tables/DataTable'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/status/StatusBadge'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { ordersApi } from '../../api'

export const CustomerOrders = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

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
          <p className="font-medium">#{item.id.slice(-6)}</p>
          <p className="text-sm text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</p>
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
        <Button size="sm" variant="ghost" onClick={() => navigate(`/customer/orders/${item.id}`)}>
          View
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>

      <div className="bg-white rounded-lg border border-gray-200">
        <DataTable
          columns={columns}
          data={orders}
          keyExtractor={(item) => item.id}
          isLoading={isLoading}
          emptyMessage="No orders found"
        />
      </div>
    </div>
  )
}
