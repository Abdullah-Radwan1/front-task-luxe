import type { UsersType, UserType } from '#/hooks/api-hooks/users/userSchema'
import type { OrderType } from '../hooks/api-hooks/orders/orderSchema'
import type {
  Product,
  ProductsParams,
} from '../hooks/api-hooks/products/product.schema'

// helper to safely read JSON arrays from localStorage
function loadArrayFromStorage<T>(key: string, fallback: T[]): T[] {
  if (typeof window === 'undefined') return [...fallback]
  try {
    const str = localStorage.getItem(key)
    if (str) return JSON.parse(str)
  } catch {
    /* ignore parse errors */
  }
  return [...fallback]
}

// Mock products and orders arrays
const productImages = [
  'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1622434641406-a158123450f9?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop',
]
export const products: Product[] = [
  {
    id: '1',
    name: 'Chronograph Elite',
    name_en: 'Chronograph Elite',
    name_ar: 'كرونوغراف إيليت',
    description: 'Swiss-made  chronograph with sapphire crystal',
    description_en: 'Swiss-made chronograph with sapphire crystal',
    description_ar: 'كرونوغراف سويسري مع زجاج ياقوتي',
    price: 2499,
    category: 'watches',
    image: productImages[0],
    stock: 12,
    featured: true,
    rating: 4.9,

    createdAt: '2025-12-01',
  },
  {
    id: '2',
    name: 'Heritage Diver',
    name_en: 'Heritage Diver',
    name_ar: 'هيريتاج دايفر',
    description: 'Water-resistant to 300m with ceramic bezel',
    description_en: 'Water-resistant to 300m with ceramic bezel',
    description_ar: 'مقاوم للماء حتى 300م مع إطار سيراميكي',
    price: 1899,
    category: 'watches',
    image: productImages[1],
    stock: 8,
    featured: true,
    rating: 4.8,

    createdAt: '2025-11-15',
  },
  {
    id: '3',
    name: 'Milano Briefcase',
    name_en: 'Milano Briefcase',
    name_ar: 'حقيبة ميلانو',
    description: 'Full-grain Italian leather with brass hardware',
    description_en: 'Full-grain Italian leather with brass hardware',
    description_ar: 'جلد إيطالي عالي الجودة مع تركيبات من النحاس',
    price: 890,
    category: 'leather',
    image: productImages[2],
    stock: 15,
    featured: true,
    rating: 4.7,

    createdAt: '2025-10-20',
  },
  {
    id: '4',
    name: 'Voyager Duffle',
    name_en: 'Voyager Duffle',
    name_ar: 'حقيبة السفر فوجير',
    description: 'Hand-stitched travel bag in vegetable-tanned leather',
    description_en: 'Hand-stitched travel bag in vegetable-tanned leather',
    description_ar: 'حقيبة سفر مخيطة يدويًا من جلد نباتي مدبوغ',
    price: 1250,
    category: 'leather',
    image: productImages[3],
    stock: 6,
    featured: false,
    rating: 4.6,

    createdAt: '2025-09-10',
  },
  {
    id: '5',
    name: 'Onyx Cufflinks',
    name_en: 'Onyx Cufflinks',
    name_ar: 'أزرار أكمام من العقيق الأسود',
    description: 'Sterling silver cufflinks with black onyx stones',
    description_en: 'Sterling silver cufflinks with black onyx stones',
    description_ar: 'أزرار أكمام من الفضة الإسترلينية مع أحجار العقيق الأسود',
    price: 320,
    category: 'accessories',
    image: productImages[4],
    stock: 25,
    featured: false,
    rating: 4.5,

    createdAt: '2025-12-05',
  },
  {
    id: '6',
    name: 'Gold Chain Necklace',
    name_en: 'Gold Chain Necklace',
    name_ar: 'سلسلة ذهبية',
    description: '18K gold-plated Cuban link chain',
    description_en: '18K gold-plated Cuban link chain',
    description_ar: 'سلسلة كوبيان مطلية بالذهب عيار 18',
    price: 450,
    category: 'jewelry',
    image: productImages[5],
    stock: 20,
    featured: true,
    rating: 4.8,

    createdAt: '2025-11-01',
  },
  {
    id: '7',
    name: 'Signet Ring',
    name_en: 'Signet Ring',
    name_ar: 'خاتم خاتم',
    description: 'Hand-engraved sterling silver signet ring',
    description_en: 'Hand-engraved sterling silver signet ring',
    description_ar: 'خاتم خاتم من الفضة الإسترلينية محفور يدويًا',
    price: 280,
    category: 'jewelry',
    image: productImages[6],
    stock: 30,
    featured: false,
    rating: 4.4,

    createdAt: '2025-10-15',
  },
  {
    id: '8',
    name: 'Aviator Sunglasses',
    name_en: 'Aviator Sunglasses',
    name_ar: 'نظارة طيار',
    description: 'Titanium frame with polarized lenses',
    description_en: 'Titanium frame with polarized lenses',
    description_ar: 'إطار من التيتانيوم مع عدسات مستقطبة',
    price: 395,
    category: 'accessories',
    image: productImages[7],
    stock: 18,
    featured: true,
    rating: 4.7,

    createdAt: '2025-08-20',
  },
  {
    id: '9',
    name: 'Dress Watch Slim',
    name_en: 'Dress Watch Slim',
    name_ar: 'ساعة رسمية نحيفة',
    description: 'Ultra-thin automatic movement, rose gold case',
    description_en: 'Ultra-thin automatic movement, rose gold case',
    description_ar: 'حركة أوتوماتيكية فائقة النحافة، هيكل من الذهب الوردي',
    price: 3200,
    category: 'watches',
    image: productImages[8],
    stock: 5,
    featured: true,
    rating: 5.0,

    createdAt: '2025-12-10',
  },
  {
    id: '10',
    name: 'Leather Card Holder',
    name_en: 'Leather Card Holder',
    name_ar: 'حامل بطاقات جلدي',
    description: 'Minimalist card holder in saffiano leather',
    description_en: 'Minimalist card holder in saffiano leather',
    description_ar: 'حامل بطاقات بسيط من جلد سافيانو',
    price: 145,
    category: 'leather',
    image: productImages[9],
    stock: 40,
    featured: false,
    rating: 4.3,

    createdAt: '2025-07-15',
  },
  {
    id: '11',
    name: 'Silk Pocket Square',
    name_en: 'Silk Pocket Square',
    name_ar: 'منديل جيب حريري',
    description: 'Hand-rolled Italian silk in paisley print',
    description_en: 'Hand-rolled Italian silk in paisley print',
    description_ar: 'منديل جيب من الحرير الإيطالي بطبعة بيزلي',
    price: 85,
    category: 'accessories',
    image: productImages[10],
    stock: 50,
    featured: false,
    rating: 4.6,

    createdAt: '2025-06-01',
  },
  {
    id: '12',
    name: 'Diamond Stud Earrings',
    name_en: 'Diamond Stud Earrings',
    name_ar: 'أقراط ماسية',
    description: '0.5ct lab-grown diamonds in platinum setting',
    description_en: '0.5ct lab-grown diamonds in platinum setting',
    description_ar: 'أقراط مرصعة بألماس اصطناعي 0.5 قيراط بإطار من البلاتين',
    price: 1800,
    category: 'jewelry',
    image: productImages[11],
    stock: 10,
    featured: true,
    rating: 4.9,

    createdAt: '2025-11-25',
  },
]

