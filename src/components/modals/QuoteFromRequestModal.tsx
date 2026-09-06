import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Modal } from './Modal'
import { Button } from '../common/Button'
import { Input } from '../common/Input'
import { quotationsApi } from '../../api'

interface Props {
  isOpen: boolean
  onClose: () => void
  request: any
}

export const QuoteFromRequestModal = ({ isOpen, onClose, request }: Props) => {
  const queryClient = useQueryClient()
  const [rows, setRows] = useState<{ product: string; productName: string; quantity: number; discount: number; tax: number }[]>([])
  const [validityDays, setValidityDays] = useState(7)
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen && request) {
      setRows(request.items.map((it: any) => ({
        product: it.product?._id || it.product,
        productName: it.productName,
        quantity: it.quantity,
        discount: 0,
        tax: 0,
      })))
      setValidityDays(7)
      setNotes(request.notes || '')
      setError('')
    }
  }, [isOpen, request])

  const submit = useMutation({
    mutationFn: () => quotationsApi.createQuotation({
      customerProfileId: request.customerProfile?._id || request.customerProfile,
      items: rows.map((r) => ({ product: r.product, quantity: r.quantity, discount: r.discount, tax: r.tax })),
      validityDays,
      notes,
      // @ts-expect-error our extended field
      quotationRequestId: request._id,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotationRequests'] })
      queryClient.invalidateQueries({ queryKey: ['quotations'] })
      onClose()
    },
    onError: (err: any) => setError(err?.response?.data?.message || 'Failed to create quotation.'),
  })

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create quotation from request" size="lg">
      <form
        onSubmit={(e) => { e.preventDefault(); submit.mutate() }}
        className="space-y-4"
      >
        <p className="text-sm text-gray-600">
          For {request.customerProfile?.businessName || '—'} · {rows.length} item(s)
        </p>

        <div className="border border-gray-100 rounded-xl divide-y divide-gray-100">
          {rows.map((r, i) => (
            <div key={i} className="p-3 grid grid-cols-12 gap-2 items-center">
              <div className="col-span-5 text-sm">
                <p className="font-medium text-gray-900">{r.productName}</p>
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-semibold uppercase text-gray-500">Qty</label>
                <input
                  type="number" min={1}
                  value={r.quantity}
                  onChange={(e) => { const nx = [...rows]; nx[i].quantity = parseInt(e.target.value) || 1; setRows(nx) }}
                  className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm text-center"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-semibold uppercase text-gray-500">Discount %</label>
                <input
                  type="number" min={0} max={100}
                  value={r.discount}
                  onChange={(e) => { const nx = [...rows]; nx[i].discount = parseFloat(e.target.value) || 0; setRows(nx) }}
                  className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm text-center"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-semibold uppercase text-gray-500">Tax %</label>
                <input
                  type="number" min={0} max={100}
                  value={r.tax}
                  onChange={(e) => { const nx = [...rows]; nx[i].tax = parseFloat(e.target.value) || 0; setRows(nx) }}
                  className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm text-center"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input label="Valid for (days)" type="number" min={1} value={validityDays} onChange={(e) => setValidityDays(parseInt(e.target.value) || 7)} />
        </div>
        <Input label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />

        {error && <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm">{error}</div>}

        <div className="flex gap-2 justify-end">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={submit.isPending}>Create + send</Button>
        </div>
      </form>
    </Modal>
  )
}
