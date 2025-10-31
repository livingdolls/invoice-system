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

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <div className="bg-gray-50 border border-gray-300 rounded-md px-3 py-2">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              invoice.status === "paid"
                ? "bg-green-100 text-green-800"
                : invoice.status === "unpaid"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Total Amount */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Total Amount
        </label>
        <div className="bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-gray-900 font-semibold">
          $
          {invoice.total_amount.toLocaleString("en-US", {
            minimumFractionDigits: 2,
          })}
        </div>
      </div>
    </div>
  );
}