// default data used when nothing is stored
const defaultOrders: OrderType[] = [
  {
    id: 'ORD-001',
    customerName: 'James Wilson', // changed from 'customer' to 'customerName'
    email: 'tryToSearchByMail@gmail.com',
    cartItems: [{ productId: '1', quantity: 1, price: 2499 }], // changed from 'items' to 'cartItems'
    total: 2499,
    status: 'completed',
    createdAt: '2026-02-15', // changed from 'date' to 'createdAt'
  },
  {
    id: 'ORD-002',
    customerName: 'Sarah Chen', // changed from 'customer' to 'customerName'
    email: 'sarah@example.com',
    cartItems: [
      // changed from 'items' to 'cartItems'
      { productId: '3', quantity: 1, price: 890 },
      { productId: '5', quantity: 2, price: 320 },
    ],
    total: 1530,
    status: 'pending',
    createdAt: '2026-02-20', // changed from 'date' to 'createdAt'
  },
  {
    id: 'ORD-003',
    customerName: 'Omar Hassan', // changed from 'customer' to 'customerName'
    email: 'omar@example.com',
    cartItems: [{ productId: '6', quantity: 1, price: 450 }], // changed from 'items' to 'cartItems'
    total: 450,
    status: 'completed',
    createdAt: '2026-02-22', // changed from 'date' to 'createdAt'
  },
  {
    id: 'ORD-004',
    customerName: 'Emily Taylor', // changed from 'customer' to 'customerName'
    email: 'emily@example.com',
    cartItems: [{ productId: '9', quantity: 1, price: 3200 }], // changed from 'items' to 'cartItems'
    total: 3200,
    status: 'pending',
    createdAt: '2026-02-25', // changed from 'date' to 'createdAt'
  },
  {
    id: 'ORD-005',
    customerName: 'Michael Brown', // changed from 'customer' to 'customerName'
    email: 'michael@example.com',
    cartItems: [{ productId: '2', quantity: 1, price: 1899 }], // changed from 'items' to 'cartItems'
    total: 1899,
    status: 'cancelled',
    createdAt: '2026-02-10', // changed from 'date' to 'createdAt'
  },
  {
    id: 'ORD-006',
    customerName: 'Aisha Khan', // changed from 'customer' to 'customerName'
    email: 'aisha@example.com',
    cartItems: [{ productId: '12', quantity: 1, price: 1800 }], // changed from 'items' to 'cartItems'
    total: 1800,
    status: 'completed',
    createdAt: '2026-02-18', // changed from 'date' to 'createdAt'
  },
]

