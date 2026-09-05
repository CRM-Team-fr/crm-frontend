import { useQuery } from '@tanstack/react-query'
import { dashboardsApi } from '../../api'
import { LoadingState } from '../../components/common/LoadingState'
import { Card, CardBody } from '../../components/common/Card'
import { DollarSign, ShoppingCart, Users, TrendingUp } from 'lucide-react'

export const ManagerDashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['managerDashboard'],
    queryFn: async () => {
      const response = await dashboardsApi.getManagerDashboard()
      return response.dashboard
    },
  })

  if (isLoading) return <LoadingState message="Loading dashboard..." />

  const dashboard = data || {}

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody>
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Team Sales</p>
                <p className="text-2xl font-bold">₹{dashboard.sales?.teamSales?.toLocaleString() || 0}</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center gap-3">
              <ShoppingCart className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">{dashboard.sales?.totalOrders || 0}</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Customers</p>
                <p className="text-2xl font-bold">{dashboard.crm?.totalCustomers || 0}</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Outstanding</p>
                <p className="text-2xl font-bold">₹{dashboard.payments?.outstanding?.toLocaleString() || 0}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
