import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { DataTable } from '../../components/tables/DataTable'
import { Button } from '../../components/common/Button'
import { Modal } from '../../components/modals'
import { ProductFormModal } from '../../components/modals/ProductFormModal'
import { productsApi } from '../../api'
import { useNavigate } from 'react-router-dom'
import { StockAdjustmentModal } from '../../components/modals'
import { getImageUrl } from '../../api/client'

export const AdminProducts = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showStockModal, setShowStockModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<any>(null)
  const [error, setError] = useState('')
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await productsApi.getProducts()
      return response
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (productId: string) => productsApi.deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      setDeleteConfirm(null)
    },
  })

  const activateMutation = useMutation({
    mutationFn: (productId: string) => productsApi.updateProductStatus(productId, 'active'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      setDeleteConfirm(null)
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
      key: 'status',
      render: (item: any) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {item.status}
        </span>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (item: any) => (
        <div className="flex gap-2">
          <button onClick={() => navigate(`/admin/products/${item.id}`)} className="text-blue-600 hover:underline text-sm">
            View
          </button>
          <button onClick={() => setEditingProduct(item)} className="text-green-600 hover:underline text-sm">
            Edit
          </button>
          <button onClick={() => setDeleteConfirm(item)} className="text-red-600 hover:underline text-sm">
            {item.status === 'active' ? 'Delete' : 'Activate'}
          </button>
          <button onClick={() => { setSelectedProduct(item); setShowStockModal(true); }} className="text-purple-600 hover:underline text-sm">
            Adjust Stock
          </button>
        </div>
      ),
    },
  ]

  const handleDelete = async () => {
    if (!deleteConfirm) return
    setError('')
    try {
      if (deleteConfirm.status === 'active') {
        await deleteMutation.mutateAsync(deleteConfirm.id)
      } else {
        await activateMutation.mutateAsync(deleteConfirm.id)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Action failed.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Button onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}>Add Product</Button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200">
        <DataTable
          columns={columns}
          data={products}
          keyExtractor={(item) => item.id}
          isLoading={isLoading}
          emptyMessage="No products found"
        />
      </div>

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['products'] })}
      />

      <ProductFormModal
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        product={editingProduct}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['products'] })}
      />

      <StockAdjustmentModal
        isOpen={showStockModal}
        onClose={() => { setShowStockModal(false); setSelectedProduct(null); }}
        productId={selectedProduct?.id}
        currentStock={selectedProduct?.stock}
      />

      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirm Action" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            {deleteConfirm?.status === 'active'
              ? 'Are you sure you want to delete this product? If it has existing transactions, it will be deactivated instead to preserve history.'
              : 'Are you sure you want to reactivate this product?'}
          </p>
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              loading={deleteMutation.isPending || activateMutation.isPending}
            >
              {deleteConfirm?.status === 'active' ? 'Delete' : 'Activate'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
