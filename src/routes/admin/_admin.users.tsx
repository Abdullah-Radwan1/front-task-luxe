import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  Search,
  Users,
  Mail,
  Calendar,
  Shield,
  Circle,
  UserCog,
  UserCheck,
  UserX,
} from 'lucide-react'
import { useUsers } from '#/hooks/api-hooks/users/useUsers'
import { useSearchParams } from '#/hooks/useSearchParams'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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
import { Button } from '@/components/ui/button'
import { TablePagination } from '@/components/TablePagination'
import { createFileRoute } from '@tanstack/react-router'
import { Avatar, AvatarFallback } from '#/components/ui/avatar'

const PAGE_SIZE = 4
type SortColumn = 'name' | 'joinedAt'
type SortDir = 'asc' | 'desc'
type RoleFilter = 'all' | 'admin' | 'customer'
type StatusFilter = 'all' | 'active' | 'inactive'

// Status configuration
const statusConfig = {
  active: {
    icon: UserCheck,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    dot: 'bg-emerald-500',
    label: 'active',
  },
  inactive: {
    icon: UserX,
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
    dot: 'bg-rose-500',
    label: 'inactive',
  },
}

// Role configuration
const roleConfig = {
  admin: {
    icon: Shield,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    label: 'admin',
  },
  customer: {
    icon: UserCog,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    label: 'customer',
  },
}

export const Route = createFileRoute('/admin/_admin/users')({
  component: AdminUsers,
})

