import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { returnsApi } from '../../api'
import { LoadingState } from '../../components/common/LoadingState'
import { Card, CardBody } from '../../components/common/Card'
import { Badge } from '../../components/status/StatusBadge'
import { ArrowLeft, RotateCcw, Receipt, UserIcon } from 'lucide-react'

const variantOf = (s: string) =>
  s === 'approved' ? 'success' :
  s === 'rejected' ? 'danger' :
  s === 'completed' ? 'brand' :
  s === 'pending' ? 'warning' : 'default'

export const ReturnDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data, isLoading, error } = useQuery({
    queryKey: ['return', id],
    queryFn: async () => {
      const res = await returnsApi.getReturnById(id!)
      return res.return || res
    },
    enabled: !!id,
  })

  if (isLoading) return <LoadingState message="Loading return…" />
  if (error || !data) {
    return (
      <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm">
        Return not found.
      </div>
    )
  }

  const r: any = data
  const items: any[] = r.items || []
  const money = (n: any) => `₹${(n ?? 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
  const total = items.reduce((sum, it) => sum + (it.lineTotal || 0), 0)

  const cp = r.customerProfile
  const salesperson = cp?.assignedSalesperson || r.order?.salesperson

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <h1 className="font-display text-3xl font-extrabold text-gray-900">
            Return #{String(r.id).slice(-6)}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Filed {new Date(r.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 justify-end">
          <Badge dot variant={variantOf(r.status)} className="capitalize">{r.status}</Badge>
          <Badge variant="brand" className="capitalize">{r.returnType}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardBody>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-brand-50 text-brand-700 grid place-items-center">
                  <RotateCcw className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-bold text-gray-900">Returned items ({items.length})</h3>
              </div>

              <div className="overflow-x-auto -mx-6 px-6">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500 border-b border-gray-100">
                      <th className="py-3 pr-4">Product</th>
                      <th className="py-3 pr-4 text-right">Qty returned</th>
                      <th className="py-3 pr-4 text-right">Unit price</th>
                      <th className="py-3 pr-0 text-right">Line total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {items.map((it: any) => (
                      <tr key={it.id || it._id}>
                        <td className="py-3 pr-4 font-medium text-gray-900">{it.productName}</td>
                        <td className="py-3 pr-4 text-right font-semibold">{it.quantity}</td>
                        <td className="py-3 pr-4 text-right">{money(it.unitPrice)}</td>
                        <td className="py-3 pr-0 text-right font-semibold">{money(it.lineTotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>

          {r.reason && (
            <Card>
              <CardBody>
                <h3 className="font-semibold text-gray-900 mb-1">Reason for return</h3>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{r.reason}</p>
              </CardBody>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardBody>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-brand-50 text-brand-700 grid place-items-center">
                  <Receipt className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-bold text-gray-900">Return summary</h3>
              </div>
              <dl className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-gray-600">Return type</dt>
                  <dd className="font-semibold text-gray-900 capitalize">{r.returnType}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-gray-600">Items</dt>
                  <dd className="font-semibold text-gray-900">{items.length}</dd>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Total value</span>
                  <span className="font-display text-2xl font-extrabold text-gray-900">{money(total)}</span>
                </div>
              </dl>
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
                  <p className="mt-1 font-semibold text-gray-900">{cp?.businessName || '—'}</p>
                  {cp?.user?.Name && <p className="text-gray-600">{cp.user.Name}</p>}
                  {cp?.user?.phoneNumber && <p className="text-gray-600">{cp.user.phoneNumber}</p>}
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Assigned salesperson</p>
                  <p className="mt-1 font-semibold text-gray-900">{salesperson?.Name || '—'}</p>
                  {salesperson?.email && <p className="text-gray-600">{salesperson.email}</p>}
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Original order</p>
                  <button
                    onClick={() => navigate(`../orders/${r.orderId || r.order?._id || r.order?.id}`)}
                    className="mt-1 text-sm font-semibold text-brand-700 hover:text-brand-800"
                  >
                    View order #{String(r.orderId || r.order?._id || r.order?.id || '').slice(-6)}
                  </button>
                  {r.order?.grandTotal != null && (
                    <p className="text-xs text-gray-500 mt-0.5">Order total {money(r.order.grandTotal)}</p>
                  )}
                </div>

                {r.createdBy?.Name && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Filed by</p>
                    <p className="mt-1 font-semibold text-gray-900 capitalize">
                      {r.createdBy.Name} <span className="text-gray-500 text-xs">({r.createdBy.role})</span>
                    </p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
