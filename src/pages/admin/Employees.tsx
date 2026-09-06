import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { DataTable } from '../../components/tables/DataTable'
import { Button } from '../../components/common/Button'
import { Modal } from '../../components/modals/Modal'
import { Input } from '../../components/common/Input'
import { authApi } from '../../api'

export const AdminEmployees = () => {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ Name: '', email: '', phoneNumber: '', role: 'salesperson' })
  const [error, setError] = useState('')
  const [removingEmployee, setRemovingEmployee] = useState<any>(null)
  const [removeError, setRemoveError] = useState('')
  const [createdEmployee, setCreatedEmployee] = useState<null | { Name: string; email: string; temporaryPassword?: string; emailSent?: boolean; emailError?: string | null }>(null)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const response = await authApi.getEmployees()
      return response
    },
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => authApi.createEmployee(data),
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      setIsModalOpen(false)
      setCreatedEmployee({
        Name: formData.Name,
        email: formData.email,
        temporaryPassword: res?.temporaryPassword,
        emailSent: res?.emailSent,
        emailError: res?.emailError,
      })
      setFormData({ Name: '', email: '', phoneNumber: '', role: 'salesperson' })
      setError('')
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.errors?.[0]?.msg ||
        err?.response?.data?.message ||
        err?.message ||
        'Failed to create employee.'
      setError(msg)
    },
  })

  const removeMutation = useMutation({
    mutationFn: (employeeId: string) => authApi.removeEmployee(employeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      setRemovingEmployee(null)
      setRemoveError('')
    },
  })

  const reactivateMutation = useMutation({
    mutationFn: (employeeId: string) => authApi.reactivateEmployee(employeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
    },
  })

  const hardDeleteMutation = useMutation({
    mutationFn: (employeeId: string) => authApi.hardDeleteEmployee(employeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || 'Failed to delete employee.')
    },
  })

  const employees = data?.employees || []

  const columns = [
    {
      header: 'Name',
      key: 'Name',
      render: (item: any) => <span className="font-medium">{item.Name}</span>,
    },
    {
      header: 'Email',
      key: 'email',
      render: (item: any) => item.email,
    },
    {
      header: 'Phone',
      key: 'phoneNumber',
      render: (item: any) => item.phoneNumber,
    },
    {
      header: 'Role',
      key: 'role',
      render: (item: any) => <span className="capitalize">{item.role}</span>,
    },
    {
      header: 'Status',
      key: 'status',
      render: (item: any) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          item.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {item.status}
        </span>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (item: any) => (
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={() => navigate(`/admin/employees/${item.id}`)}>
            View
          </Button>
          {item.status !== 'suspended' && item.role !== 'admin' && (
            <Button
              size="sm"
              variant="danger"
              onClick={() => { setRemoveError(''); setRemovingEmployee(item); }}
            >
              Deactivate
            </Button>
          )}
          {item.status === 'suspended' && item.role !== 'admin' && (
            <Button
              size="sm"
              loading={reactivateMutation.isPending && reactivateMutation.variables === item.id}
              onClick={() => reactivateMutation.mutate(item.id)}
            >
              Reactivate
            </Button>
          )}
          {item.role !== 'admin' && (
            <Button
              size="sm"
              variant="danger"
              loading={hardDeleteMutation.isPending && hardDeleteMutation.variables === item.id}
              onClick={() => {
                if (confirm(`Permanently delete ${item.Name}? This cannot be undone.`)) {
                  hardDeleteMutation.mutate(item.id)
                }
              }}
            >
              Delete
            </Button>
          )}
        </div>
      ),
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    createMutation.mutate(formData)
  }

  const handleRemove = async () => {
    if (!removingEmployee) return
    setRemoveError('')
    try {
      await removeMutation.mutateAsync(removingEmployee.id)
    } catch (err: any) {
      setRemoveError(err.response?.data?.message || 'Failed to deactivate employee.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
        <Button onClick={() => setIsModalOpen(true)}>Add Employee</Button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200">
        <DataTable
          columns={columns}
          data={employees}
          keyExtractor={(item) => item.id}
          isLoading={isLoading}
          emptyMessage="No employees found"
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Employee">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>}
          <Input label="Name" value={formData.Name} onChange={(e) => setFormData({ ...formData, Name: e.target.value })} required />
          <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
          <Input label="Phone Number" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} required />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="salesperson">Salesperson</option>
              <option value="manager">Manager</option>
            </select>
          </div>
          <Button type="submit" className="w-full" loading={createMutation.isPending}>
            Create Employee
          </Button>
        </form>
      </Modal>

      <Modal
        isOpen={!!createdEmployee}
        onClose={() => setCreatedEmployee(null)}
        title="Employee created"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            <strong>{createdEmployee?.Name}</strong> ({createdEmployee?.email}) has been created.
          </p>
          {createdEmployee?.emailSent === true && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-800">
              ✓ Welcome email sent to <strong>{createdEmployee.email}</strong>. Ask them to check spam if they don't see it.
            </div>
          )}
          {createdEmployee?.emailSent === false && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-sm text-rose-800">
              ⚠ Welcome email FAILED to send. Share the temporary password manually.
              {createdEmployee.emailError && (
                <p className="mt-1 text-xs text-rose-700">Reason: {createdEmployee.emailError}</p>
              )}
            </div>
          )}
          {createdEmployee?.temporaryPassword && (
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 mb-1">Temporary password</p>
              <p className="font-mono text-lg text-amber-900">{createdEmployee.temporaryPassword}</p>
              <p className="mt-2 text-xs text-amber-800">
                Share this with the employee. They will be asked to change it on first login.
              </p>
            </div>
          )}
          <div className="flex justify-end">
            <Button onClick={() => setCreatedEmployee(null)}>Done</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!removingEmployee} onClose={() => { setRemovingEmployee(null); setRemoveError(''); }} title="Deactivate Employee" size="sm">
        <div className="space-y-4">
          {removeError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {removeError}
            </div>
          )}
          {!removeError && (
            <p className="text-sm text-gray-600">
              Are you sure you want to deactivate <strong>{removingEmployee?.Name}</strong>? This will suspend the employee account. Historical records will remain intact.
            </p>
          )}
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => { setRemovingEmployee(null); setRemoveError(''); }}>Cancel</Button>
            {!removeError && (
              <Button variant="danger" onClick={handleRemove} loading={removeMutation.isPending}>
                Deactivate
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  )
}