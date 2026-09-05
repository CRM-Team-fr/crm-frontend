import { useQuery } from '@tanstack/react-query'
import { DataTable } from '../../components/tables/DataTable'
import { Button } from '../../components/common/Button'
import { Modal } from '../../components/modals/Modal'
import { customersApi, authApi } from '../../api'
import { useMutation } from '@tanstack/react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useMemo, useState } from 'react'

export const AdminCustomers = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [removingCustomer, setRemovingCustomer] = useState<any>(null)
  const [error, setError] = useState<string>('')

  const q = searchParams.get('q') || ''

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['customers', statusFilter],
    queryFn: async () => {
      const response = await customersApi.getCustomers({ status: statusFilter || undefined, limit: 100 })
      return response
    },
  })

  const allCustomers = data?.customers || []
  const customers = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return allCustomers
    return allCustomers.filter((c: any) =>
      c.businessName?.toLowerCase().includes(needle) ||
      c.customerName?.toLowerCase().includes(needle) ||
      c.phoneNumber?.includes(needle)
    )
  }, [allCustomers, q])

  const cleanupMutation = useMutation({
    mutationFn: () => authApi.cleanupGhostCustomerUsers(),
    onSuccess: async (res: any) => {
      await refetch()
      setError('')
      alert(res?.message || 'Cleanup complete.')
    },
    onError: (err: any) => {
      setError(err?.response?.data?.message || 'Cleanup failed.')
    },
  })

  const handleRemove = async () => {
    if (!removingCustomer) return
    setError('')
    try {
      await customersApi.removeCustomer(removingCustomer.id)
      await refetch()
      setRemovingCustomer(null)
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Failed to remove customer.'
      setError(message)
    }
  }

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
      header: 'Status',
      key: 'status',
      render: (item: any) => (
        <span className={`capitalize px-2 py-1 rounded-full text-xs ${
          item.status === 'approved' ? 'bg-green-100 text-green-800' :
          item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {item.status || 'unknown'}
        </span>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (item: any) => (
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={() => navigate(`/admin/customers/${item.id}`)}>
            View
          </Button>
          {item.status === 'pending' && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => navigate(`/admin/customers/${item.id}`)}
            >
              Approve &amp; Assign
            </Button>
          )}
          {item.status === 'approved' && (
            <Button
              size="sm"
              variant="danger"
              onClick={() => setRemovingCustomer(item)}
            >
              Remove
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          {q && (
            <p className="text-sm text-gray-500 mt-1">
              Filtering by "<span className="font-semibold text-brand-700">{q}</span>" —{' '}
              <button
                onClick={() => setSearchParams({})}
                className="underline hover:text-gray-700"
              >
                clear
              </button>
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="suspended">Suspended</option>
          </select>
          <Button
            variant="outline"
            loading={cleanupMutation.isPending}
            onClick={() => {
              if (confirm('Delete customer users who never completed registration (no customer profile)?')) {
                cleanupMutation.mutate()
              }
            }}
          >
            Clean up ghosts
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200">
        <DataTable
          columns={columns}
          data={customers}
          keyExtractor={(item) => item.id}
          isLoading={isLoading}
          emptyMessage="No customers found"
        />
      </div>

      <Modal isOpen={!!removingCustomer} onClose={() => setRemovingCustomer(null)} title="Remove Customer" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to remove <strong>{removingCustomer?.businessName}</strong>? This will suspend the customer account. Historical orders, payments, and activities will remain intact.
          </p>
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => setRemovingCustomer(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleRemove} loading={false}>
              Remove Customer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
