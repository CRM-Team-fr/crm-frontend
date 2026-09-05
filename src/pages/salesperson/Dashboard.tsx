import { useQuery } from '@tanstack/react-query'
import { dashboardsApi } from '../../api'
import { LoadingState } from '../../components/common/LoadingState'
import { Card, CardBody } from '../../components/common/Card'
import { ShoppingCart, FileText, Users, PhoneCall } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export const SalespersonDashboard = () => {
  const { user } = useAuth()

  const { data, isLoading } = useQuery({
    queryKey: ['salespersonDashboard', user?.id],
    queryFn: async () => {
      const response = await dashboardsApi.getSalespersonDashboard(user!.id)
      return response.dashboard
    },
    enabled: !!user?.id,
  })

  if (isLoading) return <LoadingState message="Loading dashboard..." />

  const dashboard = data || {}

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Salesperson Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody>
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Assigned Customers</p>
                <p className="text-2xl font-bold">{dashboard.crm?.totalCustomers || 0}</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Quotations</p>
                <p className="text-2xl font-bold">{dashboard.quotations?.created || 0}</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center gap-3">
              <ShoppingCart className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Orders</p>
                <p className="text-2xl font-bold">{dashboard.orders?.created || 0}</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center gap-3">
              <PhoneCall className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Overdue Follow-ups</p>
                <p className="text-2xl font-bold">{dashboard.followUps?.overdue || 0}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
