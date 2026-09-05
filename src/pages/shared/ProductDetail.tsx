import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { productsApi } from '../../api'
import { getImageUrl } from '../../api/client'
import { LoadingState } from '../../components/common/LoadingState'
import { Card, CardBody } from '../../components/common/Card'
import { Badge } from '../../components/status/StatusBadge'
import { ArrowLeft, ImageOff } from 'lucide-react'

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await productsApi.getProductById(id!)
      return res.product || res
    },
    enabled: !!id,
  })

  if (isLoading) return <LoadingState message="Loading product…" />
  if (error || !data) {
    return (
      <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm">
        Product not found.
      </div>
    )
  }

  const product: any = data
  const stockVariant =
    product.stockStatus === 'in_stock' ? 'success' :
    product.stockStatus === 'low_stock' ? 'warning' : 'danger'

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="overflow-hidden">
          <div className="aspect-square bg-gradient-to-br from-surface-100 to-surface-200 relative">
            {product.image ? (
              <img src={getImageUrl(product.image)} alt={product.name} className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <div className="absolute inset-0 grid place-items-center text-gray-400">
                <ImageOff className="h-10 w-10" />
              </div>
            )}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardBody>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-700">{product.category || '—'}</p>
            <h1 className="mt-1 font-display text-3xl font-extrabold text-gray-900">{product.name}</h1>
            <p className="text-sm text-gray-500 mt-1">SKU · {product.SKU}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Badge dot variant={stockVariant} className="capitalize">
                {(product.stockStatus || 'unknown').replace(/_/g, ' ')}
              </Badge>
              <Badge variant={product.status === 'active' ? 'success' : 'default'} className="capitalize">
                {product.status}
              </Badge>
            </div>

            {product.description && (
              <p className="mt-6 text-gray-700 whitespace-pre-wrap">{product.description}</p>
            )}

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <Stat label="Selling price" value={`₹${product.sellingPrice?.toLocaleString()}`} />
              <Stat label="Cost price"    value={`₹${product.costPrice?.toLocaleString()}`} />
              <Stat label="In stock"      value={product.stock} />
              <Stat label="Min stock"     value={product.minimumStock} />
            </div>

            {product.unit && (
              <p className="mt-4 text-xs text-gray-500">Unit · {product.unit}</p>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

const Stat = ({ label, value }: { label: string; value: any }) => (
  <div className="rounded-xl bg-surface-50 border border-gray-100 p-3">
    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">{label}</p>
    <p className="mt-1 font-display text-lg font-bold text-gray-900">{value}</p>
  </div>
)
