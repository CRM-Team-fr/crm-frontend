import { useQuery } from '@tanstack/react-query'
import { DataTable } from '../../components/tables/DataTable'
import { Badge } from '../../components/status/StatusBadge'
import { followUpsApi } from '../../api'

export const SalespersonFollowUps = () => {
  const { data: myFollowUps, isLoading: myLoading } = useQuery({
    queryKey: ['myFollowUps'],
    queryFn: async () => {
      const response = await followUpsApi.getMyFollowUps()
      return response
    },
  })

  const { data: overdueFollowUps, isLoading: overdueLoading } = useQuery({
    queryKey: ['overdueFollowUps'],
    queryFn: async () => {
      const response = await followUpsApi.getOverdueFollowUps()
      return response
    },
  })

  const isLoading = myLoading || overdueLoading
  const followUps = myFollowUps?.followUps || []
  const overdue = overdueFollowUps?.followUps || []

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
      <h1 className="text-2xl font-bold text-gray-900">Follow-ups</h1>

      {overdue.length > 0 && (
        <div className="bg-white rounded-lg border border-red-200">
          <div className="px-6 py-4 border-b border-red-200 bg-red-50">
            <h3 className="text-lg font-semibold text-red-800">Overdue Follow-ups ({overdue.length})</h3>
          </div>
          <DataTable
            columns={columns}
            data={overdue}
            keyExtractor={(item) => item.id}
            isLoading={isLoading}
            emptyMessage="No overdue follow-ups"
          />
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">My Follow-ups</h3>
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
