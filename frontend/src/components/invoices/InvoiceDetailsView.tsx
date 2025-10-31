import type { TInvoiceDetail } from "../../types/invoice";

interface InvoiceDetailsViewProps {
  invoice: TInvoiceDetail;
}

export default function InvoiceDetailsView({
  invoice,
}: InvoiceDetailsViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Invoice Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Invoice Number
        </label>
        <div className="bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-gray-900">
          {invoice.invoice_number || "-"}
        </div>
      </div>

      {/* Subject */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subject
        </label>
        <div className="bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-gray-900">
          {invoice.subject || "-"}
        </div>
      </div>

      {/* Issue Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Issue Date
        </label>
        <div className="bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-gray-900">
          {invoice.issue_date
            ? new Date(invoice.issue_date).toLocaleDateString()
            : "-"}
        </div>
      </div>

      {/* Due Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Due Date
        </label>
        <div className="bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-gray-900">
          {invoice.due_date
            ? new Date(invoice.due_date).toLocaleDateString()
            : "-"}
        </div>
      </div>
    </div>
  );
}
