import { useState } from 'react'
import { Modal } from './Modal'
import { Button } from '../common/Button'
import { Input } from '../common/Input'
import { returnsApi } from '../../api'

interface CreateReturnModalProps {
  isOpen: boolean
  onClose: () => void
}

export const CreateReturnModal = ({ isOpen, onClose }: CreateReturnModalProps) => {
  const [formData, setFormData] = useState({
    orderId: '',
    items: [{ product: '', quantity: 1 }],
    returnType: 'full',
    reason: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await returnsApi.createOrderReturn(formData)
      onClose()
      setFormData({ orderId: '', items: [{ product: '', quantity: 1 }], returnType: 'full', reason: '' })
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create return')
    } finally {
      setLoading(false)
    }
  }

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { product: '', quantity: 1 }],
    })
  }

  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    })
  }

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...formData.items]
    newItems[index] = { ...newItems[index], [field]: value }
    setFormData({ ...formData, items: newItems })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Return" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>}

        <Input
          label="Order ID"
          value={formData.orderId}
          onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
          required
        />

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Items</label>
            <Button type="button" size="sm" variant="ghost" onClick={addItem}>
              Add Item
            </Button>
          </div>
          {formData.items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 mb-2">
              <div className="col-span-7">
                <input
                  type="text"
                  placeholder="Product ID"
                  value={item.product}
                  onChange={(e) => updateItem(index, 'product', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="col-span-3">
                <input
                  type="number"
                  placeholder="Quantity"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="col-span-2 flex items-center">
                {formData.items.length > 1 && (
                  <button type="button" onClick={() => removeItem(index)} className="text-red-600 hover:text-red-800">
                    ×
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Return Type</label>
          <select
            value={formData.returnType}
            onChange={(e) => setFormData({ ...formData, returnType: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="full">Full Return</option>
            <option value="partial">Partial Return</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
          <textarea
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            required
          />
        </div>

        <Button type="submit" className="w-full" loading={loading}>
          Create Return
        </Button>
      </form>
    </Modal>
  )
}
