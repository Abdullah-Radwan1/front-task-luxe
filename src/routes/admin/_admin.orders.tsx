import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Archive, BoxesIcon, Search } from "lucide-react";

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

/* -------------------- Types -------------------- */

type SortColumn = "total" | "date";
type SortDir = "asc" | "desc";

/* -------------------- Status -------------------- */

const statusVariant = {
  completed: "default" as const,
  pending: "secondary" as const,
  cancelled: "destructive" as const,
};

/* -------------------- Component -------------------- */
export const Route = createFileRoute("/admin/_admin/orders")({
  component: AdminOrders,
});
export default function AdminOrders() {
  const { t } = useTranslation();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState<SortColumn>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: api.getOrders,
  });

  /* -------------------- Search + Sort -------------------- */

  const processedOrders = useMemo(() => {
    let list = orders;

    // Search
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customer.toLowerCase().includes(q),
      );
    }

    // Sort
    const dir = sortDir === "asc" ? 1 : -1;

    return [...list].sort((a, b) => {
      if (sortCol === "total") {
        return (a.total - b.total) * dir;
      }
      return (new Date(a.date).getTime() - new Date(b.date).getTime()) * dir;
    });
  }, [orders, search, sortCol, sortDir]);

  /* -------------------- Pagination -------------------- */

  const totalPages = Math.ceil(processedOrders.length / PAGE_SIZE);

  const paginated = useMemo(
    () => processedOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [processedOrders, page],
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
        {t("admin.orders")} <Archive size={20} />
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

      {/* Table */}
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>{t("admin.customer")}</TableHead>

              <TableHead
                className="cursor-pointer"
                onClick={() => toggleSort("total")}
              >
                {t("admin.amount")}
                {sortCol === "total" && (sortDir === "asc" ? " ↑" : " ↓")}
              </TableHead>

              <TableHead>{t("admin.status")}</TableHead>

              <TableHead
                className="cursor-pointer"
                onClick={() => toggleSort("date")}
              >
                {t("admin.date")}
                {sortCol === "date" && (sortDir === "asc" ? " ↑" : " ↓")}
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
              : paginated.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">
                      {order.id}
                    </TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>${order.total.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[order.status]}>
                        {t(`admin.${order.status}`)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {order.date}
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
