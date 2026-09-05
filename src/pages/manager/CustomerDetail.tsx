import { useQuery } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { customersApi } from '../../api'
import { LoadingState } from '../../components/common/LoadingState'

export const ManagerCustomerDetail = () => {
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

  if (isLoading) return <LoadingState message="Loading customer..." />
  if (!data) return <div className="text-red-600">Customer not found</div>

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
                  <p className="text-sm text-gray-500">Stage</p>
                  <p className="text-sm text-gray-900 capitalize">{data.customerStage}</p>
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
