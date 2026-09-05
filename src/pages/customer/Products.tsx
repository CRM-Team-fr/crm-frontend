import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { productsApi } from '../../api'
import { getImageUrl } from '../../api/client'
import { Badge } from '../../components/status/StatusBadge'
import { Card } from '../../components/common/Card'
import { LoadingState } from '../../components/common/LoadingState'
import { Search, Package, ImageOff, ShoppingBag } from 'lucide-react'
import { QuickOrderModal } from '../../components/modals/QuickOrderModal'

export const CustomerProducts = () => {
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [category, setCategory] = useState<string>('')
  const [buyingProduct, setBuyingProduct] = useState<any>(null)

  useEffect(() => {
    const q = searchParams.get('q')
    if (q != null) setQuery(q)
  }, [searchParams])

  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => productsApi.getProducts(),
  })

  const products: any[] = data?.products || []

  const categories = useMemo(() => {
    const set = new Set<string>()
    products.forEach((p) => p.category && set.add(p.category))
    return Array.from(set)
  }, [products])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((p) => {
      if (category && p.category !== category) return false
      if (!q) return true
      return (
        p.name?.toLowerCase().includes(q) ||
        p.SKU?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      )
    })
  }, [products, query, category])

  return (
    <div className="space-y-6">
      {/* Header + search */}
      <div className="rounded-3xl gradient-brand-subtle border border-brand-100 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-end gap-4 md:justify-between">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-brand-700">Catalog</p>
            <h1 className="font-display text-3xl md:text-4xl font-extrabold text-gray-900 mt-1">
              Browse our products
            </h1>
            <p className="mt-1 text-sm text-gray-600">Handpicked wholesale essentials, freshly restocked.</p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, SKU or category…"
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-full text-sm placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-brand-100 focus:border-brand-400"
            />
          </div>
        </div>

        {/* Category chips */}
        {categories.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            <Chip active={category === ''} onClick={() => setCategory('')}>All</Chip>
            {categories.map((c) => (
              <Chip key={c} active={category === c} onClick={() => setCategory(c)}>
                {c}
              </Chip>
            ))}
          </div>
        )}
      </div>

      {isLoading ? (
        <LoadingState message="Loading products…" />
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-surface-100 text-gray-500 grid place-items-center mb-3">
            <Package className="h-5 w-5" />
          </div>
          <p className="font-semibold text-gray-900">No products found</p>
          <p className="text-sm text-gray-500 mt-1">Try a different search or category.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} onBuy={() => setBuyingProduct(p)} />
          ))}
        </div>
      )}

      {buyingProduct && (
        <QuickOrderModal
          isOpen={!!buyingProduct}
          onClose={() => setBuyingProduct(null)}
          product={buyingProduct}
        />
      )}
    </div>
  )
}

const Chip = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-colors ${
      active
        ? 'bg-brand-600 text-white shadow-[var(--shadow-glow)]'
        : 'bg-white text-gray-700 border border-gray-200 hover:border-brand-300 hover:text-brand-700'
    }`}
  >
    {children}
  </button>
)

const ProductCard = ({ product, onBuy }: { product: any; onBuy: () => void }) => {
  const stockVariant =
    product.stockStatus === 'in_stock' ? 'success' :
    product.stockStatus === 'low_stock' ? 'warning' : 'danger'
  const stockLabel = (product.stockStatus || 'unknown').replace(/_/g, ' ')
  const outOfStock = product.stockStatus === 'out_of_stock' || product.stock === 0

  return (
    <Card hover className="overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative aspect-square bg-gradient-to-br from-surface-100 to-surface-200">
        {product.image ? (
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-gray-400">
            <ImageOff className="h-8 w-8" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge variant={stockVariant} dot className="capitalize">{stockLabel}</Badge>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-700">
          {product.category || '—'}
        </p>
        <h3 className="mt-1 font-semibold text-gray-900 line-clamp-2 min-h-[2.75rem]">{product.name}</h3>
        <p className="text-[11px] text-gray-500 mt-0.5">SKU · {product.SKU}</p>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="font-display text-xl font-extrabold text-gray-900">
            ₹{product.sellingPrice?.toLocaleString()}
          </span>
          <span className="text-[11px] text-gray-500">/{product.unit || 'unit'}</span>
        </div>
        <button
          disabled={outOfStock}
          onClick={onBuy}
          className="mt-4 inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-full text-sm font-semibold gradient-brand text-white shadow-[var(--shadow-glow)] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingBag className="h-4 w-4" />
          {outOfStock ? 'Out of stock' : 'Buy now'}
        </button>
      </div>
    </Card>
  )
}
