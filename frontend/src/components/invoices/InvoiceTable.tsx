import { TableHeader } from "./TableHeader";
import { FilterRow } from "./FilterRow";
import { InvoiceRow } from "./InvoiceRow";
import {
  type TInvoice,
  type TPagination,
  type TRequestInvoice,
} from "../../types/invoice";
import InvoicesPagination from "./InvoicesPagintaion";

interface InvoiceTableProps {
  invoices: TInvoice[];
  filters: TRequestInvoice;
  onFiltersChange: (filters: TRequestInvoice) => void;
  pagination: TPagination | undefined;
}

export function InvoiceTable({
  invoices,
  filters,
  onFiltersChange,
  pagination,
}: InvoiceTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <TableHeader />
        <tbody className="bg-white divide-y divide-gray-200">
          <FilterRow filters={filters} onFiltersChange={onFiltersChange} />
          {invoices.map((invoice, index) => (
            <InvoiceRow key={invoice.id} invoice={invoice} index={index} />
          ))}
        </tbody>
      </table>

      <InvoicesPagination
        pagination={pagination}
        onPageChange={(page) => onFiltersChange({ ...filters, page })}
        onPageSizeChange={(limit) =>
          onFiltersChange({ ...filters, limit, page: 1 })
        }
        pageSize={filters.limit}
      />
    </div>
  );
}
