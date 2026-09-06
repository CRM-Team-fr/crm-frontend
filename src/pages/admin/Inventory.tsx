import { useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { LoadingState } from '../../components/common/LoadingState'
import { Card, CardBody } from '../../components/common/Card'
import { Badge } from '../../components/status/StatusBadge'
import { Button } from '../../components/common/Button'
import { productsApi } from '../../api'
import { getImageUrl } from '../../api/client'
import { StockAdjustmentModal } from '../../components/modals'
import { InventoryHistoryModal } from '../../components/modals/InventoryHistoryModal'
import { Boxes, PackageX, PackageOpen, ArrowDownUp, ImageOff, Search, History } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

type Filter = 'all' | 'low_stock' | 'out_of_stock' | 'in_stock'

export const AdminInventory = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const [adjust, setAdjust] = useState<null | { id: string; stock: number }>(null)
  const [historyId, setHistoryId] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => productsApi.getProducts(),
  })

  const products: any[] = data?.products || []

  const lowStock = products.filter((p) => p.stockStatus === 'low_stock')
  const outOfStock = products.filter((p) => p.stockStatus === 'out_of_stock')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((p) => {
      if (filter !== 'all' && p.stockStatus !== filter) return false
      if (!q) return true
      return p.name?.toLowerCase().includes(q) || p.SKU?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q)
    })
  }, [products, filter, query])

  if (isLoading) return <LoadingState message="Loading inventory…" />

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-gray-900">Inventory</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <SummaryTile icon={Boxes}       tone="brand"   label="Total products" value={products.length} onClick={() => setFilter('all')} active={filter === 'all'} />
        <SummaryTile icon={PackageOpen} tone="amber"   label="Low stock"      value={lowStock.length}  onClick={() => setFilter('low_stock')} active={filter === 'low_stock'} />
        <SummaryTile icon={PackageX}    tone="rose"    label="Out of stock"   value={outOfStock.length} onClick={() => setFilter('out_of_stock')} active={filter === 'out_of_stock'} />
      </div>

      <Card>
        <CardBody>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <div>
              <h3 className="font-display text-lg font-bold text-gray-900">
                {filter === 'all' ? 'All products' :
                 filter === 'low_stock' ? 'Low stock' :
                 filter === 'out_of_stock' ? 'Out of stock' : 'In stock'}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">{filtered.length} item(s)</p>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, SKU, category…"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-brand-100 focus:border-brand-400"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="text-gray-500 text-sm py-10 text-center">No products match.</p>
          ) : (
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500 border-b border-gray-100">
                    <th className="py-3 pr-4">Product</th>
                    <th className="py-3 pr-4">Category</th>
                    <th className="py-3 pr-4 text-right">In stock</th>
                    <th className="py-3 pr-4 text-right">Minimum</th>
                    <th className="py-3 pr-4">Status</th>
                    <th className="py-3 pr-0 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((p) => {
                    const stockVariant =
                      p.stockStatus === 'in_stock' ? 'success' :
                      p.stockStatus === 'low_stock' ? 'warning' : 'danger'
                    return (
                      <tr key={p.id}>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-surface-100 overflow-hidden grid place-items-center text-gray-400">
                              {p.image ? (
                                <img src={getImageUrl(p.image)} alt={p.name} className="h-full w-full object-cover" />
                              ) : (
                                <ImageOff className="h-4 w-4" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{p.name}</p>
                              <p className="text-[11px] text-gray-500">SKU · {p.SKU}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-gray-700">{p.category || '—'}</td>
                        <td className="py-3 pr-4 text-right font-semibold">{p.stock}</td>
                        <td className="py-3 pr-4 text-right text-gray-500">{p.minimumStock}</td>
                        <td className="py-3 pr-4">
                          <Badge dot variant={stockVariant} className="capitalize">
                            {(p.stockStatus || 'unknown').replace(/_/g, ' ')}
                          </Badge>
                        </td>
                        <td className="py-3 pr-0 text-right whitespace-nowrap">
                          <div className="inline-flex gap-2">
                            <Button size="sm" variant="ghost" onClick={() => setHistoryId(p.id)}>
                              <History className="h-3.5 w-3.5" />
                              History
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => navigate(`/admin/products/${p.id}`)}>
                              View
                            </Button>
                            <Button size="sm" onClick={() => setAdjust({ id: p.id, stock: p.stock })}>
                              <ArrowDownUp className="h-3.5 w-3.5" />
                              Restock
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      {historyId && (
        <InventoryHistoryModal
          isOpen={!!historyId}
          onClose={() => setHistoryId(null)}
          productId={historyId}
        />
      )}

      <StockAdjustmentModal
        isOpen={!!adjust}
        onClose={() => {
          setAdjust(null)
          queryClient.invalidateQueries({ queryKey: ['products'] })
        }}
        productId={adjust?.id ?? ''}
        currentStock={adjust?.stock ?? 0}
      />
    </div>
  )
}

const SummaryTile = ({
  icon: Icon, tone, label, value, onClick, active,
}: {
  icon: any; tone: 'brand' | 'amber' | 'rose'; label: string; value: number | string
  onClick?: () => void; active?: boolean
}) => {
  const tones = {
    brand: 'bg-brand-50 text-brand-700',
    amber: 'bg-amber-50 text-amber-700',
    rose:  'bg-rose-50 text-rose-700',
  }
  return (
    <button
      onClick={onClick}
      className={`text-left w-full rounded-2xl border p-5 transition-all hover:-translate-y-0.5 ${
        active ? 'border-brand-300 shadow-[var(--shadow-lift)] bg-white' : 'border-gray-100 bg-white shadow-[var(--shadow-soft)]'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
          <p className="mt-2 font-display text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`h-11 w-11 rounded-xl grid place-items-center ${tones[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </button>
  )
}
