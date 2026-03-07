import { useState } from 'react'
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
import { TablePagination } from '@/components/TablePagination'
import { createFileRoute } from '@tanstack/react-router'
import { Avatar, AvatarFallback } from '#/components/ui/avatar'

const PAGE_SIZE = 4
type SortColumn = 'name' | 'joinedAt'
type SortDir = 'asc' | 'desc'

export const Route = createFileRoute('/admin/_admin/users')({
  component: AdminUsers,
})

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

export default function AdminUsers() {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [sortCol, setSortCol] = useState<SortColumn>('joinedAt')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  // Fetch paginated users from API
  const { data, isLoading } = useUsers(page, PAGE_SIZE)

  const users = data?.users ?? []
  const totalPages = data?.totalPages ?? 1
  const totalUsers = data?.total ?? 0

  const toggleSort = (col: SortColumn) => {
    setPage(1)
    if (sortCol === col) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortCol(col)
      setSortDir('asc')
    }
  }

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)

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

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9 pr-10"
          placeholder={t('admin.search')}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            ×
          </button>
        )}
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
                  {sortCol === 'name' && (sortDir === 'asc' ? ' ↑' : ' ↓')}
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
                  {sortCol === 'joinedAt' && (sortDir === 'asc' ? ' ↑' : ' ↓')}
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
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-32 text-center text-muted-foreground"
                >
                  {t('admin.noUsersFound')}
                </TableCell>
              </TableRow>
            ) : (
              users.map((user, index) => {
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
