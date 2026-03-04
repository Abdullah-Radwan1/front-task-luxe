export const PRODUCTS_QUERY_KEYS = {
  all: ['products'],

  lists: () => [...PRODUCTS_QUERY_KEYS.all, 'list'],

  list: (params?: {
    category?: string
    search?: string
    sort?: string
    page?: number
    pageSize?: number
  }) => [...PRODUCTS_QUERY_KEYS.lists(), params ?? {}],

  details: () => [...PRODUCTS_QUERY_KEYS.all, 'detail'],

  detail: (id: string) => [...PRODUCTS_QUERY_KEYS.details(), id],

  featured: () => [...PRODUCTS_QUERY_KEYS.all, 'featured'],
}
