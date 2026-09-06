import { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Modal } from './Modal'
import { Button } from '../common/Button'
import { Input } from '../common/Input'
import { productsApi } from '../../api'

interface StockAdjustmentModalProps {
  isOpen: boolean
  onClose: () => void
  productId: string
  currentStock: number
}

// Friendly labels → backend enum values
const MOVEMENT_TYPES: Array<{ value: string; label: string; direction: '+' | '−' }> = [
  { value: 'stock_in',   label: 'Restock (add to inventory)',         direction: '+' },
  { value: 'returned',   label: 'Customer return (add back)',          direction: '+' },
  { value: 'stock_out',  label: 'Manual issue / sold offline (remove)', direction: '−' },
  { value: 'damaged',    label: 'Damaged / lost (remove)',              direction: '−' },
  { value: 'adjustment', label: 'Manual adjustment (remove)',           direction: '−' },
]

export const StockAdjustmentModal = ({ isOpen, onClose, productId, currentStock }: StockAdjustmentModalProps) => {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    type: 'stock_in',
    quantity: '',
    reason: '',
    reference: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setFormData({ type: 'stock_in', quantity: '', reason: '', reference: '' })
      setError('')
    }
  }, [isOpen])

  const selectedType = MOVEMENT_TYPES.find((t) => t.value === formData.type)!
  const qty = parseInt(formData.quantity) || 0
  const projected = selectedType.direction === '+' ? currentStock + qty : currentStock - qty

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (qty < 1) {
      setError('Quantity must be at least 1.')
      return
    }
    if (selectedType.direction === '−' && qty > currentStock) {
      setError(`Cannot remove more than current stock (${currentStock}).`)
      return
    }
    setLoading(true)
    try {
      await productsApi.adjustStock(productId, {
        type: formData.type,
        quantity: qty,
        reason: formData.reason,
        reference: formData.reference || undefined,
      })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product', productId] })
      queryClient.invalidateQueries({ queryKey: ['inventoryMovements', productId] })
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] })
      onClose()
    } catch (err: any) {
      const msg =
        err?.response?.data?.errors?.[0]?.msg ||
        err?.response?.data?.message ||
        'Failed to adjust stock.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adjust Stock">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm">{error}</div>
        )}

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
            Movement type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-brand-100 focus:border-brand-400"
          >
            {MOVEMENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.direction}  {t.label}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Quantity"
          type="number"
          min={1}
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
          required
        />

        <div className="grid grid-cols-2 gap-3 rounded-xl bg-surface-50 border border-gray-100 p-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Current</p>
            <p className="mt-1 font-display text-lg font-bold text-gray-900">{currentStock}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">After</p>
            <p className={`mt-1 font-display text-lg font-bold ${projected < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
              {qty ? projected : currentStock}
            </p>
          </div>
        </div>

        <Input
          label="Reason (optional)"
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          placeholder="e.g. New production batch, damaged in transit…"
        />

        <Input
          label="Reference (optional)"
          value={formData.reference}
          onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
          placeholder="PO number, invoice #, etc."
        />

        <Button type="submit" className="w-full" loading={loading}>
          Save adjustment
        </Button>
      </form>
    </Modal>
  )
}