export default function AdminUsers() {
  const { t } = useTranslation()
  const [params, setSearchParams] = useSearchParams()

  const appliedSearch = params.get('search') ?? ''
  const appliedRole = ((): RoleFilter => {
    const role = params.get('role')
    return role === 'admin' || role === 'customer' ? role : 'all'
  })()

  const [page, setPage] = useState(1)
  const [pendingSearch, setPendingSearch] = useState(appliedSearch)
  const [search, setSearch] = useState(appliedSearch)
  const [pendingRole, setPendingRole] = useState<RoleFilter>(appliedRole)
  const [roleFilter, setRoleFilter] = useState<RoleFilter>(appliedRole)
  const [sortCol, setSortCol] = useState<SortColumn>('joinedAt')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const applyFilters = () => {
    const newSearch = pendingSearch
    const newRole = pendingRole

    setSearch(newSearch)
    setRoleFilter(newRole)

    setSearchParams({
      search: newSearch || undefined,
      role: newRole === 'all' ? undefined : newRole,
    })

    setPage(1)
  }

  // Fetch all users (we filter/paginate client-side)
  const { data, isLoading } = useUsers(1, 1000)
  const users = data?.users ?? []

  /* -------------------- Search + Filter + Sort -------------------- */

  const processedUsers = useMemo(() => {
    let list = users

    // 1. Role Filter
    if (roleFilter !== 'all') {
      list = list.filter((u) => u.role === roleFilter)
    }

    // 2. Search
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.id.toLowerCase().includes(q),
      )
    }

    // 3. Sort
    const dir = sortDir === 'asc' ? 1 : -1

    return [...list].sort((a, b) => {
      if (sortCol === 'name') {
        return a.name.localeCompare(b.name) * dir
      }
      return (
        (new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime()) * dir
      )
    })
  }, [users, search, sortCol, sortDir, roleFilter])

  /* -------------------- Pagination -------------------- */

  const totalUsers = processedUsers.length
  const totalPages = Math.max(1, Math.ceil(totalUsers / PAGE_SIZE))
  const paginated = processedUsers.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  )

  const toggleSort = (col: SortColumn) => {
    setPage(1)
    if (sortCol === col) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortCol(col)
      setSortDir('asc')
    }
  }

  // Get sort indicator
  const getSortIndicator = (col: SortColumn) => {
    if (sortCol !== col) return null
    return sortDir === 'asc' ? '↑' : '↓'
  }

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)

  /* -------------------- UI -------------------- */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ scale: 0.9, rotate: -10, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12 }}
            className="p-3 bg-primary/10 rounded-xl cursor-pointer"
          >
            <Users size={30} className="text-accent" />
          </motion.div>

          <motion.div
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <h1 className="text-3xl font-display font-bold">
              {t('admin.users')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {totalUsers} total users
            </p>
          </motion.div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="space-y-4">
        <motion.form
          onSubmit={(e) => {
            e.preventDefault()
            applyFilters()
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="relative flex-1 max-w-sm"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9 pr-10"
              placeholder={t('admin.search')}
              value={pendingSearch}
              onChange={(e) => setPendingSearch(e.target.value)}
            />
            {pendingSearch && (
              <button
                type="button"
                onClick={() => setPendingSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            )}
          </motion.div>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.05 }}
          >
            <Select
              value={pendingRole}
              onValueChange={(value: RoleFilter) => setPendingRole(value)}
            >
              <SelectTrigger className="w-45 border-muted-foreground/20">
                <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder={t('admin.role')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center gap-2">
                    <Circle className="h-4 w-4 text-muted-foreground" />
                    <span>{t('admin.all')}</span>
                  </div>
                </SelectItem>
                {Object.entries(roleConfig).map(([key, config]) => {
                  const Icon = config.icon
                  return (
                    <SelectItem key={key} value={key as RoleFilter}>
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${config.color}`} />
                        <span>{t(`admin.${key}`)}</span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </motion.div>

          <Button type="submit" size="sm" className="self-end">
            {t('admin.apply', 'Apply')}
          </Button>
        </motion.form>

        {/* Active Filter Badges */}
        <div className="flex flex-wrap gap-2">
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
                  setPendingSearch('')
                  setSearchParams({
                    search: undefined,
                    role: roleFilter === 'all' ? undefined : roleFilter,
                  })
                  setPage(1)
                }}
                className="ml-1 hover:text-foreground transition-colors"
              >
                ×
              </button>
            </motion.div>
          )}

          {roleFilter !== 'all' && (
            <motion.div
              initial={{ scale: 0, rotate: 10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-medium text-primary"
            >
              <Shield className="h-3 w-3" />
              <span className="capitalize">{t(`admin.${roleFilter}`)}</span>
              <button
                onClick={() => {
                  setRoleFilter('all')
                  setPendingRole('all')
                  setSearchParams({
                    search: search || undefined,
                    role: undefined,
                  })
                  setPage(1)
                }}
                className="ml-1 hover:text-foreground transition-colors"
              >
                ×
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleSort('name')}
              >
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {t('admin.name')}
                  {getSortIndicator('name')}
                </div>
              </TableHead>
              <TableHead>{t('admin.email')}</TableHead>
              <TableHead>{t('admin.role')}</TableHead>
              <TableHead>{t('admin.status')}</TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleSort('joinedAt')}
              >
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {t('admin.date')}
                  {getSortIndicator('joinedAt')}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                </TableRow>
              ))
            ) : processedUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-32 text-center text-muted-foreground"
                >
                  {t('admin.noUsersFound')}
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((user, index) => {
                const status =
                  statusConfig[user.status as keyof typeof statusConfig]
                const role = roleConfig[user.role as keyof typeof roleConfig]
                const StatusIcon = status?.icon || Circle
                const RoleIcon = role?.icon || Shield

                return (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group hover:bg-muted/30 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm">{user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${role?.bg} ${role?.color} border-0 gap-1`}
                      >
                        <RoleIcon className="h-3 w-3" />
                        {role?.label || user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${status?.bg} ${status?.color} border-0 gap-1.5`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${status?.dot}`}
                        />
                        <StatusIcon className="h-3 w-3" />
                        {t(`admin.${user.status}`)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(user.joinedAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                  </motion.tr>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer with pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {(page - 1) * PAGE_SIZE + 1} to{' '}
          {Math.min(page * PAGE_SIZE, totalUsers)} of {totalUsers} users
        </p>
        <TablePagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  )
}
