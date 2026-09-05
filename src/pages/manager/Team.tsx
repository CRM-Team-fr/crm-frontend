import { useQuery } from '@tanstack/react-query'
import { LoadingState } from '../../components/common/LoadingState'
import { performanceApi } from '../../api'

export const ManagerTeam = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['salespersonComparison'],
    queryFn: async () => {
      const response = await performanceApi.getSalespersonComparison()
      return response
    },
  })

  if (isLoading) return <LoadingState message="Loading team..." />

  const salespersons = data?.comparison || []

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Team Performance</h1>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Salesperson Comparison</h3>
        </div>
        <div className="p-6">
          {salespersons.length === 0 ? (
            <p className="text-gray-500 text-sm">No team data available</p>
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
        </div>
      </div>
    </div>
  )
}
