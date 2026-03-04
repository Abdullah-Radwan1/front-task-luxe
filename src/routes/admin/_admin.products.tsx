import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { useSearchParams } from '@/lib/useSearchParams'
import { useTranslation } from 'react-i18next'
import { useProducts } from '#/lib/api-hooks/products/useProducts'
import { AnimatePresence, motion } from 'framer-motion'

import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Package,
  Tag,
  DollarSign,
  Layers,
  FolderTree,
  Gem,
  Wallet,
  Clock,
  Diamond,
} from 'lucide-react'

import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { TablePagination } from '@/components/TablePagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Product } from '#/lib/api-hooks/products/product.schema'

const PAGE_SIZE = 4

type ProductForm = {
  name: string
  description: string
  price: number
  stock: number
  category: 'watches' | 'leather' | 'accessories' | 'jewelry'
}

export const Route = createFileRoute('/admin/_admin/products')({
  component: AdminProducts,
})

// Category colors
const categoryColors = {
  watches: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  leather: 'bg-amber-700/10 text-amber-700 border-amber-700/20',
  accessories: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  jewelry: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
}

export default function AdminProducts() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: allProducts, isLoading } = useProducts({ pageSize: 100 })

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    clearErrors,
  } = useForm<ProductForm>({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: 'watches',
    },
  })

  const openEdit = (product: Product) => {
    setEditProduct(product)
    reset({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category as any,
    })
    setDialogOpen(true)
  }

  const openAdd = () => {
    setEditProduct(null)
    reset({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: 'watches',
    })
    setDialogOpen(true)
  }

  const searchQ = searchParams.get('q') || ''
  const sortCol = searchParams.get('sort') || 'name'
  const sortDir = searchParams.get('dir') || 'asc'
  const categoryFilter = searchParams.get('category') || 'all'

  const processedProducts = useMemo(() => {
    let list = allProducts?.products ?? []

    if (searchQ) {
      const q = searchQ.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      )
    }

    if (categoryFilter !== 'all') {
      list = list.filter((p) => p.category === categoryFilter)
    }

    const dir = sortDir === 'asc' ? 1 : -1
    list = [...list].sort((a, b) => {
      if (sortCol === 'price') return (a.price - b.price) * dir
      if (sortCol === 'stock') return (a.stock - b.stock) * dir
      return a.name.localeCompare(b.name) * dir
    })

    return list
  }, [allProducts, searchQ, categoryFilter, sortCol, sortDir])

  const totalPages = Math.ceil(processedProducts.length / PAGE_SIZE)
  const paginated = processedProducts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  )

  const toggleSort = (col: string) => {
    const next = new URLSearchParams(searchParams)
    if (sortCol === col) {
      next.set('dir', sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      next.set('sort', col)
      next.set('dir', 'asc')
    }
    setSearchParams(next)
  }

  const onSubmit = async (data: ProductForm) => {
    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 500))
    setDialogOpen(false)
    setIsSubmitting(false)
  }
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]) // Added for the selection logic
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Animated Icon Container */}
          <motion.div
            initial={{ scale: 0.9, rotate: -10, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12 }}
            className="p-3 bg-primary/10 rounded-xl cursor-pointer"
          >
            <Package size={30} className="text-primary" />
          </motion.div>

          {/* Optional: Simple fade-in for the text to match the icon's timing */}
          <motion.h1
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-display font-bold"
          >
            {t('admin.products')}
          </motion.h1>
        </div>

        <Button
          onClick={openAdd}
          className="gap-2 shadow-sm hover:shadow-md transition-shadow"
        >
          <Plus className="h-4 w-4" /> {t('admin.addProduct')}
        </Button>
      </div>
      {/* Search + Filter Inputs */}
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          {/* Search Input Pop */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="relative flex-1 max-w-sm"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQ}
              placeholder={t('admin.search')}
              onChange={(e) => {
                const next = new URLSearchParams(searchParams)
                e.target.value
                  ? next.set('q', e.target.value)
                  : next.delete('q')
                setSearchParams(next)
                setPage(1)
              }}
              className="pl-9 border-muted-foreground/20 focus-visible:ring-accent"
            />
          </motion.div>

          {/* Category Select Pop */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.05 }}
          >
            <Select
              value={categoryFilter}
              onValueChange={(value) => {
                const next = new URLSearchParams(searchParams)
                value === 'all'
                  ? next.delete('category')
                  : next.set('category', value)
                setSearchParams(next)
                setPage(1)
              }}
            >
              <SelectTrigger className="w-45 border-muted-foreground/20">
                <FolderTree className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder={t('admin.category')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center gap-2">
                    <span>{t('admin.all')}</span>
                  </div>
                </SelectItem>
                <SelectItem value="watches">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span>{t('categories.watches')}</span>
                  </div>
                </SelectItem>
                <SelectItem value="leather">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-amber-700" />
                    <span>{t('categories.leather')}</span>
                  </div>
                </SelectItem>
                <SelectItem value="accessories">
                  <div className="flex items-center gap-2">
                    <Gem className="h-4 w-4 text-purple-500" />
                    <span>{t('categories.accessories')}</span>
                  </div>
                </SelectItem>
                <SelectItem value="jewelry">
                  <div className="flex items-center gap-2">
                    <Diamond className="h-4 w-4 text-rose-500" />
                    <span>{t('categories.jewelry')}</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
        </motion.div>

        {/* Active Filter Badges */}
        <div className="flex flex-wrap gap-2">
          <AnimatePresence mode="popLayout">
            {/* Search Badge */}
            {searchQ && (
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-xs font-medium text-accent"
              >
                <Search className="h-3 w-3" />
                <span>{searchQ}</span>
                <button
                  onClick={() => {
                    const next = new URLSearchParams(searchParams)
                    next.delete('q')
                    setSearchParams(next)
                  }}
                  className="ml-1 hover:text-foreground transition-colors"
                >
                  ×
                </button>
              </motion.div>
            )}

            {/* Category Badge */}
            {categoryFilter !== 'all' && categoryFilter && (
              <motion.div
                initial={{ scale: 0, rotate: 10 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-medium text-primary"
              >
                <FolderTree className="h-3 w-3" />
                <span className="capitalize">{categoryFilter}</span>
                <button
                  onClick={() => {
                    const next = new URLSearchParams(searchParams)
                    next.delete('category')
                    setSearchParams(next)
                  }}
                  className="ml-1 hover:text-foreground transition-colors"
                >
                  ×
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                onClick={() => toggleSort('name')}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  {t('admin.name')}
                  {sortCol === 'name' && (sortDir === 'asc' ? ' ↑' : ' ↓')}
                </div>
              </TableHead>
              <TableHead>{t('admin.category')}</TableHead>
              <TableHead
                onClick={() => toggleSort('price')}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  {t('admin.price')}
                  {sortCol === 'price' && (sortDir === 'asc' ? ' ↑' : ' ↓')}
                </div>
              </TableHead>
              <TableHead
                onClick={() => toggleSort('stock')}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-1">
                  <Layers className="h-4 w-4" />
                  {t('admin.stock')}
                  {sortCol === 'stock' && (sortDir === 'asc' ? ' ↑' : ' ↓')}
                </div>
              </TableHead>
              <TableHead className="text-right">{t('admin.actions')}</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-20 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : paginated.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-32 text-center text-muted-foreground"
                >
                  {t('admin.noProductsFound')}
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((product, i) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="">{product.name}</TableCell>
                  <TableCell>
                    <Badge
                      className={`${categoryColors[product.category as keyof typeof categoryColors]} capitalize`}
                    >
                      {t(`categories.${product.category}`)}
                    </Badge>
                  </TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>
                    <span
                      className={product.stock < 10 ? 'text-amber-500' : ''}
                    >
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => openEdit(product)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteProduct(product)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div className="text-sm text-muted-foreground">
          Showing <span>{(page - 1) * PAGE_SIZE + 1}</span> to{' '}
          <span>{Math.min(page * PAGE_SIZE, processedProducts.length)}</span> of{' '}
          <span>{processedProducts.length}</span> products
          {selectedProducts.length > 0 && (
            <span className="ml-1 text-primary animate-in fade-in slide-in-from-left-1">
              · {selectedProducts.length} selected
            </span>
          )}
        </div>

        <TablePagination
          page={page}
          totalPages={totalPages}
          onPageChange={(newPage) => {
            setPage(newPage)
            setSelectedProducts([]) // Clear selection on page change like your example
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        />
      </motion.div>

      {/* Product Form Dialog */}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {editProduct ? (
                <Pencil className="h-5 w-5" />
              ) : (
                <Plus className="h-5 w-5" />
              )}
              {editProduct ? t('admin.editProduct') : t('admin.addProduct')}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                {t('admin.name')} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                {...register('name', {
                  required:
                    t('admin.errors.nameRequired') || 'Name is required',
                  minLength: {
                    value: 3,
                    message:
                      t('admin.errors.nameMinLength') ||
                      'Name must be at least 3 characters',
                  },
                })}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-sm text-destructive mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                {t('admin.description')}{' '}
                <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                {...register('description', {
                  required:
                    t('admin.errors.descriptionRequired') ||
                    'Description is required',
                  minLength: {
                    value: 10,
                    message:
                      t('admin.errors.descriptionMinLength') ||
                      'Description must be at least 10 characters',
                  },
                })}
                rows={3}
                className={errors.description ? 'border-destructive' : ''}
              />
              {errors.description && (
                <p className="text-sm text-destructive mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">
                {t('admin.category')}{' '}
                <span className="text-destructive">*</span>
              </Label>
              <Select
                defaultValue="watches"
                onValueChange={(v: any) => {
                  setValue('category', v, { shouldValidate: true })
                }}
              >
                <SelectTrigger
                  className={errors.category ? 'border-destructive' : ''}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="watches">
                    {t('categories.watches')}
                  </SelectItem>
                  <SelectItem value="leather">
                    {t('categories.leather')}
                  </SelectItem>
                  <SelectItem value="accessories">
                    {t('categories.accessories')}
                  </SelectItem>
                  <SelectItem value="jewelry">
                    {t('categories.jewelry')}
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">
                  {t('admin.price')} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...register('price', {
                    required:
                      t('admin.errors.priceRequired') || 'Price is required',
                    valueAsNumber: true,
                    min: {
                      value: 0.01,
                      message:
                        t('admin.errors.priceMin') ||
                        'Price must be greater than 0',
                    },
                  })}
                  className={errors.price ? 'border-destructive' : ''}
                />
                {errors.price && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.price.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">
                  {t('admin.stock')} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="stock"
                  type="number"
                  step="1"
                  {...register('stock', {
                    required:
                      t('admin.errors.stockRequired') || 'Stock is required',
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message:
                        t('admin.errors.stockMin') ||
                        'Stock cannot be negative',
                    },
                  })}
                  className={errors.stock ? 'border-destructive' : ''}
                />
                {errors.stock && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.stock.message}
                  </p>
                )}
              </div>
            </div>

            {Object.keys(errors).length > 0 && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive font-medium">
                  Please fix the errors above before submitting.
                </p>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  clearErrors()
                  setDialogOpen(false)
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : editProduct ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteProduct}
        onOpenChange={() => setDeleteProduct(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteProduct?.name}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => setDeleteProduct(null)}
              className="bg-destructive"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
