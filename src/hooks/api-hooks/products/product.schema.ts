import { z } from 'zod'

/* -------------------- */
/* Product */
/* -------------------- */

export const productCategorySchema = z.enum([
  'watches',
  'leather',
  'accessories',
  'jewelry',
])

export type ProductCategory = z.infer<typeof productCategorySchema>

export const productSchema = z.object({
  id: z.string(),

  /* -------- Names (i18n) -------- */
  name: z.string(), // fallback / default
  name_en: z.string(),
  name_ar: z.string(),

  /* -------- Descriptions (i18n) -------- */
  description: z.string(),
  description_en: z.string(),
  description_ar: z.string(),

  /* -------- Pricing & Category -------- */
  price: z.number().positive(),
  category: productCategorySchema,

  /* -------- Media -------- */
  image: z.string().url(),

  /* -------- Inventory -------- */
  stock: z.number().int().nonnegative(),

  /* -------- Flags -------- */
  featured: z.boolean().default(false),

  /* -------- Rating -------- */
  rating: z.number().min(0).max(5).optional(),

  /* -------- Metadata -------- */
  createdAt: z.string().refine((date) => !Number.isNaN(Date.parse(date)), {
    message: 'Invalid ISO date',
  }),
})

export type Product = z.infer<typeof productSchema>

/* -------------------- */
/* Query Params */
/* -------------------- */
export const productsParamsSchema = z.object({
  category: z
    .union([productCategorySchema, z.array(productCategorySchema)])
    .optional(),
  search: z.string().optional(),
  sort: z.enum(['price-asc', 'price-desc', 'newest', 'name']).optional(),
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().optional(),
  minPrice: z.coerce.number().int().nonnegative().optional(),
  maxPrice: z.coerce.number().int().nonnegative().optional(),
  inStock: z.coerce.boolean().optional(),
})

export type ProductsParams = z.infer<typeof productsParamsSchema>

/* -------------------- */
/* API Response */
/* -------------------- */
export const productsResponseSchema = z.object({
  products: z.array(productSchema),
  total: z.number(),
  totalPages: z.number(),
  page: z.number(),
})

export type ProductsResponse = z.infer<typeof productsResponseSchema>
