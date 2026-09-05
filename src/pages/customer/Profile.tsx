import { useQuery } from '@tanstack/react-query'
import { LoadingState } from '../../components/common/LoadingState'
import { customersApi } from '../../api'
import { useAuth } from '../../context/AuthContext'

export const CustomerProfile = () => {
  const { user } = useAuth()

  const customerProfileId = user?.customerProfileId

  const { data, isLoading } = useQuery({
    queryKey: ['customerProfile', customerProfileId],
    queryFn: async () => {
      if (!customerProfileId) throw new Error('Customer profile not found')
      const response = await customersApi.getCustomerById(customerProfileId)
      return response.customer
    },
    enabled: !!customerProfileId,
  })

  if (isLoading) return <LoadingState message="Loading profile..." />
  if (!data) return <div className="text-red-600">Profile not found</div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="text-sm text-gray-900">{data.user?.Name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="text-sm text-gray-900">{data.user?.phoneNumber}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Business Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Business Name</p>
              <p className="text-sm text-gray-900">{data.businessName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Business Type</p>
              <p className="text-sm text-gray-900">{data.businessType}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Address</p>
              <p className="text-sm text-gray-900">{data.address}, {data.city}, {data.state} - {data.pincode}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
