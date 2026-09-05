import { useQuery } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { productsApi } from '../../../api/products'
import { LoadingState } from '../../../components/common/LoadingState'
import { Badge } from '../../../components/status/StatusBadge'
import { getImageUrl } from '../../../api/client'

export const ManagerProductDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await productsApi.getProductById(id!)
      return response.product
    },
    enabled: !!id,
  })

  if (isLoading) return <LoadingState message="Loading product..." />
  if (!data) return <div className="text-red-600">Product not found</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button onClick={() => navigate(-1)} className="text-sm text-gray-600 hover:text-gray-900 mb-2">
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{data.name}</h1>
          <p className="text-gray-600">SKU: {data.SKU}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {data.image ? (
              <img src={getImageUrl(data.image)} alt={data.name} className="w-full h-64 object-cover rounded-lg" />
            ) : (
              <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">No image</span>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Product Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="text-sm text-gray-900">{data.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge variant={data.status === 'active' ? 'success' : 'default'} className="capitalize">{data.status}</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Selling Price</p>
                  <p className="text-sm text-gray-900">₹{data.sellingPrice?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cost Price</p>
                  <p className="text-sm text-gray-900">₹{data.costPrice?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Stock</p>
                  <p className="text-sm text-gray-900">{data.stock} units</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Minimum Stock</p>
                  <p className="text-sm text-gray-900">{data.minimumStock} units</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Stock Status</p>
                  <Badge variant={data.stockStatus === 'in_stock' ? 'success' : data.stockStatus === 'low_stock' ? 'warning' : 'danger'} className="capitalize">{data.stockStatus?.replace('_', ' ')}</Badge>
                </div>
              </div>
            </div>

            {data.description && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-sm text-gray-600">{data.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
