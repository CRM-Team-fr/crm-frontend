import { useQuery } from '@tanstack/react-query'
import { DataTable } from '../../components/tables/DataTable'
import { Button } from '../../components/common/Button'
import { productsApi } from '../../api'
import { useNavigate } from 'react-router-dom'
import { getImageUrl } from '../../api/client'

export const SalespersonProducts = () => {
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await productsApi.getProducts()
      return response
    },
  })

  const products = data?.products || []

  const columns = [
    {
      header: 'Product',
      key: 'name',
      render: (item: any) => (
        <div className="flex items-center gap-3">
          {item.image && (
            <img src={getImageUrl(item.image)} alt={item.name} className="h-10 w-10 rounded object-cover" />
          )}
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-gray-500">{item.SKU}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      key: 'category',
      render: (item: any) => item.category,
    },
    {
      header: 'Price',
      key: 'sellingPrice',
      render: (item: any) => `₹${item.sellingPrice?.toLocaleString()}`,
    },
    {
      header: 'Stock',
      key: 'stock',
      render: (item: any) => item.stock,
    },
    {
      header: 'Status',
      key: 'stockStatus',
      render: (item: any) => {
        const variant = item.stockStatus === 'in_stock' ? 'success' : item.stockStatus === 'low_stock' ? 'warning' : 'danger'
        const label = item.stockStatus?.replace('_', ' ') || 'Unknown'
        return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variant === 'success' ? 'bg-green-100 text-green-800' : variant === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{label}</span>
      },
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (item: any) => (
        <Button size="sm" variant="ghost" onClick={() => navigate(`/salesperson/products/${item.id}`)}>
          View
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Products</h1>

      <div className="bg-white rounded-lg border border-gray-200">
        <DataTable
          columns={columns}
          data={products}
          keyExtractor={(item) => item.id}
          isLoading={isLoading}
          emptyMessage="No products found"
        />
      </div>
    </div>
  )
}