const defaultUsers: UsersType = [
  {
    id: 'USR-001',
    name: 'Admin Abdullah',
    email: 'admin@luxe.com',
    password: 'admin123',
    role: 'admin',
    status: 'active',
    joinedAt: '2025-01-01',
  },
  {
    id: 'USR-002',
    name: 'James Wilson',
    email: 'james@example.com',
    password: 'james123',
    role: 'customer',
    status: 'active',
    joinedAt: '2025-06-15',
  },
  {
    id: 'USR-003',
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    password: 'sarah123',
    role: 'customer',
    status: 'active',
    joinedAt: '2025-08-20',
  },
  {
    id: 'USR-004',
    name: 'Omar Hassan',
    email: 'tryToSearchByMail@gmail.com',
    password: 'omar123',
    role: 'customer',
    status: 'active',
    joinedAt: '2025-09-10',
  },
  {
    id: 'USR-005',
    name: 'Emily Taylor',
    email: 'emily@example.com',
    password: 'emily123',
    role: 'customer',
    status: 'inactive',
    joinedAt: '2025-03-05',
  },
  {
    id: 'USR-006',
    name: 'Michael Brown',
    email: 'michael@example.com',
    password: 'michael123',
    role: 'customer',
    status: 'active',
    joinedAt: '2025-11-01',
  },
]

export let orders: OrderType[] = loadArrayFromStorage('orders', defaultOrders)
export let users: UsersType = loadArrayFromStorage('users', defaultUsers)

const delay = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms))

