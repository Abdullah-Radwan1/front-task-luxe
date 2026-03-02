import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Search, User } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { TablePagination } from "@/components/TablePagination";
import { api } from "@/lib/mock-data";
import { createFileRoute } from "@tanstack/react-router";

const PAGE_SIZE = 4;

type SortColumn = "name" | "joinedAt";
type SortDir = "asc" | "desc";
export const Route = createFileRoute("/admin/_admin/users")({
  component: AdminUsers,
});
export default function AdminUsers() {
  const { t } = useTranslation();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState<SortColumn>("joinedAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: api.getUsers,
  });

  /* -------------------- Search + Sort -------------------- */

  const processedUsers = useMemo(() => {
    let list = users;

    // Search
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
      );
    }

    // Sort
    const dir = sortDir === "asc" ? 1 : -1;

    return [...list].sort((a, b) => {
      if (sortCol === "name") {
        return a.name.localeCompare(b.name) * dir;
      }
      return (
        (new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime()) * dir
      );
    });
  }, [users, search, sortCol, sortDir]);

  /* -------------------- Pagination -------------------- */

  const totalPages = Math.ceil(processedUsers.length / PAGE_SIZE);

  const paginated = useMemo(
    () => processedUsers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [processedUsers, page],
  );

  const toggleSort = (col: SortColumn) => {
    setPage(1);
    if (sortCol === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
  };

  /* -------------------- UI -------------------- */

  return (
    <div>
      <h1 className="text-2xl items-baseline flex gap-2 font-bold mb-6">
        {t("admin.users")} <User size={20} />
      </h1>
      {/* Search */}
      <div className="relative max-w-sm mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder={t("admin.search")}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => toggleSort("name")}
              >
                {t("admin.name")}
                {sortCol === "name" && (sortDir === "asc" ? " ↑" : " ↓")}
              </TableHead>

              <TableHead>{t("admin.email")}</TableHead>
              <TableHead>{t("admin.role")}</TableHead>
              <TableHead>{t("admin.status")}</TableHead>

              <TableHead
                className="cursor-pointer"
                onClick={() => toggleSort("joinedAt")}
              >
                {t("admin.date")}
                {sortCol === "joinedAt" && (sortDir === "asc" ? " ↑" : " ↓")}
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading
              ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : paginated.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.role === "admin" ? "default" : "secondary"
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.status === "active" ? "default" : "secondary"
                        }
                      >
                        {t(`admin.${user.status}`)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.joinedAt}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
      <TablePagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
