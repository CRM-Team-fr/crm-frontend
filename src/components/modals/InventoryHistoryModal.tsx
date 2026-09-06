import { useQuery } from '@tanstack/react-query'
import { Modal } from './Modal'
import { Badge } from '../status/StatusBadge'
import { productsApi } from '../../api'
import { ArrowUpRight, ArrowDownRight, User as UserIcon, PackageOpen } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

interface Props {
  isOpen: boolean
  onClose: () => void
  productId: string
}

/** How each raw movement type is presented to a human */
const typeLabel: Record<string, string> = {
  stock_in: 'Restocked',
  returned: 'Customer return',
  order: 'Sold (order)',
  stock_out: 'Manual issue',
  damaged: 'Damaged / lost',
  adjustment: 'Manual adjustment',
  cancellation: 'Order cancelled',
}
const typeVariant: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'brand'> = {
  stock_in: 'success',
  returned: 'success',
  order: 'info',
  stock_out: 'warning',
  damaged: 'danger',
  adjustment: 'warning',
  cancellation: 'brand',
}

export const InventoryHistoryModal = ({ isOpen, onClose, productId }: Props) => {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['inventoryMovements', productId],
    queryFn: async () => productsApi.getInventoryMovements(productId),
    enabled: isOpen && !!productId,
    refetchOnWindowFocus: true,
    refetchInterval: 20_000,
  })

  const movements: any[] = data?.movements || []

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Inventory history" size="xl">
      <div className="space-y-4">
        {/* Header block — product summary */}
        <div className="rounded-2xl border border-gray-100 bg-surface-50 p-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Product</p>
              <p className="mt-0.5 font-display text-lg font-bold text-gray-900">{data?.productName || '—'}</p>
              <p className="text-xs text-gray-500">SKU · {data?.productSKU || '—'}</p>
            </div>
            <div className="flex items-end gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Current stock</p>
                <p className="mt-0.5 font-display text-2xl font-extrabold text-gray-900">{data?.currentStock ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Minimum</p>
                <p className="mt-0.5 font-display text-lg font-semibold text-gray-700">{data?.minimumStock ?? '—'}</p>
              </div>
              {data?.stockStatus && (
                <Badge
                  dot
                  variant={data.stockStatus === 'in_stock' ? 'success' : data.stockStatus === 'low_stock' ? 'warning' : 'danger'}
                  className="capitalize"
                >
                  {String(data.stockStatus).replace(/_/g, ' ')}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {movements.length} movement{movements.length === 1 ? '' : 's'} recorded
            {isFetching && <span className="ml-2 text-brand-600 text-xs">refreshing…</span>}
          </p>
          <button
            onClick={() => refetch()}
            className="text-sm font-semibold text-brand-700 hover:text-brand-800"
          >
            Refresh
          </button>
        </div>

        {isLoading ? (
          <p className="text-sm text-gray-500 py-6 text-center">Loading history…</p>
        ) : movements.length === 0 ? (
          <div className="text-center py-10">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-surface-100 text-gray-500 grid place-items-center mb-3">
              <PackageOpen className="h-5 w-5" />
            </div>
            <p className="font-semibold text-gray-900">No movements yet</p>
            <p className="text-sm text-gray-500 mt-1">All stock changes for this product will show up here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6 px-6 max-h-[60vh] overflow-y-auto">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500 border-b border-gray-100">
                  <th className="py-3 pr-4">Date &amp; time</th>
                  <th className="py-3 pr-4">Action</th>
                  <th className="py-3 pr-4 text-right">Qty</th>
                  <th className="py-3 pr-4 text-right">Previous → New</th>
                  <th className="py-3 pr-4">Reason</th>
                  <th className="py-3 pr-4">Reference</th>
                  <th className="py-3 pr-0">Performed by</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {movements.map((m) => {
                  const positive = (m.newStock ?? 0) >= (m.previousStock ?? 0)
                  const label = typeLabel[m.type] || m.type
                  const variant = typeVariant[m.type] || 'default'
                  return (
                    <tr key={m.id} className="align-top">
                      <td className="py-3 pr-4 text-gray-600 whitespace-nowrap">
                        {new Date(m.createdAt).toLocaleString('en-IN', {
                          day: '2-digit', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3 pr-4">
                        <Badge variant={variant}>{label}</Badge>
                      </td>
                      <td className={`py-3 pr-4 text-right font-semibold whitespace-nowrap ${positive ? 'text-emerald-700' : 'text-rose-600'}`}>
                        {positive ? '+' : '−'}{m.quantity}
                        {positive
                          ? <ArrowUpRight className="inline h-3.5 w-3.5 ml-1" />
                          : <ArrowDownRight className="inline h-3.5 w-3.5 ml-1" />}
                      </td>
                      <td className="py-3 pr-4 text-right text-gray-600 whitespace-nowrap">
                        {m.previousStock ?? '—'} → <span className="font-semibold text-gray-900">{m.newStock ?? '—'}</span>
                      </td>
                      <td className="py-3 pr-4 text-gray-700">{m.reason || '—'}</td>
                      <td className="py-3 pr-4 text-gray-600 text-xs font-mono">
                        {m.reference ? `#${String(m.reference).slice(-6)}` : '—'}
                      </td>
                      <td className="py-3 pr-0">
                        {m.performedBy?.Name ? (
                          <div className="flex items-center gap-2">
                            <UserIcon className="h-3.5 w-3.5 text-gray-400" />
                            <div>
                              <p className="text-gray-900 leading-tight">{m.performedBy.Name}</p>
                              {isAdmin && m.performedBy.role && (
                                <p className="text-[10px] text-gray-500 capitalize leading-tight">{m.performedBy.role}</p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Modal>
  )
}
