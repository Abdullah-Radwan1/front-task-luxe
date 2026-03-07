import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Archive,
  Search,
  Filter,
  Calendar,
  DollarSign,
  User,
  Hash,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Download,
  Sparkles,
  List,
} from 'lucide-react'
import { useOrders } from '#/hooks/api-hooks/orders/useOrders'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { TablePagination } from '@/components/TablePagination'
import { createFileRoute } from '@tanstack/react-router'

const PAGE_SIZE = 4

/* -------------------- Types -------------------- */

type SortColumn = 'total' | 'date' | 'customerName'
type SortDir = 'asc' | 'desc'
type OrderStatus = 'all' | 'completed' | 'pending' | 'cancelled'

/* -------------------- Status Configuration -------------------- */

const statusConfig = {
  completed: {
    label: 'completed',
    icon: CheckCircle2,
    variant: 'default' as const,
    gradient: 'from-emerald-500/20 to-emerald-500/5',
    badgeClass:
      'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    dotClass: 'bg-emerald-500',
  },
  pending: {
    label: 'pending',
    icon: Clock,
    variant: 'secondary' as const,
    gradient: 'from-amber-500/20 to-amber-500/5',
    badgeClass:
      'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    dotClass: 'bg-amber-500',
  },
  cancelled: {
    label: 'cancelled',
    icon: XCircle,
    variant: 'destructive' as const,
    gradient: 'from-rose-500/20 to-rose-500/5',
    badgeClass:
      'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    dotClass: 'bg-rose-500',
  },
}

/* -------------------- Component -------------------- */
export const Route = createFileRoute('/admin/_admin/orders')({
  component: AdminOrders,
})