// ---------------------- API ----------------------
export const api = {
  getProducts: async (params?: ProductsParams) => {
    await delay()
    let filtered = [...products]

    // فئات متعددة
    if (params?.category?.length) {
      filtered = filtered.filter((p) => params.category!.includes(p.category))
    }

    // البحث
    if (params?.search) {
      const s = params.search.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(s) ||
          p.description.toLowerCase().includes(s),
      )
    }

    // الترتيب
    if (params?.sort === 'price-asc') filtered.sort((a, b) => a.price - b.price)
    else if (params?.sort === 'price-desc')
      filtered.sort((a, b) => b.price - a.price)
    else if (params?.sort === 'newest')
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )

    // Price filter
    if (params?.minPrice != null)
      filtered = filtered.filter((p) => p.price >= params.minPrice!)
    if (params?.maxPrice != null)
      filtered = filtered.filter((p) => p.price <= params.maxPrice!)

    // In stock
    if (params?.inStock) filtered = filtered.filter((p) => p.stock > 0)

    const page = params?.page ?? 1
    const pageSize = params?.pageSize ?? 6
    const total = filtered.length
    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)

    return {
      products: paginated,
      total,
      totalPages: Math.ceil(total / pageSize),
      page,
    }
  },
  getFeaturedProducts: async () => {
    await delay()
    return products.filter((p) => p.featured)
  },

  getProduct: async (id: string) => {
    await delay()
    return products.find((p) => p.id === id) || null
  },

  // ✅ Orders API with proper pagination
  getOrders: async (params?: { page?: number; pageSize?: number }) => {
    await delay()

    const pageSize = params?.pageSize ?? 6
    const page = params?.page ?? 1

    const totalOrders = orders.length
    const totalPages = Math.ceil(totalOrders / pageSize)

    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedOrders = orders.slice(start, end)

    return {
      orders: paginatedOrders,
      total: totalOrders,
      totalPages,
      page,
      pageSize,
    }
  },

  getUsers: async (params?: { page?: number; pageSize?: number }) => {
    await delay()

    const pageSize = params?.pageSize ?? 6
    const page = params?.page ?? 1

    const totalUsers = users.length
    const totalPages = Math.ceil(totalUsers / pageSize)

    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedUsers = users.slice(start, end)

    return {
      users: paginatedUsers,
      total: totalUsers,
      totalPages,
      page,
      pageSize,
    }
  },

  registerUser: async (name: string, email: string, password: string) => {
    await delay()
    if (users.some((u) => u.email === email))
      throw new Error('Email already in use')
    const id = `USR-${String(users.length + 1).padStart(3, '0')}`
    const newUser: UserType = {
      id,
      name,
      email,
      password,
      role: 'customer',
      status: 'active',
      joinedAt: new Date().toISOString().split('T')[0],
    }
    users.push(newUser)
    if (typeof window !== 'undefined')
      localStorage.setItem('users', JSON.stringify(users))
    return newUser
  },

  loginUser: async (email: string, password: string) => {
    await delay()
    return (
      users.find((u) => u.email === email && u.password === password) || null
    )
  },

  getDashboardStats: async () => {
    await delay()
    return {
      totalRevenue: orders
        .filter((o) => o.status === 'completed')
        .reduce((sum, o) => sum + o.total, 0),
      totalOrders: orders.length,
      totalProducts: products.length,
      totalUsers: users.length,
    }
  },

  createOrder: async (
    customerName: string,
    email: string,
    cartItems: Array<{ productId: string; quantity: number; price: number }>,
    total: number,
  ) => {
    await delay()
    const id = `ORD-${String(orders.length + 1).padStart(3, '0')}`
    const newOrder: OrderType = {
      id,
      customerName,
      email,
      cartItems,
      total,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    }
    orders.push(newOrder)
    if (typeof window !== 'undefined')
      localStorage.setItem('orders', JSON.stringify(orders))
    return newOrder
  },
}
