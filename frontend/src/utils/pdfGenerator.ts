import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { TInvoiceDetail } from '../types/invoice';

export interface PDFOptions {
  filename?: string;
  format?: 'a4' | 'letter';
  orientation?: 'portrait' | 'landscape';
  quality?: number;
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export class InvoicePDFGenerator {
  private static defaultOptions: PDFOptions = {
    filename: 'invoice.pdf',
    format: 'a4',
    orientation: 'portrait',
    quality: 1.0,
    margin: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20
    }
  };

  /**
   * Generate PDF from HTML element
   */
  static async generateFromElement(
    element: HTMLElement,
    options: Partial<PDFOptions> = {}
  ): Promise<void> {
    const opts = { ...this.defaultOptions, ...options };
    
    try {
      // Generate canvas from HTML element
      const canvas = await html2canvas(element, {
        scale: opts.quality,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      // Calculate dimensions
      const imgWidth = 210 - opts.margin!.left - opts.margin!.right; // A4 width minus margins
      const pageHeight = 295 - opts.margin!.top - opts.margin!.bottom; // A4 height minus margins
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      // Create PDF
      const pdf = new jsPDF(opts.orientation, 'mm', opts.format);
      let position = opts.margin!.top;

      // Add first page
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        opts.margin!.left,
        position,
        imgWidth,
        imgHeight
      );
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + opts.margin!.top;
        pdf.addPage();
        pdf.addImage(
          canvas.toDataURL('image/png'),
          'PNG',
          opts.margin!.left,
          position,
          imgWidth,
          imgHeight
        );
        heightLeft -= pageHeight;
      }

      // Save the PDF
      pdf.save(opts.filename!);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF');
    }
  }

  /**
   * Generate invoice PDF with custom template
   */
  static async generateInvoicePDF(
    invoice: TInvoiceDetail,
    options: Partial<PDFOptions> = {}
  ): Promise<void> {
    const opts = { 
      ...this.defaultOptions, 
      filename: `invoice-${invoice.invoice_number}.pdf`,
      ...options 
    };

    try {
      const pdf = new jsPDF(opts.orientation, 'mm', opts.format);
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Set margins
      const margin = opts.margin!;
      const contentWidth = pageWidth - margin.left - margin.right;
      
      let yPosition = margin.top;

      // Header Section
      pdf.setFontSize(36);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text('INVOICE', margin.left, yPosition + 5);

      // Status Badge (PAID/UNPAID) - positioned after header
      const statusText = invoice.status.toUpperCase();
      const statusColor = invoice.status === 'paid' ? [76, 175, 80] : [244, 67, 54]; // Green for PAID, Red for UNPAID
      
      // Calculate status badge dimensions
      const statusWidth = statusText.length * 3 + 8;
      const statusHeight = 8;
      const statusX = margin.left + 120;
      const statusY = yPosition - 8;
      
      // Status background with rounded corners
      pdf.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
      pdf.roundedRect(statusX, statusY, statusWidth, statusHeight, 1, 1, 'F');
      
      // Status text
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 255, 255);
      const textWidth = pdf.getStringUnitWidth(statusText) * pdf.getFontSize() / pdf.internal.scaleFactor;
      const textX = statusX + (statusWidth - textWidth) / 2;
      pdf.text(statusText, textX, statusY + 5);

      // Company Info and Customer Info at header level
      const companyX = margin.left + contentWidth - 70;
      const headerY = yPosition; // Same level as INVOICE header
      
      // Company Info (Right Side) - aligned with header
      pdf.setTextColor(120, 120, 120);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.text('From', companyX, headerY);
      
      let companyY = headerY + 6;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Your Company Name', companyX, companyY);
      
      companyY += 5;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(120, 120, 120);
      pdf.text('123 Business Street', companyX, companyY);
      
      companyY += 4;
      pdf.text('City, State 12345', companyX, companyY);
      
      companyY += 4;
      pdf.text('Country', companyX, companyY);

      // Invoice Details Section (Left Side) - positioned alongside company info
      const leftColumnX = margin.left;
      const invoiceDetailsY = headerY + 25; // Increased from 10 to 25 for more space from INVOICE header
      
      // Invoice Details
      pdf.setTextColor(120, 120, 120);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      
      const invoiceDetails = [
        ['Invoice ID', invoice.invoice_number],
        ['Issue Date', new Date(invoice.issue_date).toLocaleDateString('en-GB')],
        ['Due Date', new Date(invoice.due_date).toLocaleDateString('en-GB')],
        ['Subject', invoice.subject]
      ];

      let detailY = invoiceDetailsY;
      invoiceDetails.forEach((detail) => {
        pdf.setTextColor(120, 120, 120);
        pdf.setFont('helvetica', 'normal');
        pdf.text(detail[0], leftColumnX, detailY);
        
        pdf.setTextColor(0, 0, 0);
        pdf.setFont('helvetica', 'normal');
        pdf.text(detail[1], leftColumnX + 35, detailY);
        detailY += 7;
      });

      yPosition += 25; // Reduced from 40 to 25 - smaller gap between From and For

      // Customer Info Section - positioned below company info
      pdf.setTextColor(120, 120, 120);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.text('For', companyX, yPosition);
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      let customerY = yPosition + 8;
      pdf.text(invoice.customer.name, companyX, customerY);
      
      customerY += 7;
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(120, 120, 120);
      
      if (invoice.customer.address) {
        pdf.text(invoice.customer.address, companyX, customerY);
        customerY += 5;
      }

      yPosition += 35;

      yPosition += 15; // Space before items table

      // Items Table - Simple Implementation
      const tableStartY = yPosition;
      
      // Draw table header
      pdf.setFillColor(240, 240, 240);
      pdf.rect(margin.left, tableStartY, contentWidth, 8, 'F');
      
      // Header border
      pdf.setLineWidth(0.2);
      pdf.setDrawColor(180, 180, 180);
      pdf.rect(margin.left, tableStartY, contentWidth, 8, 'S');
      
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(60, 60, 60);
      
      // Header text
      pdf.text('Item Type', margin.left + 2, tableStartY + 5.5);
      pdf.text('Description', margin.left + 32, tableStartY + 5.5);
      pdf.text('Quantity', margin.left + 115, tableStartY + 5.5);
      pdf.text('Unit Price', margin.left + 140, tableStartY + 5.5);
      pdf.text('Amount', margin.left + 170, tableStartY + 5.5);

      yPosition = tableStartY + 8;

      // Table Rows - Simple Implementation
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(0, 0, 0);
      
      invoice.items.forEach((item, index) => {
        if (yPosition > pageHeight - 40) {
          pdf.addPage();
          yPosition = margin.top;
        }

        const rowHeight = 7;

        // Row background
        if (index % 2 === 1) {
          pdf.setFillColor(248, 248, 248);
          pdf.rect(margin.left, yPosition, contentWidth, rowHeight, 'F');
        }

        // Row border
        pdf.setLineWidth(0.1);
        pdf.setDrawColor(220, 220, 220);
        pdf.rect(margin.left, yPosition, contentWidth, rowHeight, 'S');

        // Row text
        pdf.setTextColor(0, 0, 0);
        pdf.text(item.type, margin.left + 2, yPosition + 4.5);
        
        // Truncate description if too long
        let description = item.item_name;
        if (description.length > 25) {
          description = description.substring(0, 22) + '...';
        }
        pdf.text(description, margin.left + 32, yPosition + 4.5);
        
        pdf.text(item.quantity.toString(), margin.left + 118, yPosition + 4.5);
        pdf.text(`$${item.price.toFixed(2)}`, margin.left + 145, yPosition + 4.5);
        pdf.text(`$${item.total_price.toFixed(2)}`, margin.left + 173, yPosition + 4.5);

        yPosition += rowHeight;
      });

      yPosition += 10;

      // Summary Section
      const summaryX = margin.left + contentWidth - 60;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 100, 100);
      
