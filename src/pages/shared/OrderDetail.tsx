import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { ordersApi } from '../../api'
import { LoadingState } from '../../components/common/LoadingState'
import { Card, CardBody } from '../../components/common/Card'
import { Badge } from '../../components/status/StatusBadge'
import { Button } from '../../components/common/Button'
import { ArrowLeft, ShoppingBag, User as UserIcon, Package, Receipt } from 'lucide-react'

const statusVariant = (s: string) =>
  s === 'completed' ? 'success' :
  s === 'cancelled' ? 'danger' :
  s === 'processing' ? 'info' :
  s === 'confirmed' ? 'brand' : 'warning'

const paymentVariant = (s: string) =>
  s === 'paid' ? 'success' :
  s === 'partial' ? 'warning' :
  s === 'overdue' ? 'danger' : 'default'

export const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data, isLoading, error } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const res = await ordersApi.getOrderById(id!)
      return res.order || res
    },
    enabled: !!id,
  })

  if (isLoading) return <LoadingState message="Loading order…" />
  if (error || !data) {
    return (
      <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm">
        Order could not be loaded. It may have been removed.
      </div>
    )
  }

  const order: any = data
  const items: any[] = order.items || []

  const money = (n: number | undefined) =>
    `₹${(n ?? 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <h1 className="font-display text-3xl font-extrabold text-gray-900">
            Order #{String(order.id).slice(-6)}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Placed {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 justify-end">
          <Badge dot variant={statusVariant(order.orderStatus)} className="capitalize">{order.orderStatus}</Badge>
          <Badge variant={paymentVariant(order.paymentStatus)} className="capitalize">{order.paymentStatus}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: items */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardBody>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-brand-50 text-brand-700 grid place-items-center">
                  <ShoppingBag className="h-5 w-5" />
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
                      <tr key={it.id || it._id} className="text-gray-800">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-surface-100 text-gray-500 grid place-items-center">
                              <Package className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{it.productName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-right font-semibold">{it.quantity}</td>
                        <td className="py-3 pr-4 text-right">{money(it.unitPrice)}</td>
                        <td className="py-3 pr-4 text-right">{it.discount ? `${it.discount}%` : '—'}</td>
                        <td className="py-3 pr-4 text-right">{it.tax ? `${it.tax}%` : '—'}</td>
                        <td className="py-3 pr-0 text-right font-semibold text-gray-900">{money(it.lineTotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>

          {order.notes && (
            <Card>
              <CardBody>
                <h3 className="font-semibold text-gray-900 mb-1">Notes</h3>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{order.notes}</p>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Right: summary + parties */}
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
                <Row label="Subtotal" value={money(order.subtotal)} />
                <Row label="Discount" value={`− ${money(order.discount)}`} tone="rose" />
                <Row label="Tax"      value={money(order.tax)} />
                <div className="border-t border-gray-200 pt-3 mt-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Grand total</span>
                  <span className="font-display text-2xl font-extrabold text-gray-900">
                    {money(order.grandTotal)}
                  </span>
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
                  <p className="mt-1 font-semibold text-gray-900">
                    {(order.customerProfileId || order.customerProfile)?.businessName || '—'}
                  </p>
                  {(order.customerProfileId || order.customerProfile)?.user?.Name && (
                    <p className="text-gray-600">{(order.customerProfileId || order.customerProfile).user.Name}</p>
                  )}
                  {(order.customerProfileId || order.customerProfile)?.user?.phoneNumber && (
                    <p className="text-gray-600">{(order.customerProfileId || order.customerProfile).user.phoneNumber}</p>
                  )}
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Salesperson</p>
                  <p className="mt-1 font-semibold text-gray-900">{order.salesperson?.Name || '—'}</p>
                  {order.salesperson?.email && (
                    <p className="text-gray-600">{order.salesperson.email}</p>
                  )}
                </div>

                {order.createdBy?.Name && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Placed by</p>
                    <p className="mt-1 font-semibold text-gray-900">{order.createdBy.Name}</p>
                  </div>
                )}

                {order.quotation && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">From quotation</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`../quotations/${order.quotation.id || order.quotation._id}`)}
                    >
                      View quotation
                    </Button>
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

const Row = ({ label, value, tone }: { label: string; value: string; tone?: 'rose' }) => (
  <div className="flex items-center justify-between">
    <dt className="text-gray-600">{label}</dt>
    <dd className={`font-semibold ${tone === 'rose' ? 'text-rose-600' : 'text-gray-900'}`}>{value}</dd>
  </div>
)
