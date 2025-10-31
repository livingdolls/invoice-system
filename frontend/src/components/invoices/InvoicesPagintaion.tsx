import { ChevronLeft, ChevronRight } from "lucide-react";
import type { TPagination } from "../../types/invoice";

type InvoicesPaginationProps = {
  pagination?: TPagination;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (limit: number) => void;
  pageSize?: number;
};

export default function InvoicesPagination({
  pagination,
  onPageChange,
  onPageSizeChange,
  pageSize = 10,
}: InvoicesPaginationProps) {
  if (!pagination) return null;

  const { total_items, total_pages, current_page, prev_page, next_page } =
    pagination;

  const canPrev = !!prev_page && current_page > 1;
  const canNext = !!next_page && current_page < total_pages;

  const start = Math.max(1, current_page - 2);
  const end = Math.min(total_pages, start + 4);
  const pages: number[] = [];
  for (let p = start; p <= end; p++) pages.push(p);

  const from = total_pages > 0 ? (current_page - 1) * pageSize + 1 : 0;
  const to = Math.min(current_page * pageSize, total_items);

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-4">
      {/* Range info */}
      <div className="text-sm text-gray-600">
        {total_items > 0 ? (
          <span>
            Showing <span className="font-medium">{from}</span> to{" "}
            <span className="font-medium">{to}</span> of
            <span className="font-medium"> {total_items}</span> results
          </span>
        ) : (
          <span>No results</span>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* Pager */}
        <nav
          className="inline-flex -space-x-px rounded-md shadow-sm"
          aria-label="Pagination"
        >
          <button
            type="button"
            disabled={!canPrev}
            onClick={() => canPrev && onPageChange?.(current_page - 1)}
            className={`relative inline-flex items-center px-2 py-2 text-sm font-medium rounded-md ${
              canPrev
                ? "bg-accent-200 text-white"
                : "text-gray-400 border-gray-200 cursor-not-allowed"
            }`}
          >
            <ChevronLeft size={18} />
          </button>
          {pages.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange?.(p)}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-medium  ${
                p === current_page
                  ? "z-10 bg-accent-200 bg-opacity-20 text-accent-200"
                  : "text-accent-200"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            disabled={!canNext}
            onClick={() => canNext && onPageChange?.(current_page + 1)}
            className={`relative inline-flex items-center px-2 py-2 text-sm font-medium border rounded-md ${
              canNext
                ? "bg-accent-200 text-white"
                : "bg-gray-100 text-gray-400  cursor-not-allowed"
            }`}
          >
            <ChevronRight size={18} />
          </button>
        </nav>
      </div>
    </div>
  );
}
