import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { DataTable } from '../../components/tables/DataTable'
import { customersApi } from '../../api'
import { StageSelect } from '../../components/common/StageSelect'
import { CustomerTimeline } from '../../components/timeline/CustomerTimeline'

export const SalespersonCustomers = () => {
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['myCustomers'],
    queryFn: async () => {
      const response = await customersApi.getMyCustomers()
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
        <button onClick={() => navigate(`/salesperson/customers/${item.id}`)} className="text-blue-600 hover:underline text-sm">
          View
        </button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Customers</h1>

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

export const SalespersonCustomerDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['customer', id],
    queryFn: async () => {
      const response = await customersApi.getCustomerById(id!)
      return response.customer
    },
    enabled: !!id,
  })

  if (isLoading) return <div>Loading...</div>
  if (!data) return <div>Customer not found</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button onClick={() => navigate(-1)} className="text-sm text-gray-600 hover:text-gray-900 mb-2">
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{data.businessName}</h1>
          <p className="text-gray-600">{data.user?.Name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Business Name</p>
                  <p className="text-sm text-gray-900">{data.businessName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Business Type</p>
                  <p className="text-sm text-gray-900">{data.businessType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-sm text-gray-900">{data.user?.phoneNumber}</p>
                </div>
                <div>
                  <StageSelect
                    customerProfileId={data.id}
                    currentStage={data.customerStage}
                  />
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-sm text-gray-900">
                    {data.address}, {data.city}, {data.state} - {data.pincode}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <CustomerTimeline customerProfileId={data.id} />
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h3 className="text-lg font-semibold">Stats</h3>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Orders</span>
              <span className="text-sm font-medium">{data.totalOrders || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Revenue</span>
              <span className="text-sm font-medium">₹{data.totalRevenue?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Outstanding</span>
              <span className="text-sm font-medium">₹{data.outstandingAmount?.toLocaleString() || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
