import { useState, useEffect } from 'react'
import { Modal } from './Modal'
import { Button } from '../common/Button'
import { Input } from '../common/Input'
import { paymentsApi } from '../../api'

interface RecordPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  orderId: string
}

export const RecordPaymentModal = ({ isOpen, onClose, orderId }: RecordPaymentModalProps) => {
  const [formData, setFormData] = useState({
    orderId,
    amount: '',
    paymentMethod: 'cash',
    paymentDate: new Date().toISOString().split('T')[0],
    transactionReference: '',
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (orderId) {
      setFormData((prev) => ({ ...prev, orderId }))
    }
  }, [orderId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await paymentsApi.createPayment({
        ...formData,
        amount: parseFloat(formData.amount),
      })
      onClose()
      setFormData({
        orderId,
        amount: '',
        paymentMethod: 'cash',
        paymentDate: new Date().toISOString().split('T')[0],
        transactionReference: '',
        notes: '',
      })
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to record payment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Payment">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>}

        <Input
          label="Amount"
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
          <select
            value={formData.paymentMethod}
            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="cash">Cash</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="upi">UPI</option>
            <option value="card">Card</option>
            <option value="cheque">Cheque</option>
            <option value="online">Online</option>
          </select>
        </div>

        <Input
          label="Payment Date"
          type="date"
          value={formData.paymentDate}
          onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
          required
        />

        <Input
          label="Transaction Reference"
          value={formData.transactionReference}
          onChange={(e) => setFormData({ ...formData, transactionReference: e.target.value })}
        />

        <Input
          label="Notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />

        <Button type="submit" className="w-full" loading={loading}>
          Record Payment
        </Button>
      </form>
    </Modal>
  )
}
