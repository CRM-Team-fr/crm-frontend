import { useQuery } from '@tanstack/react-query'
import { LoadingState } from '../../components/common/LoadingState'
import { Card, CardBody } from '../../components/common/Card'
import { productsApi } from '../../api'

export const ManagerInventory = () => {
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await productsApi.getProducts()
      return response
    },
  })

  if (isLoading) return <LoadingState message="Loading inventory..." />

  const products = productsData?.products || []
  const lowStock = products.filter((p: any) => p.stockStatus === 'low_stock')

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardBody>
            <p className="text-sm text-gray-600">Total Products</p>
            <p className="text-2xl font-bold">{products.length}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-sm text-gray-600">Low Stock</p>
            <p className="text-2xl font-bold text-yellow-600">{lowStock.length}</p>
          </CardBody>
        </Card>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Low Stock Alerts</h3>
        </div>
        <div className="p-6">
          {lowStock.length === 0 ? (
            <p className="text-gray-500 text-sm">No low stock items</p>
          ) : (
            <div className="space-y-3">
              {lowStock.map((product: any) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600">SKU: {product.SKU}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">Stock: {product.stock}</p>
                    <p className="text-xs text-gray-500">Min: {product.minimumStock}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
