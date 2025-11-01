import { useRef, useCallback } from 'react';
import { useReactToPrint } from 'react-to-print';
import type { TInvoiceDetail } from '../types/invoice';

export const usePrintInvoice = () => {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: 'Invoice',
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

  const printInvoice = useCallback((invoice: TInvoiceDetail) => {
    if (componentRef.current) {
      // Set the document title dynamically
      const originalTitle = document.title;
      document.title = `Invoice-${invoice.invoice_number}`;
      
      handlePrint();
      
      // Restore original title after a delay
      setTimeout(() => {
        document.title = originalTitle;
      }, 1000);
    } else {
      console.error('Print component ref is not available');
    }
  }, [handlePrint]);

  return {
    componentRef,
    printInvoice,
  };
};