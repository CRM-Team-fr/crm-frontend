import { useState } from 'react'
import { Modal } from './Modal'
import { Button } from '../common/Button'
import { Input } from '../common/Input'
import { ordersApi } from '../../api'
import { useAuth } from '../../context/AuthContext'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface QuickOrderModalProps {
  isOpen: boolean
  onClose: () => void
  product: any
}

export const QuickOrderModal = ({ isOpen, onClose, product }: QuickOrderModalProps) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [confirmation, setConfirmation] = useState<null | { orderId: string; total: number }>(null)

  const customerProfileId = user?.customerProfileId

  const place = useMutation({
    mutationFn: () =>
      ordersApi.createOrder({
        customerProfileId: customerProfileId!,
        items: [{ product: product.id, quantity, discount: 0, tax: 0 }],
        notes,
      }),
    onSuccess: (res: any) => {
      const order = res?.order || res
      setConfirmation({ orderId: order?.id || order?._id || '', total: order?.grandTotal || 0 })
      queryClient.invalidateQueries({ queryKey: ['customerOrders'] })
      queryClient.invalidateQueries({ queryKey: ['customerDashboard'] })
    },
    onError: (err: any) => {
      setError(err?.response?.data?.message || 'Failed to place order.')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!customerProfileId) {
      setError('Your customer profile could not be found. Please sign out and back in.')
      return
    }
    if (quantity < 1) {
      setError('Quantity must be at least 1.')
      return
    }
    if (product?.stock != null && quantity > product.stock) {
      setError(`Only ${product.stock} in stock.`)
      return
    }
    place.mutate()
  }

  const handleClose = () => {
    setQuantity(1)
    setNotes('')
    setError('')
    setConfirmation(null)
    onClose()
  }

  const subtotal = (product?.sellingPrice || 0) * quantity

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Place Order" size="md">
      {confirmation ? (
        <div className="space-y-4 text-center py-4">
          <div className="mx-auto h-14 w-14 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center text-2xl">✓</div>
          <p className="font-display text-lg font-bold text-gray-900">Order placed!</p>
          <p className="text-sm text-gray-600">
            Order #{String(confirmation.orderId).slice(-6)} · ₹{confirmation.total.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">Your salesperson has been notified and will confirm shortly.</p>
          <Button onClick={handleClose} className="mx-auto">Done</Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-xl bg-surface-50 border border-gray-100 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">{product?.category}</p>
            <p className="font-semibold text-gray-900 mt-0.5">{product?.name}</p>
            <p className="text-sm text-gray-500">SKU · {product?.SKU}</p>
            <p className="mt-2 font-display text-xl font-extrabold text-gray-900">
              ₹{product?.sellingPrice?.toLocaleString()} <span className="text-xs font-medium text-gray-500">/ {product?.unit || 'unit'}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">In stock: {product?.stock}</p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm">{error}</div>
          )}

          <Input
            label="Quantity"
            type="number"
            min={1}
            max={product?.stock}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            required
          />

          <Input
            label="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Delivery instructions, preferred date…"
          />

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="text-sm text-gray-600">Estimated total</span>
            <span className="font-display text-2xl font-bold text-gray-900">₹{subtotal.toLocaleString()}</span>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={handleClose}>Cancel</Button>
            <Button type="submit" loading={place.isPending}>Place Order</Button>
          </div>
        </form>
      )}
    </Modal>
  )
}
