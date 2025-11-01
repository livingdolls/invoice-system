import React from 'react';
import type { TInvoiceDetail } from '../../types/invoice';
import { usePrintInvoice } from '../../hooks/usePrintInvoice';
import PrintableInvoice from './PrintableInvoice';

interface PrintInvoiceButtonProps {
  invoice: TInvoiceDetail;
  className?: string;
  children?: React.ReactNode;
}

const PrintInvoiceButton: React.FC<PrintInvoiceButtonProps> = ({
  invoice,
  className = '',
  children = 'Print Invoice'
}) => {
  const { componentRef, printInvoice } = usePrintInvoice();

  const handlePrint = () => {
    printInvoice(invoice);
  };

  return (
    <>
      <button
        onClick={handlePrint}
        className={`${className}`}
      >
        {children}
      </button>
      
      {/* Hidden printable component */}
      <div className="hidden">
        <PrintableInvoice ref={componentRef} invoice={invoice} />
      </div>
    </>
  );
};

export default PrintInvoiceButton;