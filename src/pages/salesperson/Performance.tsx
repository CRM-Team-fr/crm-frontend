import { useQuery } from '@tanstack/react-query'
import { LoadingState } from '../../components/common/LoadingState'
import { Card, CardBody } from '../../components/common/Card'
import { performanceApi } from '../../api'
import { useAuth } from '../../context/AuthContext'

export const SalespersonPerformance = () => {
  const { user } = useAuth()

  const { data, isLoading } = useQuery({
    queryKey: ['salespersonPerformance', user?.id],
    queryFn: async () => {
      const response = await performanceApi.getSalespersonPerformance(user!.id)
      return response
    },
    enabled: !!user?.id,
  })

  if (isLoading) return <LoadingState message="Loading performance..." />

  const performance = data?.performance || {}

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Performance</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody>
            <div className="text-center">
              <p className="text-sm text-gray-600">Assigned Customers</p>
              <p className="text-2xl font-bold">{performance.customers?.assigned || 0}</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold">{performance.orders?.created || 0}</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold">₹{performance.orders?.totalSales?.toLocaleString() || 0}</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="text-center">
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold">{performance.conversionRate || 0}%</p>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold mb-4">Quotations</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Created</span>
                <span className="text-sm font-medium">{performance.quotations?.created || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Accepted</span>
                <span className="text-sm font-medium">{performance.quotations?.accepted || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Rejected</span>
                <span className="text-sm font-medium">{performance.quotations?.rejected || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Conversion Rate</span>
                <span className="text-sm font-medium">{performance.quotations?.conversionRate || 0}%</span>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold mb-4">Follow-ups</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total</span>
                <span className="text-sm font-medium">{performance.followUps?.total || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="text-sm font-medium">{performance.followUps?.completed || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Pending</span>
                <span className="text-sm font-medium">{performance.followUps?.pending || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Overdue</span>
                <span className="text-sm font-medium">{performance.followUps?.overdue || 0}</span>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold mb-4">Payments</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Collected</span>
                <span className="text-sm font-medium">₹{performance.payments?.collected?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Outstanding</span>
                <span className="text-sm font-medium">₹{performance.payments?.outstanding?.toLocaleString() || 0}</span>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold mb-4">Orders</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Created</span>
                <span className="text-sm font-medium">{performance.orders?.created || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="text-sm font-medium">{performance.orders?.completed || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Sales</span>
                <span className="text-sm font-medium">₹{performance.orders?.totalSales?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Average Order Value</span>
                <span className="text-sm font-medium">₹{performance.orders?.averageOrderValue?.toLocaleString() || 0}</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
