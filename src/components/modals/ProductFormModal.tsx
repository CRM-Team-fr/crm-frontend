import { useState, useEffect } from 'react'
import { Modal } from './Modal'
import { Button } from '../common/Button'
import { Input } from '../common/Input'
import { productsApi } from '../../api'

interface ProductFormModalProps {
  isOpen: boolean
  onClose: () => void
  product?: any | null
  onSuccess?: () => void
}

export const ProductFormModal = ({ isOpen, onClose, product, onSuccess }: ProductFormModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    SKU: '',
    category: '',
    description: '',
    sellingPrice: '',
    costPrice: '',
    tax: '0',
    unit: '',
    stock: '0',
    minimumStock: '0',
    status: 'active',
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isEdit = !!product

  useEffect(() => {
    if (isOpen) {
      if (product) {
        setFormData({
          name: product.name || '',
          SKU: product.SKU || '',
          category: product.category || '',
          description: product.description || '',
          sellingPrice: product.sellingPrice?.toString() || '',
          costPrice: product.costPrice?.toString() || '',
          tax: product.tax?.toString() || '0',
          unit: product.unit || '',
          stock: product.stock?.toString() || '0',
          minimumStock: product.minimumStock?.toString() || '0',
          status: product.status || 'active',
        })
      } else {
        setFormData({
          name: '',
          SKU: '',
          category: '',
          description: '',
          sellingPrice: '',
          costPrice: '',
          tax: '0',
          unit: '',
          stock: '0',
          minimumStock: '0',
          status: 'active',
        })
      }
      setImageFile(null)
      setError('')
    }
  }, [isOpen, product])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const fd = new FormData()
      fd.append('name', formData.name)
      fd.append('SKU', formData.SKU.toUpperCase())
      fd.append('category', formData.category)
      fd.append('description', formData.description)
      fd.append('sellingPrice', formData.sellingPrice)
      fd.append('costPrice', formData.costPrice)
      fd.append('tax', formData.tax)
      fd.append('unit', formData.unit)
      fd.append('stock', formData.stock)
      fd.append('minimumStock', formData.minimumStock)
      fd.append('status', formData.status)

      if (imageFile) {
        fd.append('image', imageFile)
      }

      if (isEdit && product?.id) {
        await productsApi.updateProduct(product.id, fd)
      } else {
        await productsApi.createProduct(fd)
      }

      onClose()
      onSuccess?.()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save product.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Product' : 'Add Product'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>}

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Product Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="SKU"
            value={formData.SKU}
            onChange={(e) => setFormData({ ...formData, SKU: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          />
          <Input
            label="Unit"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Selling Price"
            type="number"
            step="0.01"
            value={formData.sellingPrice}
            onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
            required
          />
          <Input
            label="Cost Price"
            type="number"
            step="0.01"
            value={formData.costPrice}
            onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Tax (%)"
            type="number"
            step="0.01"
            value={formData.tax}
            onChange={(e) => setFormData({ ...formData, tax: e.target.value })}
          />
          <Input
            label="Stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            required
          />
          <Input
            label="Minimum Stock"
            type="number"
            value={formData.minimumStock}
            onChange={(e) => setFormData({ ...formData, minimumStock: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <Input
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Image {isEdit && <span className="text-gray-400">(leave blank to keep current)</span>}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>

        <Button type="submit" className="w-full" loading={loading}>
          {isEdit ? 'Update Product' : 'Create Product'}
        </Button>
      </form>
    </Modal>
  )
}
