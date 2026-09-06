import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { LoadingState } from '../../components/common/LoadingState'
import { Card, CardBody } from '../../components/common/Card'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'
import { customersApi } from '../../api'
import { useAuth } from '../../context/AuthContext'
import { Pencil, X } from 'lucide-react'

export const CustomerProfile = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
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

  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    Name: '',
    businessName: '',
    businessType: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    alternatePhoneNumber: '',
  })
  const [error, setError] = useState('')

  useEffect(() => {
    if (data && editing) {
      setForm({
        Name: data.user?.Name || '',
        businessName: data.businessName || '',
        businessType: data.businessType || '',
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        pincode: data.pincode || '',
        alternatePhoneNumber: data.alternatePhoneNumber || '',
      })
    }
  }, [data, editing])

  const save = useMutation({
    mutationFn: () => customersApi.updateMyProfile(form),
    onSuccess: () => {
      setEditing(false)
      setError('')
      queryClient.invalidateQueries({ queryKey: ['customerProfile', customerProfileId] })
    },
    onError: (err: any) => setError(err?.response?.data?.message || 'Failed to save changes.'),
  })

  if (isLoading) return <LoadingState message="Loading profile…" />
  if (!data) return <div className="text-rose-600">Profile not found</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-gray-900">My profile</h1>
        {!editing ? (
          <Button variant="outline" onClick={() => setEditing(true)}>
            <Pencil className="h-4 w-4" /> Edit profile
          </Button>
        ) : (
          <Button variant="ghost" onClick={() => { setEditing(false); setError('') }}>
            <X className="h-4 w-4" /> Cancel
          </Button>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm">{error}</div>
      )}

      {editing ? (
        <Card>
          <CardBody>
            <form
              onSubmit={(e) => { e.preventDefault(); save.mutate() }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Your name" value={form.Name} onChange={(e) => setForm({ ...form, Name: e.target.value })} required />
                <Input label="Alternate phone (optional)" value={form.alternatePhoneNumber} onChange={(e) => setForm({ ...form, alternatePhoneNumber: e.target.value })} />
                <Input label="Business name" value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} required />
                <Input label="Business type" value={form.businessType} onChange={(e) => setForm({ ...form, businessType: e.target.value })} required />
              </div>
              <Input label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
              <div className="grid grid-cols-3 gap-4">
                <Input label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
                <Input label="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} required />
                <Input label="Pincode" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} required />
              </div>
              <p className="text-xs text-gray-500">
                To change your registered phone number, contact your salesperson or admin.
              </p>
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" onClick={() => { setEditing(false); setError('') }}>Cancel</Button>
                <Button type="submit" loading={save.isPending}>Save changes</Button>
              </div>
            </form>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardBody>
              <h3 className="font-display text-lg font-bold text-gray-900 mb-4">Personal</h3>
              <Field label="Name" value={data.user?.Name} />
              <Field label="Phone" value={data.user?.phoneNumber} />
              {data.alternatePhoneNumber && <Field label="Alternate phone" value={data.alternatePhoneNumber} />}
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <h3 className="font-display text-lg font-bold text-gray-900 mb-4">Business</h3>
              <Field label="Business name" value={data.businessName} />
              <Field label="Business type" value={data.businessType} />
              <Field label="Address" value={`${data.address}, ${data.city}, ${data.state} — ${data.pincode}`} />
            </CardBody>
          </Card>
          {data.assignedSalesperson && (
            <Card className="lg:col-span-2">
              <CardBody>
                <h3 className="font-display text-lg font-bold text-gray-900 mb-4">Your assigned salesperson</h3>
                <Field label="Name" value={data.assignedSalesperson.Name} />
                {data.assignedSalesperson.email && <Field label="Email" value={data.assignedSalesperson.email} />}
                {data.assignedSalesperson.phoneNumber && <Field label="Phone" value={data.assignedSalesperson.phoneNumber} />}
              </CardBody>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

const Field = ({ label, value }: { label: string; value?: string }) => (
  <div className="mb-3 last:mb-0">
    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
    <p className="mt-1 text-sm text-gray-900">{value || '—'}</p>
  </div>
)
