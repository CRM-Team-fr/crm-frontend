import { useQuery } from '@tanstack/react-query'
import { DataTable } from '../../components/tables/DataTable'
import { paymentsApi } from '../../api'

export const ManagerPayments = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const response = await paymentsApi.getPayments()
      return response
    },
  })

  const payments = data?.payments || []

  const columns = [
    {
      header: 'Payment',
      key: 'id',
      render: (item: any) => (
        <div>
          <p className="font-medium">#{item.id.slice(-6)}</p>
          <p className="text-sm text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</p>
        </div>
      ),
    },
    {
      header: 'Amount',
      key: 'amount',
      render: (item: any) => <span className="font-medium text-green-600">₹{item.amount?.toLocaleString()}</span>,
    },
    {
      header: 'Method',
      key: 'paymentMethod',
      render: (item: any) => <span className="capitalize">{item.paymentMethod?.replace('_', ' ')}</span>,
    },
    {
      header: 'Date',
      key: 'paymentDate',
      render: (item: any) => new Date(item.paymentDate).toLocaleDateString(),
    },
    {
      header: 'Reference',
      key: 'transactionReference',
      render: (item: any) => item.transactionReference || 'N/A',
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Payments</h1>

      <div className="bg-white rounded-lg border border-gray-200">
        <DataTable
          columns={columns}
          data={payments}
          keyExtractor={(item) => item.id}
          isLoading={isLoading}
          emptyMessage="No payments found"
        />
      </div>
    </div>
  )
}
