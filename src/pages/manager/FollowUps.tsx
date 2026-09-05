import { useQuery } from '@tanstack/react-query'
import { DataTable } from '../../components/tables/DataTable'
import { Badge } from '../../components/status/StatusBadge'
import { followUpsApi } from '../../api'

export const ManagerFollowUps = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['teamFollowUps'],
    queryFn: async () => {
      const response = await followUpsApi.getTeamFollowUps()
      return response
    },
  })

  const followUps = data?.followUps || []

  const columns = [
    {
      header: 'Title',
      key: 'title',
      render: (item: any) => (
        <div>
          <p className="font-medium">{item.title}</p>
          <p className="text-sm text-gray-500">{item.customer?.businessName}</p>
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
      <h1 className="text-2xl font-bold text-gray-900">Team Follow-ups</h1>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">All Team Follow-ups</h3>
        </div>
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
