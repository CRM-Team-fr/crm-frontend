import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { authApi } from '../../api'
import { LoadingState } from '../../components/common/LoadingState'
import { Card, CardBody } from '../../components/common/Card'
import { Badge } from '../../components/status/StatusBadge'
import {
  ArrowLeft, Users, Boxes, PhoneCall, ShoppingCart, FileText, IndianRupee, ClipboardList, Mail, ArrowUpRight, ArrowDownRight,
} from 'lucide-react'

const money = (n: any) => `₹${(n ?? 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`

const activityIcon: Record<string, any> = {
  call: PhoneCall, meeting: Users, note: FileText, email: Mail,
}

export const AdminEmployeeDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data, isLoading, error } = useQuery({
    queryKey: ['employeeActivity', id],
    queryFn: async () => authApi.getEmployeeActivity(id!),
    enabled: !!id,
    refetchOnWindowFocus: true,
  })

  if (isLoading) return <LoadingState message="Loading employee activity…" />
  if (error || !data) {
    return (
      <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm">
        Employee not found.
      </div>
    )
  }

  const {
    employee, totals, assignedCustomers, inventoryMovements,
    customerActivities, orders, quotations, payments, followUps,
  } = data

  return (
    <div className="space-y-6">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      {/* Header */}
      <div className="rounded-3xl gradient-brand-subtle border border-brand-100 p-6 flex flex-col md:flex-row md:items-center gap-4 justify-between">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl gradient-brand text-white grid place-items-center text-xl font-bold shadow-[var(--shadow-glow)]">
            {employee.Name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-display text-2xl font-extrabold text-gray-900">{employee.Name}</h1>
            <div className="mt-1 flex flex-wrap gap-2 text-sm text-gray-600">
              <Badge variant="brand" className="capitalize">{employee.role}</Badge>
              <Badge variant={employee.status === 'approved' ? 'success' : employee.status === 'suspended' ? 'danger' : 'warning'} className="capitalize">
                {employee.status}
              </Badge>
              <span>· {employee.email}</span>
              {employee.phoneNumber && <span>· {employee.phoneNumber}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Metric icon={Users}         label="Assigned customers" value={totals.assignedCustomers} />
        <Metric icon={IndianRupee}   label="Payments collected" value={money(totals.paymentsAmount)} />
        <Metric icon={ShoppingCart}  label="Orders placed"      value={`${totals.orders} · ${money(totals.ordersAmount)}`} />
        <Metric icon={FileText}      label="Quotations sent"    value={totals.quotations} />
      </div>

      {/* Assigned customers */}
      <Section title="Assigned customers" icon={Users} empty="Not assigned to any customer.">
        {assignedCustomers.length > 0 && (
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500 border-b border-gray-100">
                  <th className="py-3 pr-4">Business</th>
                  <th className="py-3 pr-4">Owner</th>
                  <th className="py-3 pr-4">Phone</th>
                  <th className="py-3 pr-4">Stage</th>
                  <th className="py-3 pr-4 text-right">Orders</th>
                  <th className="py-3 pr-4 text-right">Revenue</th>
                  <th className="py-3 pr-0 text-right">Outstanding</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {assignedCustomers.map((c: any) => (
                  <tr key={c.id} onClick={() => navigate(`/admin/customers/${c.id}`)} className="cursor-pointer hover:bg-surface-50">
                    <td className="py-3 pr-4 font-medium text-gray-900">{c.businessName}</td>
                    <td className="py-3 pr-4">{c.customerName || '—'}</td>
                    <td className="py-3 pr-4">{c.phoneNumber || '—'}</td>
                    <td className="py-3 pr-4"><span className="capitalize">{c.customerStage?.replace(/_/g, ' ')}</span></td>
                    <td className="py-3 pr-4 text-right">{c.totalOrders || 0}</td>
                    <td className="py-3 pr-4 text-right">{money(c.totalRevenue)}</td>
                    <td className="py-3 pr-0 text-right">{money(c.outstandingAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {/* Inventory movements */}
      <Section title="Inventory movements" icon={Boxes} empty="No stock changes made by this employee." count={inventoryMovements.length}>
        {inventoryMovements.length > 0 && (
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500 border-b border-gray-100">
                  <th className="py-3 pr-4">Product</th>
                  <th className="py-3 pr-4">Type</th>
                  <th className="py-3 pr-4 text-right">Qty</th>
                  <th className="py-3 pr-4 text-right">Stock before → after</th>
                  <th className="py-3 pr-4">Reason</th>
                  <th className="py-3 pr-0">When</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {inventoryMovements.map((m: any) => {
                  const positive = m.newStock >= m.previousStock
                  return (
                    <tr key={m.id}>
                      <td className="py-3 pr-4">
                        <p className="font-medium text-gray-900">{m.productName || '—'}</p>
                        <p className="text-[11px] text-gray-500">SKU · {m.productSKU || '—'}</p>
                      </td>
                      <td className="py-3 pr-4"><Badge variant={positive ? 'success' : 'warning'} className="capitalize">{m.type?.replace('_', ' ')}</Badge></td>
                      <td className={`py-3 pr-4 text-right font-semibold ${positive ? 'text-emerald-700' : 'text-rose-600'}`}>
                        {positive ? '+' : '−'}{m.quantity}
                        {positive ? <ArrowUpRight className="inline h-3.5 w-3.5 ml-1" /> : <ArrowDownRight className="inline h-3.5 w-3.5 ml-1" />}
                      </td>
                      <td className="py-3 pr-4 text-right text-gray-600">{m.previousStock} → <span className="font-semibold text-gray-900">{m.newStock}</span></td>
                      <td className="py-3 pr-4 text-gray-700">{m.reason || '—'}</td>
                      <td className="py-3 pr-0 text-gray-500">{new Date(m.createdAt).toLocaleString()}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {/* Customer activities */}
      <Section title="Customer contacts (calls / meetings / notes / emails)" icon={PhoneCall} empty="No customer contacts logged." count={customerActivities.length}>
        {customerActivities.length > 0 && (
          <ul className="divide-y divide-gray-100">
            {customerActivities.map((a: any) => {
              const Icon = activityIcon[a.activityType] || FileText
              return (
                <li key={a.id} className="py-3 flex items-start gap-3">
                  <span className="h-9 w-9 rounded-xl bg-brand-50 text-brand-700 grid place-items-center flex-none">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900">{a.title}</p>
                      <Badge variant="default" className="capitalize">{a.activityType}</Badge>
                    </div>
                    {a.description && <p className="text-sm text-gray-700 mt-0.5">{a.description}</p>}
                    <p className="text-xs text-gray-500 mt-1">
                      With <span className="font-medium">{a.customerBusinessName || '—'}</span>
                      {a.customerName ? ` (${a.customerName})` : ''} · {new Date(a.createdAt).toLocaleString()}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </Section>

      {/* Orders */}
      <Section title="Orders placed" icon={ShoppingCart} empty="No orders placed by this employee." count={orders.length}>
        {orders.length > 0 && (
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500 border-b border-gray-100">
                  <th className="py-3 pr-4">Order</th>
                  <th className="py-3 pr-4">Customer</th>
                  <th className="py-3 pr-4">Order status</th>
                  <th className="py-3 pr-4">Payment</th>
                  <th className="py-3 pr-0 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((o: any) => (
                  <tr key={o.id} onClick={() => navigate(`/admin/orders/${o.id}`)} className="cursor-pointer hover:bg-surface-50">
                    <td className="py-3 pr-4 font-semibold text-gray-900">#{String(o.id).slice(-6)}</td>
                    <td className="py-3 pr-4">{o.customerBusinessName || '—'}</td>
                    <td className="py-3 pr-4"><Badge dot variant={o.orderStatus === 'completed' ? 'success' : o.orderStatus === 'cancelled' ? 'danger' : 'info'} className="capitalize">{o.orderStatus}</Badge></td>
                    <td className="py-3 pr-4"><Badge variant={o.paymentStatus === 'paid' ? 'success' : 'default'} className="capitalize">{o.paymentStatus}</Badge></td>
                    <td className="py-3 pr-0 text-right font-semibold">{money(o.grandTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {/* Payments collected */}
      <Section title="Payments collected" icon={IndianRupee} empty="No payments recorded." count={payments.length}>
        {payments.length > 0 && (
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500 border-b border-gray-100">
                  <th className="py-3 pr-4">Payment</th>
                  <th className="py-3 pr-4">Customer</th>
                  <th className="py-3 pr-4">Method</th>
                  <th className="py-3 pr-4">Reference</th>
                  <th className="py-3 pr-0 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payments.map((p: any) => (
                  <tr key={p.id}>
                    <td className="py-3 pr-4 font-semibold text-gray-900">#{String(p.id).slice(-6)}</td>
                    <td className="py-3 pr-4">{p.customerBusinessName || '—'}</td>
                    <td className="py-3 pr-4"><Badge variant="info" className="capitalize">{(p.paymentMethod || '').replace('_', ' ')}</Badge></td>
                    <td className="py-3 pr-4 text-gray-600">{p.transactionReference || '—'}</td>
                    <td className="py-3 pr-0 text-right font-semibold text-emerald-700">{money(p.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {/* Quotations */}
      <Section title="Quotations sent" icon={FileText} empty="No quotations created." count={quotations.length}>
        {quotations.length > 0 && (
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500 border-b border-gray-100">
                  <th className="py-3 pr-4">Quotation</th>
                  <th className="py-3 pr-4">Customer</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 pr-0 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {quotations.map((q: any) => (
                  <tr key={q.id} onClick={() => navigate(`/admin/quotations/${q.id}`)} className="cursor-pointer hover:bg-surface-50">
                    <td className="py-3 pr-4 font-semibold text-gray-900">#{String(q.id).slice(-6)}</td>
                    <td className="py-3 pr-4">{q.customerBusinessName || '—'}</td>
                    <td className="py-3 pr-4"><Badge variant={q.status === 'accepted' ? 'success' : q.status === 'rejected' ? 'danger' : 'info'} className="capitalize">{q.status}</Badge></td>
                    <td className="py-3 pr-0 text-right font-semibold">{money(q.grandTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {/* Follow-ups */}
      <Section title="Follow-ups" icon={ClipboardList} empty="No follow-ups created." count={followUps.length}>
        {followUps.length > 0 && (
          <ul className="divide-y divide-gray-100">
            {followUps.map((f: any) => (
              <li key={f.id} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-900">{f.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {f.customerBusinessName || '—'} · {f.taskType} · due {new Date(f.followUpDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge variant={f.priority === 'high' ? 'danger' : f.priority === 'medium' ? 'warning' : 'default'} className="capitalize">{f.priority}</Badge>
                  <Badge variant={f.status === 'completed' ? 'success' : f.status === 'cancelled' ? 'danger' : 'warning'} className="capitalize">{f.status}</Badge>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  )
}

const Metric = ({ icon: Icon, label, value }: { icon: any; label: string; value: any }) => (
  <Card hover>
    <CardBody>
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
          <p className="mt-2 font-display text-xl font-bold text-gray-900 truncate">{value}</p>
        </div>
        <div className="h-11 w-11 rounded-xl bg-brand-50 text-brand-700 grid place-items-center flex-none">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </CardBody>
  </Card>
)

const Section = ({
  title, icon: Icon, empty, count, children,
}: { title: string; icon: any; empty: string; count?: number; children: React.ReactNode }) => (
  <Card>
    <CardBody>
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-xl bg-brand-50 text-brand-700 grid place-items-center">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="font-display text-lg font-bold text-gray-900">
          {title}{count != null && <span className="ml-2 text-sm font-medium text-gray-500">({count})</span>}
        </h3>
      </div>
      {(!children || (Array.isArray(children) && children.length === 0)) ? (
        <p className="text-sm text-gray-500">{empty}</p>
      ) : (
        <>{children || <p className="text-sm text-gray-500">{empty}</p>}</>
      )}
    </CardBody>
  </Card>
)
