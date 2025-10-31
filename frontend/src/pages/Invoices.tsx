import { Card } from "../components/ui";
import { useInvoices } from "../hooks/useInvoices";
import { useInvoiceFilters } from "../hooks/useInvoiceFilters";
import {
  FilterControls,
  InvoiceTable,
  LoadingState,
  ErrorState,
  EmptyState,
} from "../components/invoices";

export default function Invoices() {
  const { filters, updateFilters, resetFilters } = useInvoiceFilters();
  const { data, error, isLoading } = useInvoices(filters);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState />;
  }

  const invoices = data?.invoices || [];

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <Card>
        <FilterControls filters={filters} onResetFilters={resetFilters} />
      </Card>

      {/* Invoices Table */}
      <Card>
        {!invoices ? (
          <EmptyState />
        ) : (
          <InvoiceTable
            invoices={invoices}
            filters={filters}
            onFiltersChange={updateFilters}
            pagination={data?.pagination}
          />
        )}
      </Card>
    </div>
  );
}
