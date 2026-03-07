import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useProducts } from '#/hooks/api-hooks/products/useProducts'
import { motion } from 'framer-motion'

import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Package,
  Gem,
  Wallet,
  Clock,
  Diamond,
} from 'lucide-react'

import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

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

import {
  productsParamsSchema,
  type Product,
  type ProductCategory,
  type ProductsParams,
} from '#/hooks/api-hooks/products/product.schema'

import { ProductFormDialog } from './-components/CreateProductDialog'
import { DeleteProductDialog } from './-components/DeleteProductDialog'

/* ---------------- PAGE CONFIG ---------------- */

const PAGE_SIZE = 4

export const Route = createFileRoute('/admin/_admin/products')({
  component: AdminProducts,
  validateSearch: productsParamsSchema,
})

/* ---------------- CATEGORY COLORS ---------------- */

const categoryColors = {
  watches: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  leather: 'bg-amber-700/10 text-amber-700 border-amber-700/20',
  accessories: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  jewelry: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
}

/* ---------------- FORM TYPE ---------------- */

type ProductForm = {
  name: string
  description: string
  price: number
  stock: number
  category: 'watches' | 'leather' | 'accessories' | 'jewelry'
}

/* ===================================================== */
/* ================= COMPONENT ========================= */
/* ===================================================== */

export default function AdminProducts() {
  const { t } = useTranslation()

  /* -------------------------------------------------- */
  /* Router utilities                                   */
  /* -------------------------------------------------- */

  const searchParams = Route.useSearch()
  const navigate = Route.useNavigate()

  /* -------------------------------------------------- */
  /* URL params (single source of truth)                */
  /* -------------------------------------------------- */

  const page = searchParams.page ?? 1
  const searchQ = searchParams.search ?? ''
  const categoryFilter = Array.isArray(searchParams.category)
    ? (searchParams.category[0] ?? 'all')
    : (searchParams.category ?? 'all')
  const sort = searchParams.sort ?? 'newest'

  /* -------------------------------------------------- */
  /* Dialog state                                       */
  /* -------------------------------------------------- */

  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  /* -------------------------------------------------- */
  /* React Hook Form                                    */
  /* -------------------------------------------------- */

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

  /* -------------------------------------------------- */
  /* Update URL params                                  */
  /* -------------------------------------------------- */

  const updateParam = (params: Partial<ProductsParams>) => {
    navigate({
      search: (prev) => ({
        ...prev,
        ...params,
        page: params.page ?? 1,
      }),
    })
  }

  /* -------------------------------------------------- */
  /* API query params                                   */
  /* -------------------------------------------------- */

  const queryParams: ProductsParams = {
    search: searchQ || undefined,
    category:
      categoryFilter === 'all'
        ? undefined
        : (categoryFilter as ProductCategory),
    sort,
    page,
    pageSize: PAGE_SIZE,
  }

  /* -------------------------------------------------- */
  /* React Query hook                                   */
  /* -------------------------------------------------- */

  const { data, isLoading } = useProducts(queryParams)

  const products = data?.products ?? []
  const totalPages = data?.totalPages ?? 1
  const total = data?.total ?? 0 // 👈 Get total count from API
  /* -------------------------------------------------- */
  /* Dialog helpers                                     */
  /* -------------------------------------------------- */

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

  const onSubmit = async () => {
    setIsSubmitting(true)

    await new Promise((r) => setTimeout(r, 500))

    setDialogOpen(false)
    setIsSubmitting(false)
  }

  /* ===================================================== */
  /* ====================== UI ============================ */
  /* ===================================================== */

  return (
    <div className="space-y-6">
      {/* ---------------- Header ---------------- */}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ scale: 0.9, rotate: -10, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            className="p-3 bg-primary/10 rounded-xl"
          >
            <Package size={30} className="text-primary" />
          </motion.div>

          <h1 className="text-3xl font-display font-bold">
            {t('admin.products')}
          </h1>
        </div>

        <Button onClick={openAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          {t('admin.addProduct')}
        </Button>
      </div>

      {/* ---------------- Filters ---------------- */}

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}

        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

          <Input
            value={searchQ}
            placeholder={t('admin.search')}
            onChange={(e) =>
              updateParam({
                search: e.target.value || undefined,
              })
            }
            className="pl-9"
          />
        </div>

        {/* Category */}

        <Select
          value={categoryFilter}
          onValueChange={(value) =>
            updateParam({
              category:
                value === 'all' ? undefined : (value as ProductCategory),
            })
          }
        >
          <SelectTrigger className="w-45">
            <SelectValue placeholder={t('admin.category')} />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">{t('admin.all')}</SelectItem>

            <SelectItem value="watches">
              <Clock className="h-4 w-4 mr-2 inline" />
              {t('categories.watches')}
            </SelectItem>

            <SelectItem value="leather">
              <Wallet className="h-4 w-4 mr-2 inline" />
              {t('categories.leather')}
            </SelectItem>

            <SelectItem value="accessories">
              <Gem className="h-4 w-4 mr-2 inline" />
              {t('categories.accessories')}
            </SelectItem>

            <SelectItem value="jewelry">
              <Diamond className="h-4 w-4 mr-2 inline" />
              {t('categories.jewelry')}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ---------------- Table ---------------- */}

      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('admin.name')}</TableHead>
              <TableHead>{t('admin.category')}</TableHead>
              <TableHead>{t('admin.price')}</TableHead>
              <TableHead>{t('admin.stock')}</TableHead>
              <TableHead className="text-right">{t('admin.actions')}</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
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
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  {t('admin.noProductsFound')}
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <TableCell>{product.name}</TableCell>

                  <TableCell>
                    <Badge
                      className={`${
                        categoryColors[
                          product.category as keyof typeof categoryColors
                        ]
                      } capitalize`}
                    >
                      {t(`categories.${product.category}`)}
                    </Badge>
                  </TableCell>

                  <TableCell>${product.price}</TableCell>

                  <TableCell>{product.stock}</TableCell>

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
                      className="text-destructive"
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

      {/* ---------------- Pagination ---------------- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-between"
      >
        <div className="text-sm text-muted-foreground">
          Showing {(page - 1) * PAGE_SIZE + 1} to{' '}
          {Math.min(page * PAGE_SIZE, total)} of {total} orders
        </div>
        <TablePagination
          page={page}
          totalPages={totalPages}
          onPageChange={(newPage) => updateParam({ page: newPage })}
        />
      </motion.div>
      {/* ---------------- Dialogs ---------------- */}

      <ProductFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editProduct={editProduct}
        onSubmit={onSubmit}
        register={register}
        handleSubmit={handleSubmit}
        errors={errors}
        setValue={setValue}
        clearErrors={clearErrors}
        isSubmitting={isSubmitting}
        t={t}
      />

      <DeleteProductDialog
        product={deleteProduct}
        onClose={() => setDeleteProduct(null)}
        onConfirm={() => setDeleteProduct(null)}
      />
    </div>
  )
}
