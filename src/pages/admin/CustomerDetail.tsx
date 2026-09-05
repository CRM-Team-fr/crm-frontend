import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { customersApi, authApi } from '../../api'
import { LoadingState } from '../../components/common/LoadingState'
import { Badge } from '../../components/status/StatusBadge'
import { Button } from '../../components/common/Button'
import { StageSelect } from '../../components/common/StageSelect'
import { CustomerTimeline } from '../../components/timeline/CustomerTimeline'
import { useState } from 'react'

export const AdminCustomerDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['customer', id],
    queryFn: async () => {
      const response = await customersApi.getCustomerById(id!)
      return response.customer
    },
    enabled: !!id,
  })

  const { data: employeesData } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const response = await authApi.getEmployees()
      return response
    },
  })

  const [assigning, setAssigning] = useState(false)
  const [changingStatus, setChangingStatus] = useState(false)
  const [error, setError] = useState<string>('')
  const [selectedSalespersonId, setSelectedSalespersonId] = useState('')

  const handleStatusChange = async (newStatus: 'approved' | 'suspended') => {
    if (!data?.user?.id) return
    setError('')
    setChangingStatus(true)
    try {
      await authApi.updateCustomerStatus(data.user.id, newStatus)
      await refetch()
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] })
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to update status.')
    } finally {
      setChangingStatus(false)
    }
  }

  const salespersons = employeesData?.employees?.filter((e: any) => e.role === 'salesperson') || []

  const handleApproveAndAssign = async () => {
    if (!data?.user?.id || !selectedSalespersonId) return
    setError('')
    setAssigning(true)
    try {
      await authApi.approveAndAssignCustomer(data.user.id, selectedSalespersonId)
      await refetch()
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] })
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Approval and assignment failed. Please try again.'
      setError(message)
    } finally {
      setAssigning(false)
    }
  }

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
        <div className="flex items-center gap-3">
          <Badge variant={data.user?.status === 'approved' ? 'success' : data.user?.status === 'suspended' ? 'danger' : 'warning'} className="capitalize">
            {data.user?.status}
          </Badge>
          {data.user?.status === 'approved' && (
            <Button
              variant="danger"
              size="sm"
              loading={changingStatus}
              onClick={() => handleStatusChange('suspended')}
            >
              Suspend
            </Button>
          )}
          {data.user?.status === 'suspended' && (
            <Button
              size="sm"
              loading={changingStatus}
              onClick={() => handleStatusChange('approved')}
            >
              Reinstate
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

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

            {data.user?.status === 'pending' && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-1">Approve customer</h3>
                <p className="text-xs text-gray-500 mb-4">
                  Every new customer must be assigned to a salesperson at the time of approval.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assign salesperson <span className="text-rose-600">*</span>
                    </label>
                    <select
                      value={selectedSalespersonId}
                      onChange={(e) => setSelectedSalespersonId(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      <option value="">Select a salesperson</option>
                      {salespersons.map((sp: any) => (
                        <option key={sp.id} value={sp.id}>{sp.Name}</option>
                      ))}
                    </select>
                    {!selectedSalespersonId && (
                      <p className="mt-1 text-xs text-gray-500">
                        Pick a salesperson to unlock the Approve button.
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={handleApproveAndAssign}
                    loading={assigning}
                    disabled={!selectedSalespersonId}
                  >
                    Approve &amp; Assign
                  </Button>
                </div>
              </div>
            )}
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
