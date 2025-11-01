import { useState, useCallback, useRef } from 'react';
import { downloadInvoicePDF, type PDFOptions } from '../utils/pdfGenerator';
import type { TInvoiceDetail } from '../types/invoice';

export const usePDFDownload = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const timeoutRef = useRef<number[]>([]);

  // Clear all timeouts on unmount
  const clearTimeouts = useCallback(() => {
    timeoutRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutRef.current = [];
  }, []);

  const downloadInvoice = useCallback(async (
    invoice: TInvoiceDetail,
    options?: Partial<PDFOptions>
  ) => {
    // Clear any existing timeouts
    clearTimeouts();

    // Validation
    if (!invoice) {
      const errorMsg = 'Invoice data is required for PDF generation';
      setError(errorMsg);
      throw new Error(errorMsg);
    }

    if (!invoice.invoice_number) {
      const errorMsg = 'Invoice number is missing';
      setError(errorMsg);
      throw new Error(errorMsg);
    }

    // Additional validations
    if (!invoice.customer) {
      const errorMsg = 'Customer information is required';
      setError(errorMsg);
      throw new Error(errorMsg);
    }

    if (!invoice.items || invoice.items.length === 0) {
      const errorMsg = 'Invoice must have at least one item';
      setError(errorMsg);
      throw new Error(errorMsg);
    }

    setIsGenerating(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Generate better filename
      const filename = options?.filename || `invoice-${invoice.invoice_number}-${new Date().toISOString().split('T')[0]}.pdf`;
      
      const enhancedOptions: Partial<PDFOptions> = {
        filename,
        format: 'a4',
        orientation: 'portrait',
        quality: 1.0,
        margin: { top: 20, right: 20, bottom: 20, left: 20 },
        ...options
      };

      await downloadInvoicePDF(invoice, enhancedOptions);
      
      const successMsg = `PDF "${filename}" downloaded successfully`;
      setSuccessMessage(successMsg);
      
      // Clear success message after 3 seconds
      const successTimeout = setTimeout(() => setSuccessMessage(null), 3000);
      timeoutRef.current.push(successTimeout);
      
    } catch (err) {
      let errorMessage = 'Failed to generate PDF';
      
      if (err instanceof Error) {
        // More specific error messages
        if (err.message.includes('jsPDF')) {
          errorMessage = 'PDF generation failed. Please try again.';
        } else if (err.message.includes('canvas') || err.message.includes('html2canvas')) {
          errorMessage = 'Failed to capture content. Please check your browser compatibility.';
        } else if (err.message.includes('network') || err.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      console.error('PDF generation error:', err);
      
      // Clear error after 5 seconds
      const errorTimeout = setTimeout(() => setError(null), 5000);
      timeoutRef.current.push(errorTimeout);
      
      throw err; // Re-throw for component to handle
    } finally {
      setIsGenerating(false);
    }
  }, [clearTimeouts]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  const clearSuccess = useCallback(() => {
    setSuccessMessage(null);
  }, []);

  // Cleanup function
  const cleanup = useCallback(() => {
    clearTimeouts();
    setIsGenerating(false);
    setError(null);
    setSuccessMessage(null);
  }, [clearTimeouts]);

  return {
    downloadInvoice,
    isGenerating,
    error,
    successMessage,
    clearError,
    clearSuccess,
    cleanup
  };
};