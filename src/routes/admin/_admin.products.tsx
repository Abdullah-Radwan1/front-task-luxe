import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from '@/lib/useSearchParams'
import { useTranslation } from 'react-i18next'

import { Plus, Pencil, Trash2, Search, Package } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { api, type Product } from '@/lib/mock-data'

const PAGE_SIZE = 5

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.coerce.number().positive(),
  stock: z.coerce.number().int().min(0),
  category: z.enum(['watches', 'leather', 'accessories', 'jewelry']),
})

type ProductForm = z.infer<typeof productSchema>
export const Route = createFileRoute('/admin/_admin/products')({
  component: AdminProducts,
})
export default function AdminProducts() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [page, setPage] = useState(1)

  const { data: allProducts, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => api.getProducts({ pageSize: 100 }),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
  })

  const openEdit = (product: Product) => {
    setEditProduct(product)
    reset({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
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

  const onSubmit = (data: ProductForm) => {
    // Mock save
    setDialogOpen(false)
  }

  const searchQ = searchParams.get('q') || ''
  const sortCol = searchParams.get('sort') || 'name'
  const sortDir = searchParams.get('dir') || 'asc'

  let filtered = allProducts?.products || []
  if (searchQ) {
    const q = searchQ.toLowerCase()
    filtered = filtered.filter(
      (p) => p.name.toLowerCase().includes(q) || p.category.includes(q),
    )
  }

  const sorted = [...filtered].sort((a, b) => {
    const dir = sortDir === 'asc' ? 1 : -1
    if (sortCol === 'price') return (a.price - b.price) * dir
    if (sortCol === 'stock') return (a.stock - b.stock) * dir
    return a.name.localeCompare(b.name) * dir
  })

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl items-baseline flex gap-2 font-bold mb-6">
          {t('admin.products')} <Package size={24} />
        </h1>
        <Button
          onClick={openAdd}
          className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2"
        >
          <Plus className="h-4 w-4" /> {t('admin.addProduct')}
        </Button>
      </div>

      <div className="relative max-w-sm mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('admin.search')}
          value={searchQ}
          onChange={(e) => {
            const next = new URLSearchParams(searchParams)
            if (e.target.value) next.set('q', e.target.value)
            else next.delete('q')
            setSearchParams(next)
          }}
          className="pl-9"
        />
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => toggleSort('name')}
              >
                {t('admin.name')}{' '}
                {sortCol === 'name' && (sortDir === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead>{t('admin.category')}</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => toggleSort('price')}
              >
                {t('admin.price')}{' '}
                {sortCol === 'price' && (sortDir === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => toggleSort('stock')}
              >
                {t('admin.stock')}{' '}
                {sortCol === 'stock' && (sortDir === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead>{t('admin.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : paginated.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {t(`categories.${product.category}`)}
                      </Badge>
                    </TableCell>
                    <TableCell>${product.price.toLocaleString()}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(product)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteProduct(product)}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
      <TablePagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editProduct ? t('admin.editProduct') : t('admin.addProduct')}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>{t('admin.name')}</Label>
              <Input {...register('name')} />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>{t('admin.description')}</Label>
              <Input {...register('description')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('admin.price')}</Label>
                <Input {...register('price')} type="number" step="0.01" />
              </div>
              <div className="space-y-2">
                <Label>{t('admin.stock')}</Label>
                <Input {...register('stock')} type="number" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                {t('admin.cancel')}
              </Button>
              <Button
                type="submit"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {t('admin.save')}
              </Button>
            </div>
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
            <AlertDialogTitle>{t('admin.deleteProduct')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('admin.confirmDelete')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('admin.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => setDeleteProduct(null)}
              className="bg-destructive text-destructive-foreground"
            >
              {t('admin.deleteProduct')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
