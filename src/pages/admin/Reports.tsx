import { useQuery } from '@tanstack/react-query'
import { LoadingState } from '../../components/common/LoadingState'
import { Card, CardBody } from '../../components/common/Card'
import { reportsApi } from '../../api'

export const AdminReports = () => {
  const { data: salesReport, isLoading: salesLoading } = useQuery({
    queryKey: ['salesReport'],
    queryFn: () => reportsApi.getSalesReport(),
  })

  const { data: customerReport, isLoading: customerLoading } = useQuery({
    queryKey: ['customerReport'],
    queryFn: () => reportsApi.getCustomerReport(),
  })

  const isLoading = salesLoading || customerLoading

  if (isLoading) return <LoadingState message="Loading reports..." />

  const sales = salesReport?.report || {}
  const customersReport = customerReport?.report || {}
  const customersList = customersReport.customers || []
  const newCustomers = customersList.filter((c: any) => c.customerStage === 'new').length
  const activeCustomers = customersList.filter((c: any) => c.customerStage !== 'new' && c.customerStage !== 'lost').length

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Reports</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold mb-4">Sales Report</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Orders</span>
                <span className="text-sm font-medium">{sales.totalOrders || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Revenue</span>
                <span className="text-sm font-medium">₹{sales.totalRevenue?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Average Order Value</span>
                <span className="text-sm font-medium">₹{sales.averageOrderValue?.toLocaleString() || 0}</span>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold mb-4">Customer Report</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Customers</span>
                <span className="text-sm font-medium">{customersReport.totalCustomers || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">New Customers</span>
                <span className="text-sm font-medium">{newCustomers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Active Customers</span>
                <span className="text-sm font-medium">{activeCustomers}</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
