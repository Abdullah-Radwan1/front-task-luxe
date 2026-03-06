import type { ProductsParams } from './products/product.schema'

export const PRODUCTS_QUERY_KEYS = {
  all: ['products'] as const,

  lists: () => [...PRODUCTS_QUERY_KEYS.all, 'list'] as const,

  list: (params?: ProductsParams) =>
    [...PRODUCTS_QUERY_KEYS.lists(), params ?? {}] as const,

  details: () => [...PRODUCTS_QUERY_KEYS.all, 'detail'] as const,

  detail: (id: string) => [...PRODUCTS_QUERY_KEYS.details(), id] as const,

  featured: () => [...PRODUCTS_QUERY_KEYS.all, 'featured'] as const,
}
