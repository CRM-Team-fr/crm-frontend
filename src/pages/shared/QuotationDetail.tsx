import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { quotationsApi } from '../../api'
import { LoadingState } from '../../components/common/LoadingState'
import { Card, CardBody } from '../../components/common/Card'
import { Badge } from '../../components/status/StatusBadge'
import { ArrowLeft, FileText, Receipt, UserIcon } from 'lucide-react'

const variantOf = (s: string) =>
  s === 'accepted' ? 'success' :
  s === 'rejected' ? 'danger' :
  s === 'converted' ? 'brand' :
  s === 'sent' ? 'info' : 'default'

export const QuotationDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data, isLoading, error } = useQuery({
    queryKey: ['quotation', id],
    queryFn: async () => {
      const res = await quotationsApi.getQuotationById(id!)
      return res.quotation || res
    },
    enabled: !!id,
  })

  if (isLoading) return <LoadingState message="Loading quotation…" />
  if (error || !data) {
    return (
      <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm">
        Quotation not found.
      </div>
    )
  }

  const q: any = data
  const items: any[] = q.items || []
  const money = (n: any) => `₹${(n ?? 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <h1 className="font-display text-3xl font-extrabold text-gray-900">Quotation #{String(q.id).slice(-6)}</h1>
          <p className="text-sm text-gray-500 mt-1">Created {new Date(q.createdAt).toLocaleString()}</p>
        </div>
        <Badge dot variant={variantOf(q.status)} className="capitalize">{q.status}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardBody>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-brand-50 text-brand-700 grid place-items-center">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-gray-900">Items ({items.length})</h3>
            </div>
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500 border-b border-gray-100">
                    <th className="py-3 pr-4">Product</th>
                    <th className="py-3 pr-4 text-right">Qty</th>
                    <th className="py-3 pr-4 text-right">Unit price</th>
                    <th className="py-3 pr-4 text-right">Discount</th>
                    <th className="py-3 pr-4 text-right">Tax</th>
                    <th className="py-3 pr-0 text-right">Line total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((it: any) => (
                    <tr key={it.id || it._id}>
                      <td className="py-3 pr-4 font-medium">{it.productName}</td>
                      <td className="py-3 pr-4 text-right font-semibold">{it.quantity}</td>
                      <td className="py-3 pr-4 text-right">{money(it.unitPrice)}</td>
                      <td className="py-3 pr-4 text-right">{it.discount ? `${it.discount}%` : '—'}</td>
                      <td className="py-3 pr-4 text-right">{it.tax ? `${it.tax}%` : '—'}</td>
                      <td className="py-3 pr-0 text-right font-semibold">{money(it.lineTotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardBody>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-brand-50 text-brand-700 grid place-items-center">
                  <Receipt className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-bold text-gray-900">Bill summary</h3>
              </div>
              <dl className="space-y-2 text-sm">
                <Row label="Subtotal" value={money(q.subtotal)} />
                <Row label="Discount" value={`− ${money(q.discount)}`} tone="rose" />
                <Row label="Tax"      value={money(q.tax)} />
                <div className="border-t border-gray-200 pt-3 mt-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Grand total</span>
                  <span className="font-display text-2xl font-extrabold text-gray-900">{money(q.grandTotal)}</span>
                </div>
              </dl>
              {q.validUntil && (
                <p className="mt-3 text-xs text-gray-500">Valid until {new Date(q.validUntil).toLocaleDateString()}</p>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-brand-50 text-brand-700 grid place-items-center">
                  <UserIcon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-bold text-gray-900">Parties</h3>
              </div>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Customer</p>
                  <p className="mt-1 font-semibold text-gray-900">{(q.customerProfileId || q.customerProfile)?.businessName || '—'}</p>
                  {(q.customerProfileId || q.customerProfile)?.user?.Name && <p className="text-gray-600">{(q.customerProfileId || q.customerProfile).user.Name}</p>}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Salesperson</p>
                  <p className="mt-1 font-semibold text-gray-900">{q.salesperson?.Name || '—'}</p>
                </div>
              </div>
              {q.notes && (
                <div className="mt-4 rounded-xl bg-surface-50 border border-gray-100 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Notes</p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{q.notes}</p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}

const Row = ({ label, value, tone }: { label: string; value: string; tone?: 'rose' }) => (
  <div className="flex items-center justify-between">
    <dt className="text-gray-600">{label}</dt>
    <dd className={`font-semibold ${tone === 'rose' ? 'text-rose-600' : 'text-gray-900'}`}>{value}</dd>
  </div>
)
