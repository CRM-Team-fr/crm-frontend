import { useQuery } from '@tanstack/react-query'
import { DataTable } from '../../components/tables/DataTable'
import { Badge } from '../../components/status/StatusBadge'
import { useAuth } from '../../context/AuthContext'
import { followUpsApi } from '../../api'

export const CustomerFollowUps = () => {
  const { user } = useAuth()

  const customerProfileId = user?.customerProfileId

  const { data, isLoading } = useQuery({
    queryKey: ['customerFollowUps', customerProfileId],
    queryFn: async () => {
      if (!customerProfileId) throw new Error('Customer profile not found')
      const response = await followUpsApi.getCustomerFollowUps(customerProfileId)
      return response
    },
    enabled: !!customerProfileId,
  })

  const followUps = data?.followUps || []

  const columns = [
    {
      header: 'Title',
      key: 'title',
      render: (item: any) => (
        <div>
          <p className="font-medium">{item.title}</p>
          <p className="text-sm text-gray-500">{item.description}</p>
        </div>
      ),
    },
    {
      header: 'Date',
      key: 'followUpDate',
      render: (item: any) => new Date(item.followUpDate).toLocaleDateString(),
    },
    {
      header: 'Priority',
      key: 'priority',
      render: (item: any) => <span className="capitalize">{item.priority}</span>,
    },
    {
      header: 'Status',
      key: 'status',
      render: (item: any) => {
        const variant = item.status === 'completed' ? 'success' : item.status === 'pending' ? 'warning' : 'default'
        return <Badge variant={variant} className="capitalize">{item.status}</Badge>
      },
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Follow-ups</h1>

      <div className="bg-white rounded-lg border border-gray-200">
        <DataTable
          columns={columns}
          data={followUps}
          keyExtractor={(item) => item.id}
          isLoading={isLoading}
          emptyMessage="No follow-ups found"
        />
      </div>
    </div>
  )
}
