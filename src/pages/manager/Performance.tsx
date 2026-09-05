import { useQuery } from '@tanstack/react-query'
import { LoadingState } from '../../components/common/LoadingState'
import { Card, CardBody } from '../../components/common/Card'
import { performanceApi } from '../../api'

export const ManagerPerformance = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['salespersonComparison'],
    queryFn: async () => {
      const response = await performanceApi.getSalespersonComparison()
      return response
    },
  })

  if (isLoading) return <LoadingState message="Loading performance..." />

  const salespersons = data?.comparison || []

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Performance</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold mb-4">Salesperson Ranking</h3>
            {salespersons.length === 0 ? (
              <p className="text-gray-500 text-sm">No salesperson data available</p>
            ) : (
              <div className="space-y-3">
                {salespersons.map((sp: any, idx: number) => (
                  <div key={sp.salespersonId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-500">#{idx + 1}</span>
                      <div>
                        <p className="font-medium">{sp.salespersonName}</p>
                        <p className="text-sm text-gray-600">{sp.totalOrders} orders</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{sp.totalSales?.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">{sp.conversionRate}% conversion</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
