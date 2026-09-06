import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Modal } from './Modal'
import { Button } from '../common/Button'
import { Input } from '../common/Input'
import { productsApi, quotationRequestsApi } from '../../api'

interface Props {
  isOpen: boolean
  onClose: () => void
  customerProfileId: string
}

interface Row {
  productId: string
  quantity: number
}

export const RequestQuotationModal = ({ isOpen, onClose, customerProfileId }: Props) => {
  const queryClient = useQueryClient()
  const { data: productsData } = useQuery({
    queryKey: ['products'],
    queryFn: async () => productsApi.getProducts(),
    enabled: isOpen,
  })
  const products: any[] = productsData?.products || []
  const activeProducts = products.filter((p) => p.status === 'active')

  const [rows, setRows] = useState<Row[]>([{ productId: '', quantity: 1 }])
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setRows([{ productId: '', quantity: 1 }])
      setNotes('')
      setError('')
    }
  }, [isOpen])

  const submit = useMutation({
    mutationFn: () =>
      quotationRequestsApi.create({
        customerProfileId,
        items: rows.map((r) => ({ product: r.productId, quantity: r.quantity })),
        notes,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotationRequests'] })
      onClose()
    },
    onError: (err: any) => setError(err?.response?.data?.message || 'Failed to submit.'),
  })

  const canSubmit = rows.every((r) => r.productId && r.quantity > 0) && rows.length > 0

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request quotation" size="lg">
      <form
        onSubmit={(e) => { e.preventDefault(); setError(''); if (!canSubmit) { setError('Fill product + quantity for every row.'); return } submit.mutate() }}
        className="space-y-4"
      >
        <p className="text-sm text-gray-600">
          Pick products and how many you'd like a quote on. Your salesperson will get the request and route it to the manager.
        </p>

        <div className="space-y-2">
          {rows.map((row, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center">
              <select
                value={row.productId}
                onChange={(e) => {
                  const next = [...rows]; next[i] = { ...next[i], productId: e.target.value }; setRows(next)
                }}
                className="col-span-7 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-brand-100 focus:border-brand-400"
                required
              >
                <option value="">Choose product</option>
                {activeProducts.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} · ₹{p.sellingPrice}</option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                value={row.quantity}
                onChange={(e) => {
                  const next = [...rows]; next[i] = { ...next[i], quantity: parseInt(e.target.value) || 1 }; setRows(next)
                }}
                className="col-span-3 px-3 py-2 border border-gray-200 rounded-xl text-sm text-center"
                placeholder="Qty"
              />
              {rows.length > 1 && (
                <button
                  type="button"
                  onClick={() => setRows(rows.filter((_, idx) => idx !== i))}
                  className="col-span-2 text-rose-600 text-sm"
                >Remove</button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => setRows([...rows, { productId: '', quantity: 1 }])}
            className="text-sm font-semibold text-brand-700 hover:text-brand-800"
          >
            + Add another item
          </button>
        </div>

        <Input label="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any special ask — delivery timing, bulk price…" />

        {error && <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm">{error}</div>}

        <div className="flex gap-2 justify-end">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={submit.isPending}>Send request</Button>
        </div>
      </form>
    </Modal>
  )
}
