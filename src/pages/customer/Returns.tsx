import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { DataTable } from '../../components/tables/DataTable'
import { Badge } from '../../components/status/StatusBadge'
import { Button } from '../../components/common/Button'
import { useAuth } from '../../context/AuthContext'
import { returnsApi } from '../../api'

export const CustomerReturns = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const customerProfileId = user?.customerProfileId

  const { data, isLoading } = useQuery({
    queryKey: ['customerReturns', customerProfileId],
    queryFn: async () => {
      if (!customerProfileId) throw new Error('Customer profile not found')
      const response = await returnsApi.getCustomerReturns(customerProfileId)
      return response
    },
    enabled: !!customerProfileId,
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
      render: (item: any) => (
        <span className="truncate max-w-xs block">{item.reason}</span>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (item: any) => (
        <Button size="sm" variant="ghost" onClick={() => navigate(`/customer/returns/${item.id}`)}>
          View
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Returns</h1>

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
