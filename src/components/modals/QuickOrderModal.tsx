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
  // qtyRaw holds the raw input string so the user can clear + retype freely
  const [qtyRaw, setQtyRaw] = useState('1')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [confirmation, setConfirmation] = useState<null | { orderId: string; total: number }>(null)

  const customerProfileId = user?.customerProfileId
  const productTax: number = product?.tax ?? 0
  const quantity = parseInt(qtyRaw) || 0

  const place = useMutation({
    mutationFn: () =>
      ordersApi.createOrder({
        customerProfileId: customerProfileId!,
        items: [{
          product: product.id,
          quantity,
          discount: 0,
          // Use the product's configured tax when the customer places the order.
          tax: productTax,
        }],
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
    setQtyRaw('1')
    setNotes('')
    setError('')
    setConfirmation(null)
    onClose()
  }

  const price = product?.sellingPrice || 0
  const subtotal = price * quantity
  const taxAmount = subtotal * (productTax / 100)
  const grandTotal = subtotal + taxAmount

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
              ₹{price.toLocaleString()} <span className="text-xs font-medium text-gray-500">/ {product?.unit || 'unit'}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">In stock: {product?.stock}</p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm">{error}</div>
          )}

          {/* Quantity: qty stepper you can type into freely */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Quantity</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQtyRaw(String(Math.max(1, quantity - 1)))}
                className="h-10 w-10 rounded-xl border border-gray-200 bg-white text-lg font-bold hover:bg-surface-50 disabled:opacity-50"
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <Input
                type="number"
                min={1}
                max={product?.stock}
                value={qtyRaw}
                onChange={(e) => setQtyRaw(e.target.value)}
                onBlur={() => { if (!qtyRaw || parseInt(qtyRaw) < 1) setQtyRaw('1') }}
                className="text-center flex-1"
                required
              />
              <button
                type="button"
                onClick={() => {
                  const next = quantity + 1
                  if (product?.stock == null || next <= product.stock) setQtyRaw(String(next))
                }}
                className="h-10 w-10 rounded-xl border border-gray-200 bg-white text-lg font-bold hover:bg-surface-50 disabled:opacity-50"
                disabled={product?.stock != null && quantity >= product.stock}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          <Input
            label="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Delivery instructions, preferred date…"
          />

          {/* Bill summary */}
          <div className="rounded-xl bg-surface-50 border border-gray-100 p-4 space-y-1.5 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal ({quantity} × ₹{price.toLocaleString()})</span>
              <span>₹{subtotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
            </div>
            {productTax > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Tax ({productTax}%)</span>
                <span>₹{taxAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="text-gray-700 font-semibold">Grand total</span>
              <span className="font-display text-xl font-extrabold text-gray-900">
                ₹{grandTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </span>
            </div>
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
