import { useState, useEffect } from 'react'
import { Modal } from './Modal'
import { Button } from '../common/Button'
import { Input } from '../common/Input'
import { followUpsApi, customersApi } from '../../api'
import type { Customer } from '../../types'

interface CreateFollowUpModalProps {
  isOpen: boolean
  onClose: () => void
  customerId?: string
}

export const CreateFollowUpModal = ({ isOpen, onClose, customerId }: CreateFollowUpModalProps) => {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [formData, setFormData] = useState({
    customerProfileId: customerId || '',
    title: '',
    description: '',
    followUpDate: '',
    taskType: 'follow_up',
    priority: 'medium',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen && !customerId) {
      customersApi.getCustomers().then((res) => setCustomers(res.customers || []))
    }
  }, [isOpen, customerId])

  useEffect(() => {
    if (customerId) {
      setFormData((prev) => ({ ...prev, customerProfileId: customerId }))
    }
  }, [customerId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await followUpsApi.createFollowUp(formData)
      onClose()
      setFormData({ customerProfileId: customerId || '', title: '', description: '', followUpDate: '', taskType: 'follow_up', priority: 'medium' })
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create follow-up')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Follow-up">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>}

        {!customerId && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
            <select
              value={formData.customerProfileId}
              onChange={(e) => setFormData({ ...formData, customerProfileId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.businessName}
                </option>
              ))}
            </select>
          </div>
        )}

        <Input
          label="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <Input
          label="Follow-up Date"
          type="date"
          value={formData.followUpDate}
          onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Task Type</label>
          <select
            value={formData.taskType}
            onChange={(e) => setFormData({ ...formData, taskType: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="call">Call</option>
            <option value="visit">Visit</option>
            <option value="email">Email</option>
            <option value="follow_up">Follow-up</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <Button type="submit" className="w-full" loading={loading}>
          Create Follow-up
        </Button>
      </form>
    </Modal>
  )
}
