import { useQuery } from '@tanstack/react-query'
import { DataTable } from '../../components/tables/DataTable'
import { customersApi } from '../../api'
import { useNavigate } from 'react-router-dom'

export const ManagerCustomers = () => {
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const response = await customersApi.getCustomers()
      return response
    },
  })

  const customers = data?.customers || []

  const columns = [
    {
      header: 'Business Name',
      key: 'businessName',
      render: (item: any) => <span className="font-medium">{item.businessName}</span>,
    },
    {
      header: 'Owner',
      key: 'customerName',
      render: (item: any) => item.customerName,
    },
    {
      header: 'Phone',
      key: 'phoneNumber',
      render: (item: any) => item.phoneNumber,
    },
    {
      header: 'Stage',
      key: 'customerStage',
      render: (item: any) => <span className="capitalize">{item.customerStage}</span>,
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (item: any) => (
        <button onClick={() => navigate(`/manager/customers/${item.id}`)} className="text-blue-600 hover:underline text-sm">
          View
        </button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Customers</h1>

      <div className="bg-white rounded-lg border border-gray-200">
        <DataTable
          columns={columns}
          data={customers}
          keyExtractor={(item) => item.id}
          isLoading={isLoading}
          emptyMessage="No customers found"
        />
      </div>
    </div>
  )
}
