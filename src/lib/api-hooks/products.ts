import {
  productSchema,
  productsParamsSchema,
  productsResponseSchema,
  type Product,
  type ProductsParams,
  type ProductsResponse,
} from './products/product.schema'

import { api } from '../mock-data'
import z from 'zod'

export async function getProducts(
  params?: ProductsParams,
): Promise<ProductsResponse> {
  // ✅ validate input params
  const parsedParams = productsParamsSchema.parse(params ?? {})

  const data = await api.getProducts(parsedParams)

  // ✅ validate API response
  return productsResponseSchema.parse(data)
}

export async function getProduct(id: string): Promise<Product | null> {
  const data = await api.getProduct(id)
  return data ? productSchema.parse(data) : null
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const data = await api.getFeaturedProducts()
  return z.array(productSchema).parse(data)
}
