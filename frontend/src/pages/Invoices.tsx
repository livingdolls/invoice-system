import { useRef, useState } from 'react';
import { useInvoices } from "../hooks/useInvoices";
import { useInvoiceFilters } from "../hooks/useInvoiceFilters";
import {
  FilterControls,
  InvoiceTable,
  LoadingState,
  ErrorState,
  EmptyState,
} from "../components/invoices";
import { GetInvoiceByIdRepository } from "../repository/Invoices";
import { useReactToPrint } from 'react-to-print';
import PrintableInvoice from '../components/invoices/PrintableInvoice';
import type { TInvoiceDetail } from '../types/invoice';

export default function Invoices() {
  const { filters, updateFilters } = useInvoiceFilters();
  const { data, error, isLoading } = useInvoices(filters);
  const [currentInvoice, setCurrentInvoice] = useState<TInvoiceDetail | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: currentInvoice ? `Invoice-${currentInvoice.invoice_number}` : 'Invoice',
    pageStyle: `
      @page {
        size: A4;
        margin: 10mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
        }
        .bg-gray-100 {
          background-color: #f3f4f6 !important;
        }
        .bg-gray-50 {
          background-color: #f9fafb !important;
        }
        .bg-green-500 {
          background-color: #10b981 !important;
        }
        .bg-red-500 {
          background-color: #ef4444 !important;
        }
        table, th, td {
          border: 1px solid #d1d5db !important;
        }
      }
    `,
  });

  const handleDownloadInvoice = async (invoiceId: string) => {
    try {
      const invoice = await GetInvoiceByIdRepository(invoiceId);
      
      if (!invoice) {
        alert("Invoice data is not available");
        return;
      }

      setCurrentInvoice(invoice);
      setTimeout(() => {
        handlePrint();
        setTimeout(() => {
          setCurrentInvoice(null);
        }, 1000);
      }, 100);

    } catch (error) {
      console.error("Error downloading invoice:", error);
      alert("Failed to load invoice data");
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState />;
  }

  const invoices = data?.invoices || [];

  return (
    <div className="space-y-6">
      <FilterControls />

      {/* Invoices Table */}
      {!invoices ? (
        <EmptyState />
      ) : (
        <InvoiceTable
          invoices={invoices}
          filters={filters}
          onFiltersChange={updateFilters}
          pagination={data?.pagination}
          downloadInvoice={handleDownloadInvoice}
        />
      )}

      {/* Hidden printable invoice component */}
      {currentInvoice && (
        <div className="hidden">
          <PrintableInvoice ref={printRef} invoice={currentInvoice} />
        </div>
      )}
    </div>
  );
}