      // Summary lines
      const summaryItems = [
        ['Subtotal', `$${invoice.subtotal.toFixed(2)}`],
        [`Tax (${((invoice.tax / invoice.subtotal) * 100).toFixed(0)}%)`, `$${invoice.tax.toFixed(2)}`]
      ];

      summaryItems.forEach((item) => {
        pdf.text(item[0], summaryX, yPosition);
        pdf.text(item[1], summaryX + 40, yPosition);
        yPosition += 6;
      });

      // Total line with background
      yPosition += 5;
      pdf.setFillColor(240, 240, 240);
      pdf.rect(summaryX - 2, yPosition - 6, 54, 10, 'F');
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text('Amount Due', summaryX, yPosition);
      pdf.text(`$${invoice.total_amount.toFixed(2)}`, summaryX + 40, yPosition);

      // Footer line
      yPosition += 15;
      pdf.setLineWidth(0.5);
      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin.left, yPosition, margin.left + contentWidth, yPosition);

      // Save the PDF
      pdf.save(opts.filename!);
    } catch (error) {
      console.error('Error generating invoice PDF:', error);
      throw new Error('Failed to generate invoice PDF');
    }
  }

  /**
   * Generate PDF from invoice element selector
   */
  static async generateFromSelector(
    selector: string,
    options: Partial<PDFOptions> = {}
  ): Promise<void> {
    const element = document.querySelector(selector) as HTMLElement;
    if (!element) {
      throw new Error(`Element with selector "${selector}" not found`);
    }
    
    return this.generateFromElement(element, options);
  }
}

// Export utility functions
export const downloadInvoicePDF = async (
  invoice: TInvoiceDetail,
  options?: Partial<PDFOptions>
) => {
  return InvoicePDFGenerator.generateInvoicePDF(invoice, options);
};

export const downloadElementAsPDF = async (
  element: HTMLElement,
  options?: Partial<PDFOptions>
) => {
  return InvoicePDFGenerator.generateFromElement(element, options);
};

export const downloadSelectorAsPDF = async (
  selector: string,
  options?: Partial<PDFOptions>
) => {
  return InvoicePDFGenerator.generateFromSelector(selector, options);
};