export default function AdminOrders() {
  const { t } = useTranslation()

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus>('all')
  const [sortCol, setSortCol] = useState<SortColumn>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])

  const { data, isLoading } = useOrders({ page, pageSize: PAGE_SIZE })
  const orders = data?.orders ?? []
  const totalPages = data?.totalPages ?? 1

  /* -------------------- Search + Filter + Sort -------------------- */

  const processedOrders = useMemo(() => {
    let list = orders

    // 1. Status Filter
    if (statusFilter !== 'all') {
      list = list.filter((o) => o.status === statusFilter)
    }

    // 2. Search
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.total.toString().includes(q),
      )
    }

    // 3. Sort
    const dir = sortDir === 'asc' ? 1 : -1

    return [...list].sort((a, b) => {
      if (sortCol === 'total') {
        return (a.total - b.total) * dir
      }
      if (sortCol === 'customerName') {
        return a.customerName.localeCompare(b.customerName) * dir
      }
      return (
        (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) *
        dir
      )
    })
  }, [orders, search, sortCol, sortDir, statusFilter])

  /* -------------------- Pagination -------------------- */

  const paginated = data?.orders ?? []

  const toggleSort = (col: SortColumn) => {
    setPage(1)
    if (sortCol === col) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortCol(col)
      setSortDir('asc')
    }
  }

  // Selection handlers
  const toggleAll = () => {
    if (selectedOrders.length === paginated.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(paginated.map((o) => o.id))
    }
  }

  const toggleOne = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId],
    )
  }

  // Get sort indicator
  const getSortIndicator = (col: SortColumn) => {
    if (sortCol !== col) return null
    return sortDir === 'asc' ? '↑' : '↓'
  }

  /* -------------------- UI -------------------- */

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header with decorative elements */}
      <div className="relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0.9, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="p-3 bg-linear-to-br from-accent/20 to-accent/5 rounded-2xl"
            >
              <Archive className="h-6 w-6 text-accent" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-display font-bold bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {t('admin.orders')}
              </h1>
              <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                <span className="flex items-center gap-1">
                  <Hash className="h-3 w-3" />
                  {processedOrders.length} total orders
                </span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                <span className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  {processedOrders
                    .reduce((sum, o) => sum + o.total, 0)
                    .toLocaleString()}
                </span>
              </p>
            </div>
          </div>

          {/* Bulk actions when items selected */}
          {selectedOrders.length > 0 && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full border border-accent/20"
            >
              <span className="text-sm font-medium">
                {selectedOrders.length} selected
              </span>
              <Button variant="ghost" size="sm" className="h-8 gap-1">
                <Download className="h-4 w-4" /> Export
              </Button>
            </motion.div>
          )}

          {/* Quick actions */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button size="sm" className="gap-2 bg-accent hover:bg-accent/90">
              <Sparkles className="h-4 w-4" />
              New Order
            </Button>
          </div>
        </div>
      </div>

      {/* Search + Filter Inputs */}
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          {/* Search */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="relative flex-1 max-w-md"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              placeholder={t('admin.search')}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
                setSelectedOrders([])
              }}
              className="pl-9 border-muted-foreground/20 focus-visible:ring-accent"
            />
          </motion.div>

          {/* Status Filter */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.05 }}
          >
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value as OrderStatus)
                setPage(1)
                setSelectedOrders([])
              }}
            >
              <SelectTrigger className="w-45 border-muted-foreground/20">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder={t('admin.status')} />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center gap-2">
                    <List className="h-4 w-4 text-muted-foreground" />
                    <span>{t('admin.all')}</span>
                  </div>
                </SelectItem>

                {Object.entries(statusConfig).map(([key, config]) => {
                  const Icon = config.icon
                  return (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <Icon
                          className={`h-4 w-4 ${key === 'completed' ? 'text-green-500' : key === 'pending' ? 'text-yellow-500' : 'text-red-500'}`}
                        />
                        <span>{t(`admin.${key}`)}</span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </motion.div>
        </motion.div>

        {/* Active Filter Badges */}
        <div className="flex flex-wrap gap-2">
          <AnimatePresence mode="popLayout">
            {/* Search Badge */}
            {search && (
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-xs font-medium text-accent"
              >
                <Search className="h-3 w-3" />
                <span>{search}</span>
                <button
                  onClick={() => {
                    setSearch('')
                    setSelectedOrders([])
                  }}
                  className="ml-1 hover:text-foreground transition-colors"
                >
                  ×
                </button>
              </motion.div>
            )}

            {/* Status Badge */}
            {statusFilter !== 'all' && (
              <motion.div
                initial={{ scale: 0, rotate: 10 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-medium text-primary"
              >
                <Filter className="h-3 w-3" />
                <span className="capitalize">{t(`admin.${statusFilter}`)}</span>
                <button
                  onClick={() => {
                    setStatusFilter('all')
                    setSelectedOrders([])
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
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border overflow-hidden bg-card shadow-sm"
      >
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    selectedOrders.length === paginated.length &&
                    paginated.length > 0
                  }
                  onCheckedChange={toggleAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/80 transition-colors group"
                onClick={() => toggleSort('customerName')}
              >
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
                  {t('admin.customerName')}
                  <span className="text-xs ml-1 text-muted-foreground">
                    {getSortIndicator('customerName')}
                  </span>
                </div>
              </TableHead>
              <TableHead className="font-mono text-xs">ID</TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/80 transition-colors group"
                onClick={() => toggleSort('total')}
              >
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
                  {t('admin.amount')}
                  <span className="text-xs ml-1 text-muted-foreground">
                    {getSortIndicator('total')}
                  </span>
                </div>
              </TableHead>
              <TableHead>{t('admin.status')}</TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/80 transition-colors group"
                onClick={() => toggleSort('date')}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
                  {t('admin.date')}
                  <span className="text-xs ml-1 text-muted-foreground">
                    {getSortIndicator('date')}
                  </span>
                </div>
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-4" />
                  </TableCell>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-48 text-center">
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="flex flex-col items-center justify-center gap-2"
                  >
                    <Archive className="h-12 w-12 text-muted-foreground/30" />
                    <p className="text-muted-foreground">
                      {t('admin.noOrdersFound')}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearch('')
                        setStatusFilter('all')
                        setSelectedOrders([])
                      }}
                    >
                      Clear filters
                    </Button>
                  </motion.div>
                </TableCell>
              </TableRow>
            ) : (
              <AnimatePresence>
                {paginated.map((order, index) => {
                  const status = order.status as keyof typeof statusConfig
                  const config = statusConfig[status]
                  const StatusIcon = config?.icon || Clock

                  return (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="group hover:bg-muted/30 transition-colors"
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedOrders.includes(order.id)}
                          onCheckedChange={() => toggleOne(order.id)}
                          aria-label={`Select order ${order.id}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-linear-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                            <User className="h-4 w-4 text-accent" />
                          </div>
                          {order.customerName}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        #{order.id.slice(-6)}
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold">
                          ${order.total.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={config?.variant || 'secondary'}
                          className={`${config?.badgeClass} gap-1.5 px-2 py-1`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${config?.dotClass}`}
                          />
                          <StatusIcon className="h-3 w-3" />
                          {t(`admin.${order.status}`)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="gap-2">
                              <Eye className="h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Download className="h-4 w-4" />
                              Download
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  )
                })}
              </AnimatePresence>
            )}
          </TableBody>
        </Table>
      </motion.div>

      {/* Footer with pagination and summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-between"
      >
        <div className="text-sm text-muted-foreground">
          Showing {(page - 1) * PAGE_SIZE + 1} to{' '}
          {Math.min(page * PAGE_SIZE, processedOrders.length)} of{' '}
          {processedOrders.length} orders
          {selectedOrders.length > 0 && ` · ${selectedOrders.length} selected`}
        </div>
        <TablePagination
          page={page}
          totalPages={totalPages}
          onPageChange={(newPage) => {
            setPage(newPage)
            setSelectedOrders([])
          }}
        />
      </motion.div>
    </motion.div>
  )
}
