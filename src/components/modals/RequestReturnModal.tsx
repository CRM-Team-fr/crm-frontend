import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Modal } from './Modal'
import { Button } from '../common/Button'
import { Input } from '../common/Input'
import { ordersApi, returnsApi } from '../../api'

interface RequestReturnModalProps {
  isOpen: boolean
  onClose: () => void
  orderId: string
}

export const RequestReturnModal = ({ isOpen, onClose, orderId }: RequestReturnModalProps) => {
  const queryClient = useQueryClient()
  const { data: orderData, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const res = await ordersApi.getOrderById(orderId)
      return res.order || res
    },
    enabled: isOpen && !!orderId,
  })

  const [reason, setReason] = useState('')
  const [selected, setSelected] = useState<Record<string, number>>({})
  const [error, setError] = useState('')
  const [confirmation, setConfirmation] = useState<null | { id: string }>(null)

  useEffect(() => {
    if (isOpen) {
      setReason('')
      setSelected({})
      setError('')
      setConfirmation(null)
    }
  }, [isOpen])

  const items: any[] = orderData?.items || []
  const anyItemsSelected = Object.values(selected).some((q) => q > 0)
  const totalSelectedQty = items.reduce((s, it) => s + (selected[it.id || it._id] || 0), 0)
  const totalOrderQty = items.reduce((s, it) => s + it.quantity, 0)
  const isFullReturn = totalSelectedQty > 0 && totalSelectedQty === totalOrderQty

  const create = useMutation({
    mutationFn: () => {
      const returnItems = items
        .map((it) => {
          const id = it.id || it._id
          const q = selected[id] || 0
          return q > 0 ? { product: it.product?._id || it.product, quantity: q } : null
        })
        .filter(Boolean) as { product: string; quantity: number }[]
      return returnsApi.createOrderReturn({
        orderId,
        items: returnItems,
        returnType: isFullReturn ? 'full' : 'partial',
        reason: reason.trim(),
      })
    },
    onSuccess: (res: any) => {
      const r = res?.return || res?.orderReturn || res
      setConfirmation({ id: r?.id || r?._id || '' })
      queryClient.invalidateQueries({ queryKey: ['customerReturns'] })
      queryClient.invalidateQueries({ queryKey: ['order', orderId] })
    },
    onError: (err: any) => setError(err?.response?.data?.message || 'Failed to create return.'),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!anyItemsSelected) { setError('Pick at least one item to return.'); return }
    if (reason.trim().length < 5) { setError('Please tell us why (5+ characters).'); return }
    create.mutate()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request return" size="lg">
      {isLoading ? (
        <p className="text-sm text-gray-500">Loading order…</p>
      ) : confirmation ? (
        <div className="text-center space-y-3 py-4">
          <div className="mx-auto h-14 w-14 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center text-2xl">✓</div>
          <p className="font-display text-lg font-bold text-gray-900">Return request filed</p>
          <p className="text-sm text-gray-600">
            Return #{String(confirmation.id).slice(-6)} · your seller will review it shortly.
          </p>
          <Button onClick={onClose} className="mx-auto">Done</Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="rounded-xl bg-surface-50 border border-gray-100 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Order</p>
            <p className="font-semibold text-gray-900">#{String(orderId).slice(-6)}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Pick items to return</p>
            <div className="divide-y divide-gray-100 rounded-xl border border-gray-100">
              {items.map((it) => {
                const id = it.id || it._id
                const qty = selected[id] || 0
                return (
                  <div key={id} className="p-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">{it.productName}</p>
                      <p className="text-xs text-gray-500">Ordered: {it.quantity} · ₹{it.unitPrice} each</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => setSelected({ ...selected, [id]: Math.max(0, qty - 1) })} className="h-9 w-9 rounded-lg border border-gray-200 bg-white font-bold hover:bg-surface-50" aria-label="Decrease">−</button>
                      <input
                        type="number"
                        min={0}
                        max={it.quantity}
                        value={qty}
                        onChange={(e) => {
                          const n = Math.min(it.quantity, Math.max(0, parseInt(e.target.value) || 0))
                          setSelected({ ...selected, [id]: n })
                        }}
                        className="w-16 text-center px-2 py-1.5 border border-gray-200 rounded-lg text-sm"
                      />
                      <button type="button" onClick={() => setSelected({ ...selected, [id]: Math.min(it.quantity, qty + 1) })} className="h-9 w-9 rounded-lg border border-gray-200 bg-white font-bold hover:bg-surface-50" aria-label="Increase">+</button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <Input
              label="Why are you returning?"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Damaged, wrong item, quality issue…"
              required
              hint={isFullReturn ? 'Full return — the order will be cancelled once completed.' : totalSelectedQty > 0 ? 'Partial return.' : undefined}
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm">{error}</div>
          )}

          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" loading={create.isPending} disabled={!anyItemsSelected}>Submit return</Button>
          </div>
        </form>
      )}
    </Modal>
  )
}
