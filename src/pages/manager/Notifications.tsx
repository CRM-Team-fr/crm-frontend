import { useQuery } from '@tanstack/react-query'
import { DataTable } from '../../components/tables/DataTable'
import { Badge } from '../../components/status/StatusBadge'
import { notificationsApi } from '../../api'

export const ManagerNotifications = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await notificationsApi.getNotifications()
      return response
    },
  })

  const notifications = data?.notifications || []

  const columns = [
    {
      header: 'Title',
      key: 'title',
      render: (item: any) => (
        <div>
          <p className="font-medium">{item.title}</p>
          <p className="text-sm text-gray-500 truncate max-w-md">{item.message}</p>
        </div>
      ),
    },
    {
      header: 'Type',
      key: 'type',
      render: (item: any) => <span className="capitalize">{item.type?.replace('_', ' ')}</span>,
    },
    {
      header: 'Status',
      key: 'isRead',
      render: (item: any) => (
        <Badge variant={item.isRead ? 'default' : 'info'} className="capitalize">
          {item.isRead ? 'Read' : 'Unread'}
        </Badge>
      ),
    },
    {
      header: 'Date',
      key: 'createdAt',
      render: (item: any) => new Date(item.createdAt).toLocaleDateString(),
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>

      <div className="bg-white rounded-lg border border-gray-200">
        <DataTable
          columns={columns}
          data={notifications}
          keyExtractor={(item) => item.id}
          isLoading={isLoading}
          emptyMessage="No notifications found"
        />
      </div>
    </div>
  )
}
