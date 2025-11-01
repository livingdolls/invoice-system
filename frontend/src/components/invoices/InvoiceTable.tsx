import { TableHeader } from "./TableHeader";
import { FilterRow } from "./FilterRow";
import { InvoiceRow } from "./InvoiceRow";
import {
  type TInvoice,
  type TPagination,
  type TRequestInvoice,
} from "../../types/invoice";
import InvoicesPagination from "./InvoicesPagintaion";

type InvoiceTableProps = {
  invoices: TInvoice[];
  filters: TRequestInvoice;
  onFiltersChange: (filters: TRequestInvoice) => void;
  pagination: TPagination | undefined;
  downloadInvoice: (invoiceId: string) => void;
  isDownloading?: boolean;
  downloadError?: string | null;
  downloadSuccess?: string | null;
}

export function InvoiceTable({
  invoices,
  filters,
  onFiltersChange,
  pagination,
  downloadInvoice,
  isDownloading = false,
  downloadError = null,
  downloadSuccess = null
}: InvoiceTableProps) {
  return (
    <div className="overflow-x-auto">
      {/* PDF Download Status Feedback */}
      {(isDownloading || downloadError || downloadSuccess) && (
        <div className="mb-4">
          {isDownloading && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-blue-800 text-sm">Generating PDF...</span>
            </div>
          )}
          
          {downloadError && !isDownloading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <span className="text-red-800 text-sm">Error: {downloadError}</span>
            </div>
          )}
          
          {downloadSuccess && !isDownloading && !downloadError && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <span className="text-green-800 text-sm">{downloadSuccess}</span>
            </div>
          )}
        </div>
      )}

      <table className="min-w-full border-separate border-spacing-y-2">
        <TableHeader />
        <tbody className="">
          <FilterRow filters={filters} onFiltersChange={onFiltersChange} />
          {invoices.map((invoice, index) => {
            const currentPage = filters.page || 1;
            const limit = filters.limit || 10;
            const actualRowNumber = (currentPage - 1) * limit + index + 1;
            
            return (
              <InvoiceRow 
                key={invoice.id} 
                invoice={invoice} 
                index={index}
                rowNumber={actualRowNumber}
                downloadInvoice={downloadInvoice} 
              />
            );
          })}
        </tbody>
      </table>

      <InvoicesPagination
        pagination={pagination}
        onPageChange={(page) => onFiltersChange({ ...filters, page })}
        pageSize={filters.limit}
      />
    </div>
  );
}
