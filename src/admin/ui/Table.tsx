import type { ReactNode } from "react";
import { EmptyState } from "./Primitives";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  /** Alignment for the cell. */
  align?: "left" | "right" | "center";
  /** Hide this column below `sm` in the desktop table. */
  hideOnMobile?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: ReactNode;
}

/**
 * Responsive admin list.
 *
 * - `md` and up: a conventional table.
 * - below `md`: every row becomes a stacked card, so the same data is easy
 *   to scan on phones. Both are always in the DOM and toggled with CSS, so
 *   content is never gated behind a JS resize listener.
 */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  emptyTitle = "Nothing here yet",
  emptyDescription,
  emptyIcon,
}: DataTableProps<T>) {
  if (rows.length === 0) {
    return (
      <EmptyState title={emptyTitle} description={emptyDescription} icon={emptyIcon} />
    );
  }

  // Columns with an empty header are treated as action columns.
  const dataColumns = columns.filter((c) => c.header !== "");
  const actionColumns = columns.filter((c) => c.header === "");

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-default">
              {columns.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  className={cn(
                    "px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-text-muted whitespace-nowrap",
                    c.align === "right" && "text-right",
                    c.align === "center" && "text-center",
                    c.hideOnMobile && "hidden sm:table-cell",
                  )}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={rowKey(row)}
                className="border-b border-border-default last:border-0 hover:bg-bg-soft/70 transition-colors"
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={cn(
                      "px-4 py-3.5 align-middle",
                      c.align === "right" && "text-right",
                      c.align === "center" && "text-center",
                      c.hideOnMobile && "hidden sm:table-cell",
                    )}
                  >
                    {c.render ? c.render(row) : <span className="text-text-secondary">—</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3 p-1.5">
        {rows.map((row) => (
          <article
            key={rowKey(row)}
            className="rounded-card-lg border border-border-default bg-white p-4 shadow-card"
          >
            <dl className="space-y-2.5">
              {dataColumns.map((c) => (
                <div key={c.key} className="flex items-start justify-between gap-3">
                  <dt className="flex-shrink-0 pt-0.5 text-[11px] font-bold uppercase tracking-wide text-text-muted">
                    {c.header}
                  </dt>
                  <dd className="min-w-0 text-right text-sm text-text-secondary break-words">
                    {c.render ? c.render(row) : "—"}
                  </dd>
                </div>
              ))}
            </dl>
            {actionColumns.length > 0 && (
              <div className="mt-3.5 flex items-center justify-end gap-1 border-t border-border-default pt-3">
                {actionColumns.map((c) => (
                  <span key={c.key} className="inline-flex">
                    {c.render ? c.render(row) : null}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </>
  );
}
