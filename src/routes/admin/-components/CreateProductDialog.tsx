import { Pencil, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ProductFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editProduct: any // Replace with your Product type
  onSubmit: (data: any) => void
  register: any
  handleSubmit: any
  errors: any
  setValue: any
  clearErrors: any
  isSubmitting: boolean
  t: (key: string) => string
}

export function ProductFormDialog({
  open,
  onOpenChange,
  editProduct,
  onSubmit,
  register,
  handleSubmit,
  errors,
  setValue,
  clearErrors,
  isSubmitting,
  t,
}: ProductFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">
              {t('admin.name')} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              {...register('name', {
                required: t('admin.errors.nameRequired') || 'Name is required',
                minLength: {
                  value: 3,
                  message: t('admin.errors.nameMinLength'),
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

          {/* Description Field */}
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
                  message: t('admin.errors.descriptionMinLength'),
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

          {/* Category Field */}
          <div className="space-y-2">
            <Label htmlFor="category">
              {t('admin.category')} <span className="text-destructive">*</span>
            </Label>
            <Select
              defaultValue={editProduct?.category || 'watches'}
              onValueChange={(v) =>
                setValue('category', v, { shouldValidate: true })
              }
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
          </div>

          {/* Price & Stock Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">{t('admin.price')} *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register('price', { required: true, valueAsNumber: true })}
                className={errors.price ? 'border-destructive' : ''}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">{t('admin.stock')} *</Label>
              <Input
                id="stock"
                type="number"
                {...register('stock', { required: true, valueAsNumber: true })}
                className={errors.stock ? 'border-destructive' : ''}
              />
            </div>
          </div>

          {Object.keys(errors).length > 0 && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive font-medium">
                Please fix errors above.
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                clearErrors()
                onOpenChange(false)
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
  )
}
